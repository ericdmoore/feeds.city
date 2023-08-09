// Assumes single  Key/Secret for ALL aws needs
// Polly, S3, Dynamo, Cloudfront
// Assumes Table Exists

/*
@HELP This Plugin would benefit greatly (enhancing the listening pleasure for every page) by using a :
- a text sanitizer removing semantic HTML tags from the corpus.
- a text sanitizer to parenthetically call out visual aids
  + like an image describer API
  + a fallback mechanism to make sense of alt tags / caption

*/

import * as s from "superstruct";
import type { PromiseOr } from "../../types.ts";

import {
	type ASTcomputable,
	type ASTFeedItemJsonTYPE,
	type ASTjson,
	computableToJson,
	rezVal,
} from "../../parsers/ast.ts";

import { ASTChainFunc } from "../index.ts";

// import { toRequest, toHttpRequest} from '$lib/clients/aws-url-signer.ts'

import {
	type OutputFormat,
	OutputFormatMimeEnum,
	pollyClient,
	type PollyClientInterface,
	type StartSpeechTaskRequired,
	type Status,
	type SynthesisRequest,
	type SynthesisTaskConfig,
	type SynthesisTaskIdentifiers,
	type SynthesisTaskResponse,
	type VoiceId,
} from "../../clients/aws-polly.ts";

import { identicon } from "../../clients/svg-avatars.ts";

import {
	DynamoDBClient,
	GetItemCommand,
	PutItemCommand,
} from "@aws-sdk/client-dynamodb";

import { marshall } from "@aws-sdk/util-dynamodb";

