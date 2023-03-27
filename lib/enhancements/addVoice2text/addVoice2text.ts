// Assumes Same Key/Secret for ALL aws needs
// Polly, S3, Dynamo, Cloudfront
// Assumes Table Exists

/*
@HELP Plugin would benefit greatly from:
- a text sanitizer removing semantic HTML tags from the corpus.
- a text sanitizer to parenthetically call out visual aids - think of a image to caption API
	- which would greatly enhance the listening pleasure for every page
*/

import { type PromiseOr } from "../../../types.ts";
import {
  type ASTcomputable,
  type ASTFeedItemJsonTYPE,
  type ASTjson,
  computableToJson,
  rezVal,
} from "../../parsers/ast.ts";
import { superstruct as s } from "../../../deps.ts";
import { streamToString } from "../../utils/pumpReader.ts";

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

// mod.ts audit: OK
import {
  createClient,
  DynamoDBClient,
} from "https://denopkg.com/ericdmoore/dynamodb-deno@v1.1.0/mod.ts";

import { S3Bucket } from "https://denopkg.com/ericdmoore/s3_deno@main/mod.ts";
import { hmac } from "https://deno.land/x/hmac@v2.0.1/mod.ts";
import { extname } from "https://deno.land/std@0.151.0/path/mod.ts";
import { getSignedUrl } from "https://deno.land/x/aws_s3_presign@1.3.0/mod.ts";

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

interface BreadcrumbCache {
  sk: string;
  pk: string;
  task: SynthesisTaskConfig;
  taskIDs: SynthesisTaskIdentifiers;
  item: ASTFeedItemJsonTYPE;
  meta: {
    item?: BreadCrumbCacheMeta;
  };
}

interface pollyConfig {
  VoiceId: VoiceId;
  OutputFormat: OutputFormat;
  SampleRate: string;
  useNeuralEngine: true;
  isPlainText: true;
}

// #endregion types

const encoder = new TextEncoder();

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
    }),
    polly: s.optional(s.partial(s.object({
      voiceId: s.string(),
      // from PolyClient Enum: OutputFormat
      outputFormat: s.enums(["json", "mp3", "ogg_vorbis", "pcm"]),
      sampleRate: s.string(),
      useNeuralEngine: s.boolean(),
      isPlainText: s.boolean(),
      onCompletion: s.object({
        snsTopic: s.string(),
      }),
    }))),
    cloudfront: s.optional(s.object({
      host: s.string(),
      expiresAfterSeconds: s.optional(s.number()),
    })),
    dynamo: s.optional(s.object({
      table: s.string(),
    })),
  }),
});

const defCfgType = s.object({
  aws: text2VoiceParams.schema.aws,
  s3: s.object({
    ...text2VoiceParams.schema.config.schema.s3.schema,
    prefix: s.string(),
  }),
  cloudfront: s.optional(s.object({
    host: s.string(),
    expiresAfterSeconds: s.optional(s.number()),
  })),
  dynamo: s.optional(s.object({ table: s.string() })),
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
    taskIDs: {
      CreationTime,
      RequestCharacters,
      OutputUri,
      TaskId,
      TaskStatus,
      TaskStatusReason,
      SnsTopicArn,
    },
    config,
  };
};

const signS3Urlsigner = (
  i: { accessKeyId: string; secretAccessKey: string },
  method: "GET" | "PUT" = "GET",
  expiresIn = 3600,
) =>
(
  j: { bucketName: string; region: string; objectPath: string },
  date = new Date(),
) => getSignedUrl({ ...i, ...j, method, expiresIn, date });