import {
	GetObjectCommand,
	GetObjectCommandInput,
	GetObjectOutput,
	// GetObjectCommandOutput,
	HeadObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";

// import type { Client } from "@aws-sdk/types"
import { getSignedUrl} from "@aws-sdk/s3-request-presigner";

// import { Sha256 } from "@aws-crypto/sha256-js";
// Uncached or missing remote URL: "https://esm.sh/v129/@aws-sdk/types".


import { hmac } from "../../utils/hmac.ts";
import { extname } from "$std/path/mod.ts"

// #region types

type AST = ASTjson | ASTcomputable;

interface BreadCrumbCacheMeta {
	"ETag": string;
	"Content-Length": string;
	"Content-Type": string;
	"Last-Modified": string;
	"Content-Encoding"?: string;
	"Cache-Control"?: string;
}

interface CachedStatusData {
	sk: string;
	pk: string;
	task: SynthesisTaskConfig;
	taskIDs: SynthesisTaskIdentifiers;
	item: ASTFeedItemJsonTYPE;
	meta: {
		item?: BreadCrumbCacheMeta;
	};
}

// #endregion types

const enc = new TextEncoder();

export const text2VoiceParams = s.object({
	aws: s.object({
		key: s.string(),
		secret: s.string(),
		region: s.string(),
		// iamUserName: s.optional(s.string()),
	}),
	config: s.object({
		s3: s.object({
			bucket: s.string(),
			prefix: s.optional(s.string()),
			client: s.optional(s.unknown()),
		}),
		polly: s.optional(s.partial(s.object({
			voiceId: s.string(),
			// from PolyClient Enum: OutputFormat
			outputFormat: s.enums(["json", "mp3", "ogg_vorbis", "pcm"]),
			sampleRate: s.string(),
			useNeuralEngine: s.boolean(),
			isPlainText: s.boolean(),
			onCompletion: s.object({ snsTopic: s.string() }),
			client: s.optional(s.unknown()),
		}))),
		cloudfront: s.optional(s.object({
			host: s.string(),
			expiresAfterSeconds: s.optional(s.number()),
		})),
		dynamo: s.optional(s.object({
			client: s.optional(s.unknown()),
			table: s.optional(s.string()),
		})),
	}),
});

const defCfgType = s.object({
	aws: text2VoiceParams.schema.aws,
	s3: s.object({
		...text2VoiceParams.schema.config.schema.s3.schema,
		prefix: s.string(),
	}),
	dynamo: s.optional(s.object({
		...text2VoiceParams.schema.config.schema.dynamo.schema,
		table: s.optional(s.string())
	})),
	cloudfront: s.optional(s.object({
		host: s.string(),
		expiresAfterSeconds: s.optional(s.number()),
	})),
	polly: s.object({
		...text2VoiceParams.schema.config.schema.polly.schema,
		voiceId: s.string(),
		outputFormat: s.enums(["json", "mp3", "ogg_vorbis", "pcm"]),
		sampleRate: s.string(),
		useNeuralEngine: s.boolean(),
		isPlainText: s.boolean(),
	}),
});

export const splitSynthTaskResponse = (
	resp: SynthesisTaskResponse,
): { config: SynthesisTaskConfig; taskIDs: SynthesisTaskIdentifiers } => {
	const {
		CreationTime,
		RequestCharacters,
		OutputUri,
		TaskId,
		TaskStatus,
		TaskStatusReason,
		SnsTopicArn,
		...config
	} = resp;
	return {
		config,
		taskIDs: {
			CreationTime,
			RequestCharacters,
			OutputUri,
			TaskId,
			TaskStatus,
			TaskStatusReason,
			SnsTopicArn,
		}
	};
};

export const signS3Urlsigner = ( creds: { accessKeyId: string; secretAccessKey: string}) => 
(input: GetObjectCommandInput & {region: string}): Promise<string> => {
	const client = new S3Client({
		region: input.region, 
		credentials: creds,
	})
	
	// deno-lint-ignore no-explicit-any
	return getSignedUrl(client as any,
		// deno-lint-ignore no-explicit-any
		new GetObjectCommand(input) as any, 
		{ expiresIn: 3600 }
	);
}


export const pluckAudioURI = (bucket: string, s3uri: string) => {
	const s3url = new URL(s3uri);
	const indexes = bucket.includes(".") ? { key: 2, region: 1 } : { key: 1, region: 2 };
	return {
		bucket,
		key: s3url.pathname.split("/")[indexes.key],
		region: s3url.hostname.split(".")[indexes.region],
		ext: extname(s3url.pathname),
	};
};

/**
 * Text To Voice
 * @param params
 * @param ast
 */
export const textToVoice = (params: s.Infer<typeof text2VoiceParams>) =>
async (_ast: PromiseOr<AST>): Promise<ASTjson> => {
	// check key,secret permissions
	// s3: read, write
	// polly send, sendTask

	const ast = await computableToJson(_ast);
	
	const defCfg = {
		aws: { ...params.aws },
		s3: {
			...params.config.s3,
			prefix: "",
		},
		dynamo: params.config.dynamo,
		cloudfront: params.config.cloudfront,
		polly: {
			voiceId: "Matthew" as VoiceId,
			outputFormat: "mp3" as OutputFormat,
			sampleRate: "24000",
			useNeuralEngine: true,
			isPlainText: true,
			...params.config.polly,
		} as typeof params.config.polly,
	};

	const [err, validatedData] = defCfgType.validate(defCfg);
	
	if (err) {
		return Promise.reject({ msg: "Input Validate Error", err, code: 400 });
	}

	const handleItem = makeItemHandler(
		validatedData,
		params.config.polly?.client as PollyClientInterface 
			?? pollyClient(
				defCfg.aws.key,
				defCfg.aws.secret,
				defCfg.aws.region,
			),
		{
			Bucket: defCfg.s3.bucket,
			Prefix: defCfg.s3.prefix,
			s3c: params.config.s3.client as S3Client
				?? new S3Client({
					region: defCfg.aws.region,
					credentials: {
						accessKeyId: defCfg.aws.key,
						secretAccessKey: defCfg.aws.secret,
					},
				}),
		}
	);

	return {
		...ast,
		items: await Promise.all(ast.items.map(handleItem)),
	};
};

const inProgressPlaceholderURL = (statusMsg: string) => (rectStr: string, fill: string) => {
	return `
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1.5 -1.5 8 8" width="100" height="100" ${fill}>
			${rectStr}
			<text x="2" y="6" font-size="1.3" fill="red" transform="rotate(-30 -2, 8)" >${statusMsg}</text>
		</svg>`;
};

const scheduledPlaceholderURL = (statusMsg: string) => (rectStr: string, fill: string) => {
	return `
		<svg xmlns="http://www.w3.org/2000/svg" height="60" width="200" ${fill}>
			${rectStr}
			<text x="2" y="6" font-size="1.3" fill="red" transform="rotate(-30 -2, 8)" >${statusMsg}</text>
	</svg>`;
};

const placeholderURL = (status: Status) =>
	status === "inProgress"
		? inProgressPlaceholderURL("In Progress")
		: scheduledPlaceholderURL("Scheduled");

export const makeKey = async (config: unknown, itemText: string) => {
	const dec = new TextDecoder();
	
	const sig = (msg: string, key?: string) =>
		hmac("SHA-256", enc.encode(key ?? msg), enc.encode(msg), "hex");

	const configStr = typeof config === "string" 
		? config 
		: JSON.stringify(config)

	// HMAC-SHA256(:msg, :key)
	//
	// HMAC-SHA256( HMAC-SHA256(data, data), HMAC-SHA256(config, config) )
	//
	const dataHMAC = dec.decode(await sig(itemText)) as string;
	const configHMAC = dec.decode( await sig(configStr)) as string;	
	const combo = dec.decode(await sig(dataHMAC, configHMAC))
	return `k01://${combo}`;
};

const urlSafeKey = (itemKey:string)=>itemKey.replace("://", "!!")

export const checkChache = async (
	itemKey: string,
	s3: { s3c: S3Client; Bucket: string; Prefix: string },
	dyn?: { dyc: DynamoDBClient; Table: string },
): Promise<CachedStatusData | null> => {
	
	// console.log(332, {itemKey, s3, dyn})

	if (dyn) {
		console.log("using dynamo - not s3");
		const GetItemCmd = new GetItemCommand({
			TableName: dyn.Table,
			Key: marshall({ pk: itemKey, sk: itemKey }),
		});

		const dynoResp = await dyn.dyc.send(GetItemCmd).catch(() => null) as
			| CachedStatusData
			| null;
		return dynoResp;

	} else {

		let s3CacheCrumb: null | GetObjectOutput
		try{
			s3CacheCrumb = await s3.s3c.send(
				new GetObjectCommand({
					Bucket: s3.Bucket,
					Key: urlSafeKey(itemKey) + ".json",
				})
			) as GetObjectOutput
		}catch(er){
			console.error(er)
			s3CacheCrumb = null
		}
		
		// console.log(349, { s3CacheCrumb })

		if (s3CacheCrumb) {
			const str = await (s3CacheCrumb.Body as unknown as StringConvertable).transformToString('utf-8')!;
			return JSON.parse(str) as CachedStatusData;
		} else {
			return null;
		}
	}
};

interface StringConvertable{
	transformToString: (enc: 'utf-8' | string) => Promise<string>
}

export const isMediaFinished = (bc: CachedStatusData) =>
	bc.taskIDs.TaskStatus?.toLowerCase() === "completed";

export const sendToCache = async (
	item: ASTFeedItemJsonTYPE,
	itemKey: string,
	taskConfig: SynthesisTaskConfig,
	taskIDs: SynthesisTaskIdentifiers,
	s3: { s3c: S3Client; Bucket: string; Prefix: string },
	dyn?: { dyc: DynamoDBClient; Table: string },
	meta?: BreadCrumbCacheMeta,
): Promise<CachedStatusData & { taskIDs: SynthesisTaskIdentifiers }> => {

	const icon = identicon(itemKey);

	console.log(386, {
		item
	   ,itemKey
	   ,taskConfig
	   ,taskIDs
	   ,s3
	   ,dyn
	   ,meta
	   ,icon
   })
	
	const saved = {
		sk: itemKey,
		pk: itemKey,
		item,
		meta: { item: meta },
		task: taskConfig,
		taskIDs,
		imageUrls: {
			base64: `data:image/svg+xml;base64,${
				btoa(placeholderURL(taskIDs.TaskStatus)(icon.rectStr, icon.fill))
			}`,
			svgText: `data:image/svg+xml;${
				encodeURIComponent(
					placeholderURL(taskIDs.TaskStatus)(icon.rectStr, icon.fill),
				)
			}`,
		},
	} as CachedStatusData & { taskIDs: SynthesisTaskIdentifiers }

	console.log(395, { saved });

	if (dyn?.dyc) {
		await dyn.dyc.send(new PutItemCommand({
			TableName: dyn.Table, 
			Item: marshall(saved)
		}));
	}

	if(s3.s3c){
		await s3.s3c.send(
			new PutObjectCommand({
				Bucket: s3.Bucket,
				Key: urlSafeKey(itemKey)+ ".json",
				Body: JSON.stringify(saved, null, 2)
		}));
	}
	return saved
};

export const makeItemHandler = (
	config: s.Infer<typeof defCfgType>,
	pc: PollyClientInterface,
	s3: { s3c: S3Client; Prefix: string; Bucket: string },
	dyn?: { dyc: DynamoDBClient; Table: string },
) =>
async (
	item: ASTFeedItemJsonTYPE,
	_itemNumber: number,
	_list: ASTFeedItemJsonTYPE[],
): Promise<ASTFeedItemJsonTYPE> => {
	
	const content = await rezVal(item.content);
	const chosenText = content.text ??
		content.markdown ??
		content.article ??
		content.html ??
		content.raw ??
		"no text provided";

	const itemKey = await makeKey(config.polly, chosenText);

	const cacheItem = await checkChache(
		itemKey,
		s3,
		dyn,
	);

	console.log(452, {cacheItem})

	if (cacheItem) {
		if (isMediaFinished(cacheItem)) {
			// console.log(442, '...media is finished, update the cache >> ', cacheItem);

			// complete but somehow missed the
			if (!cacheItem.meta?.item) {

				const s3AudioLoc = pluckAudioURI(
					config.s3.bucket,
					cacheItem.taskIDs.OutputUri,
				);

				const s3r = await s3.s3c.send(
					new HeadObjectCommand({
					Bucket: s3.Bucket,
					Key: `${s3.Prefix}${s3AudioLoc.key}`,
					}
				)).catch(() => null);
				
				const meta = {
					ETag: s3r?.ETag ?? "etag:missing",
					"Content-Length": s3r?.ContentLength ?? "contentLength:missing",
					"Content-Type": s3r?.ContentType ?? "contentType:missing",
					"Last-Modified": s3r?.LastModified ?? "lastModified:missing",
					"Cache-Control": s3r?.CacheControl,
					"Content-Encoding": s3r?.ContentEncoding,
				} as BreadCrumbCacheMeta;

				console.log(494, { s3r, meta });

				const breadcrumbs = await sendToCache(
					item,
					itemKey,
					cacheItem.task,
					cacheItem.taskIDs,
					s3,
					dyn,
					meta,
				);

				// item.__enhancement = {
				// 	...item.__enhancement,
				// 	...downStreamStatus(breadcrumbs),
				// };
				// item.attachments.push(await addAttachment(item, breadcrumbs, itemKey, config, chosenText));
		
				return {
					...item,
					attachments: 
						item.attachments.concat(
							await addAttachment(item, breadcrumbs, itemKey, config, chosenText)
						),
					__enhancement: {
						...item.__enhancement,
						...downStreamStatus(breadcrumbs),
					}
				};
			} else {

				return {
					...item,
					__enhancement: {
						...item.__enhancement,
						...downStreamStatus(cacheItem),
					},
					attachments: item.attachments.concat(
						await addAttachment(item, cacheItem, itemKey, config, chosenText)
					)
				};
			}
		} else {
			console.log(495, '...update the cache >> ', cacheItem);
			console.log({ taskID: cacheItem.taskIDs.TaskId });

			const resp = await pc.GetSpeechSynthesisTask(cacheItem.taskIDs.TaskId).json();
			const { taskIDs, ...tcfg } = splitSynthTaskResponse(resp.SynthesisTask);
			const breadcrumbs = await sendToCache(
				item,
				itemKey,
				tcfg.config,
				taskIDs,
				s3,
				dyn,
			);
			console.log(537, { breadcrumbs });

			return {
				...item,
				__enhancement: {
					...item.__enhancement,
					...downStreamStatus(breadcrumbs),
				},
				attachments: item.attachments.concat(
					await addAttachment(item, breadcrumbs, itemKey, config, chosenText)
				),
			}
		}
	} else {
		// cache miss (new content needing auddio )
		const taskCommandReqd: StartSpeechTaskRequired = {
			Text: chosenText,
			OutputS3BucketName: config.s3.bucket,
			OutputS3KeyPrefix: config.s3.prefix,
		};
		const taskCommandOpts: Partial<SynthesisRequest> = {
			OutputFormat: config.polly.outputFormat,
			VoiceId: config.polly.voiceId as VoiceId,
			SampleRate: config.polly.sampleRate,
			TextType: config.polly.isPlainText ? "text" : "ssml",
			Engine: config.polly.useNeuralEngine ? "neural" : "standard",
			...(config.polly.onCompletion?.snsTopic
				? { SnsTopicArn: config.polly.onCompletion?.snsTopic }
				: {}
			),
		};

		const commandResponse = await pc.StartSpeechSynthesisTask(
			taskCommandReqd,
			taskCommandOpts,
		).json();

		console.log(434, { commandResponse });

		const { taskIDs, ...tcfg } = splitSynthTaskResponse(
			commandResponse.SynthesisTask,
		);

		const breadcrumbs = await sendToCache(
			item,
			itemKey,
			tcfg.config,
			taskIDs,
			s3,
			dyn,
		);

		console.log(561, { breadcrumbs });

		return {
			...item,
			attachments: item.attachments.concat(
				await addAttachment(item, breadcrumbs, itemKey, config, chosenText)
			),
			__enhancement: {
				...item.__enhancement,
				...downStreamStatus(breadcrumbs),
			}
		};
	}
};


const downStreamStatus = (bc: CachedStatusData) => ({
	addVoice2Text: { [`${bc.pk}-${bc.sk}`]: bc.taskIDs.TaskStatus },
});

const addAttachment = async (
	item: ASTFeedItemJsonTYPE,
	bc: CachedStatusData,
	k: string,
	config: s.Infer<typeof defCfgType>,
	chosenText: string
) => {
	// console.log(614, {  bc, k, config, chosenText });

	const s3urlsigner = signS3Urlsigner({
		accessKeyId: config.aws.key,
		secretAccessKey: config.aws.secret,
	});

	const icon = identicon(k);
	const sizeInBytes = Number.parseInt(
		bc.meta.item?.["Content-Length"] ??
			(bc.taskIDs.RequestCharacters * 12).toString(),
	);
	
	const durationInSeconds = sizeInBytes / 6050; // magic number averaged out from 5 samples below
	const s3urlparts = pluckAudioURI(
		config.s3.bucket,
		bc.taskIDs.OutputUri,
	);

	const url = await s3urlsigner({
		Bucket: s3urlparts.bucket, 
		region: s3urlparts.region,
		Key: s3urlparts.key
	})
	
	return {
		url,
		title: item.title ??
			"AWS/Polly Audio for: " + chosenText.slice(0, 20) + "...",
		sizeInBytes,
		durationInSeconds,
		mimeType: OutputFormatMimeEnum[config.polly.outputFormat],
		_: {
			characters: bc.taskIDs.RequestCharacters,
			status: bc.taskIDs.TaskStatus,
			etag: bc.meta.item?.ETag ?? null,
			meta: bc.meta.item,
			imageUrls: {
				base64: `data:image/svg+xml;base64,${
					btoa(placeholderURL(bc.taskIDs.TaskStatus)(icon.rectStr, icon.fill))
				}`,
				svgText: `data:image/svg+xml;${
					encodeURIComponent(
						placeholderURL(bc.taskIDs.TaskStatus)(icon.rectStr, icon.fill),
					)
				}`,
			},
		},
	};
};

export default textToVoice as ASTChainFunc


/**
 * 
 * 
 * 
 * invoked with the AST
 * for each item in the list
 * 
 *   Make a cache key based on `item.content`
 *  
 * 	 Does the cache have the key?
 * 
 *   N: start a self-caching "polly task" with the item content
 *      add placeholder content to the AST item
 * 
 *   Y: Grab the Cache Data
 *       
 * 		cache status is complete?
 * 
 * 		Y: Inject COMPLETED attachment into the AST item (mutate/replace the item witihn the AST list)
 * 
 * 		N: Inject INPROGRESS attachment into the AST item (mutate/replace the item witihn the AST list)
 * 
 */