export const splitBucketItemURL = (bucket: string, s3uri: string) => {
  const s3url = new URL(s3uri);
  const indexes = bucket.includes(".")
    ? { key: 2, region: 1 }
    : { key: 1, region: 2 };
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
export const textToVoice = (
  userParams: s.Infer<typeof text2VoiceParams>,
  pc?: PollyClientInterface,
  s3c?: S3Bucket,
  dynC?: DynamoDBClient,
) =>
async (_ast: PromiseOr<AST>): Promise<ASTjson> => {
  // check key,secret permissions
  // s3: read, write
  // polly send, sendTask

  const ast = await computableToJson(_ast);

  const defCfg = {
    aws: { ...userParams.aws },
    s3: {
      prefix: "",
      ...userParams.config.s3,
    },
    dynamo: userParams.config.dynamo,
    cloudfront: userParams.config.cloudfront,
    polly: {
      voiceId: "Matthew" as VoiceId,
      outputFormat: "mp3" as OutputFormat,
      sampleRate: "24000",
      useNeuralEngine: true,
      isPlainText: true,
      ...userParams.config.polly,
    } as typeof userParams.config.polly,
  };

  const [err, validatedData] = defCfgType.validate(defCfg);
  if (err) {
    return Promise.reject({ msg: "Input Validate Error", err, code: 400 });
  }

  const handleItem = makeItemHandler(
    validatedData,
    pc ?? pollyClient(
      defCfg.aws.key,
      defCfg.aws.secret,
      defCfg.aws.region,
    ),
    s3c ?? new S3Bucket({
      bucket: defCfg.s3.bucket,
      region: defCfg.aws.region,
      accessKeyID: defCfg.aws.key,
      secretKey: defCfg.aws.secret,
    }),
    dynC
      ? {
        table: userParams.config.dynamo?.table ?? ">> MISSING TABLE",
        c: createClient({
          region: defCfg.aws.region,
          credentials: {
            accessKeyId: defCfg.aws.key,
            secretAccessKey: defCfg.aws.secret,
          },
        }),
      }
      : dynC,
  );

  return {
    ...ast,
    items: await Promise.all(ast.items.map(handleItem)),
  };
};

const inProgressPlaceholderURL =
  (statusMsg: string) => (rectStr: string, fill: string) => {
    return `
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1.5 -1.5 8 8" width="100" height="100" ${fill}>
			${rectStr}
			<text x="2" y="6" font-size="1.3" fill="red" transform="rotate(-30 -2, 8)" >${statusMsg}</text>
		</svg>`;
  };

const scheduledPlaceholderURL =
  (statusMsg: string) => (rectStr: string, fill: string) => {
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
  const sig = (msg: string, key = "key") =>
    hmac("sha256", key, msg, undefined, "hex") as string;
  const configHMAC = sig(
    typeof config === "string" ? config : JSON.stringify(config),
  );
  const dataHMAC = sig(itemText);
  return `k01://${await sig(dataHMAC, configHMAC)}`;
};

export const haveEverStarted = async (
  itemKey: string,
  s3c: S3Bucket,
  dyn?: { c: DynamoDBClient; table: string },
): Promise<BreadcrumbCache | null> => {
  if (dyn) {
    console.log("using dynamo - not s3");

    const dynoResp = await dyn.c.getItem({
      TableName: dyn.table,
      Key: { pk: itemKey, sk: itemKey },
    }).catch(() => null) as BreadcrumbCache | null;

    return dynoResp;
  } else {
    // https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html
    const s3CacheCrumb = await s3c.getObject(
      itemKey.replace("://", ".!!") + ".json",
    );

    if (s3CacheCrumb) {
      const s3Str = await streamToString(s3CacheCrumb?.body);
      return JSON.parse(s3Str) as BreadcrumbCache;
    } else {
      return null;
    }
  }
};

export const isMediaFinished = (bc: BreadcrumbCache) =>
  bc.taskIDs.TaskStatus?.toLowerCase() === "completed";

export const cacheOurBreadcrumbs = async (
  item: ASTFeedItemJsonTYPE,
  itemKey: string,
  taskConfig: SynthesisTaskConfig,
  taskIDs: SynthesisTaskIdentifiers,
  s3c: S3Bucket,
  dyn?: { c: DynamoDBClient; table: string },
  meta?: BreadCrumbCacheMeta,
): Promise<BreadcrumbCache & { taskIDs: SynthesisTaskIdentifiers }> => {
  const icon = identicon(itemKey);
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
  } as BreadcrumbCache;

  // console.log({ saved, icon });

  if (dyn) await dyn.c.putItem({ TableName: dyn.table, Item: saved });

  const s3keyName = itemKey.replace("://", ".!!");
  await s3c.putObject(
    s3keyName + ".json",
    encoder.encode(JSON.stringify(saved, null, 2)),
  );

  return { ...saved, taskIDs } as BreadcrumbCache & {
    taskIDs: SynthesisTaskIdentifiers;
  };
};

export const makeItemHandler = (
  config: s.Infer<typeof defCfgType>,
  pc: PollyClientInterface,
  s3c: S3Bucket,
  dyn?: { c: DynamoDBClient; table: string },
) =>
async (
  item: ASTFeedItemJsonTYPE,
  _itemNumber: number,
  _list: ASTFeedItemJsonTYPE[],
): Promise<ASTFeedItemJsonTYPE> => {
  const s3url = signS3Urlsigner({
    accessKeyId: config.aws.key,
    secretAccessKey: config.aws.secret,
  });

  const content = await rezVal(item.content);
  const chosenText = content.text ??
    content.markdown ??
    content.article ??
    content.html ??
    content.raw ??
    "no text provided";

  const k = await makeKey(config.polly, chosenText);

  const downStreamStatus = (bc: BreadcrumbCache) => ({
    addVoice2Text: { [`${bc.pk}-${bc.sk}`]: bc.taskIDs.TaskStatus },
  });

  const addAttachment = (
    item: ASTFeedItemJsonTYPE,
    bc: BreadcrumbCache,
    k: string,
  ) => {
    const icon = identicon(k);
    const sizeInBytes = Number.parseInt(
      bc.meta.item?.["Content-Length"] ??
        (bc.taskIDs.RequestCharacters * 12).toString(),
    );
    const durationInSeconds = sizeInBytes / 6050; // magic number averaged out from 5 samples below
    const s3urlparts = splitBucketItemURL(
      config.s3.bucket,
      bc.taskIDs.OutputUri,
    );
    const url = s3url({
      bucketName: s3urlparts.bucket,
      region: s3urlparts.region,
      objectPath: s3urlparts.key,
    });

    // console.log('s3url:', url)

    return {
      title: item.title ??
        "AWS/Polly Audio for: " + chosenText.slice(0, 20) + "...",
      url,
      sizeInBytes,
      durationInSeconds,
      characters: bc.taskIDs.RequestCharacters,
      status: bc.taskIDs.TaskStatus,
      etag: bc.meta.item?.ETag ?? null,
      mimeType: OutputFormatMimeEnum[config.polly.outputFormat],
      _: {
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

  const cacheItem = await haveEverStarted(k, s3c, dyn);

  if (cacheItem) {
    if (isMediaFinished(cacheItem)) {
      // console.log('...media is finished, update the cache >> ', cacheItem);

      // complete but somehow missed thge
      if (!cacheItem.meta?.item) {
        const s3parts = splitBucketItemURL(
          config.s3.bucket,
          cacheItem.taskIDs.OutputUri,
        );
        const s3r = await s3c.headObject(s3parts.key).catch(() => null);
        // console.log({ s3r });

        const meta = {
          ETag: s3r?.etag ?? "etag:missing",
          "Content-Length": s3r?.contentLength ?? "contentLength:missing",
          "Content-Type": s3r?.contentType ?? "contentType:missing",
          "Last-Modified": s3r?.lastModified ?? "lastModified:missing",
          "Cache-Control": s3r?.cacheControl,
          "Content-Encoding": s3r?.contentEncoding,
        } as BreadCrumbCacheMeta;

        const breadcrumbs = await cacheOurBreadcrumbs(
          item,
          k,
          cacheItem.task,
          cacheItem.taskIDs,
          s3c,
          dyn,
          meta,
        );

        item.__enhancement = {
          ...item.__enhancement,
          ...downStreamStatus(breadcrumbs),
        };
        item.attachments.push(addAttachment(item, breadcrumbs, k));
        return item;
      } else {
        item.__enhancement = {
          ...item.__enhancement,
          ...downStreamStatus(cacheItem),
        };
        item.attachments.push(addAttachment(item, cacheItem, k));
        return item;
      }
    } else {
      // console.log('...updating the cache >> ', cacheItem);
      // console.log({ taskID: cacheItem.taskIDs.TaskId });

      const resp = await pc.GetSpeechSynthesisTask(cacheItem.taskIDs.TaskId)
        .json();
      const { taskIDs, ...tcfg } = splitSynthTaskResponse(resp.SynthesisTask);
      const breadcrumbs = await cacheOurBreadcrumbs(
        item,
        k,
        tcfg.config,
        taskIDs,
        s3c,
        dyn,
      );
      // console.log({ breadcrumbs });

      item.__enhancement = {
        ...item.__enhancement,
        ...downStreamStatus(breadcrumbs),
      };
      item.attachments.push(addAttachment(item, breadcrumbs, k));
      return item;
    }
  } else {
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
        : {}),
    };

    // console.log('nice to meet you, Ill create some audio for ya!');

    const commandResponse = await pc.StartSpeechSynthesisTask(
      taskCommandReqd,
      taskCommandOpts,
    ).json();
    // console.log(434, { commandResponse });

    const { taskIDs, ...tcfg } = splitSynthTaskResponse(
      commandResponse.SynthesisTask,
    );
    const breadcrumbs = await cacheOurBreadcrumbs(
      item,
      k,
      tcfg.config,
      taskIDs,
      s3c,
      dyn,
    );
    // console.log({ breadcrumbs });

    item.__enhancement = {
      ...item.__enhancement,
      ...downStreamStatus(breadcrumbs),
    };
    item.attachments.push(addAttachment(item, breadcrumbs, k));

    return item;
  }
};
