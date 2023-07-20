// import { awsV4Sig } from "./aws-url-signer.ts";

// mod.ts audit: OK
import { stringify as qsStringify } from "https://deno.land/x/querystring@v1.0.2/mod.js";
import { sigMaker } from '$lib/clients/aws-url-signer.ts'
import type { PromiseOr } from '$lib/types.ts'

// #region types
export type Engine = "neural" | "standard";
export type OutputFormat = "json" | "mp3" | "ogg_vorbis" | "pcm";
export enum OutputFormatMimeEnum {
	json = "application/json",
	mp3 = "audio/mp3",
	ogg_vorbis = "audio/ogg",
	pcm = "audio/pcma",
}
export type SpeechMarkTypes = ("sentence" | "ssml" | "viseme" | "word")[];
export type Gender = "Female" | "Male";
export type Status = "scheduled" | "inProgress" | "completed" | "failed";
export type TextType = "ssml" | "text";
export type SampleRate = string;

export type LexiconNames = string[];
export type Text = string;
/*
 Phonetic alphabet used in the lexicon. Valid values are ipa and x-sampa
*/
export type Alphabet = string;
export type Content = string;
export type Name = string;
export type LastModified = number;
export type LexemesCount = number;
export type LexiconArn = string;
export type Size = number;
export type AdditionalLanguageCodes = string[];

export type Id = VoiceId;

/**
 *  Human readable name of the language in English.
 */
export type LanguageName = string;

/**
 * Specifies which engines (standard or neural) that are supported by a given voice.
 */
export type SupportedEngines = Engine[];

export interface GetLexiconResponse {
	Lexicon: {
		Content: string;
		Name: string;
	};
	LexiconAttributes: {
		Alphabet: string;
		LanguageCode: string;
		LastModified: number;
		LexemesCount: number;
		LexiconArn: string;
		Size: number;
	};
}

export interface DescribeVoicesResponse {
	Voices: [
		{
			Id: Id;
			Name: Name;
			Gender: Gender;
			SupportedEngines: SupportedEngines;
			LanguageName: string;
			LanguageCode: LanguageCode;
			AdditionalLanguageCodes: LanguageCode[];
		},
	];
	NextToken: string;
}

export interface SynthesisRequest {
	Engine?: Engine;
	LanguageCode?: LanguageCode;
	LexiconNames?: Name[];
	OutputFormat: OutputFormat;
	SampleRate?: SampleRate;
	SpeechMarkTypes?: SpeechMarkTypes;
	Text: string;
	TextType?: TextType;
	VoiceId?: VoiceId;
}

export type SynthesisTaskRequest = SynthesisRequest & {
	OutputS3BucketName: string;
	OutputS3KeyPrefix: string;
	SnsTopicArn?: string;
};

export interface SynthesisTaskConfig {
	Engine: Engine;
	LanguageCode: LanguageCode;
	LexiconNames: Name[];
	OutputFormat: OutputFormat;
	SampleRate: SampleRate;
	SpeechMarkTypes: SpeechMarkTypes;
	TextType: TextType;
	VoiceId: VoiceId;
}

export interface SynthesisTaskIdentifiers {
	SnsTopicArn: string;
	RequestCharacters: number;
	CreationTime: number;
	OutputUri: string;
	TaskId: string;
	TaskStatus: Status;
	TaskStatusReason: string;
}

export type SynthesisTaskResponse =
	& SynthesisTaskConfig
	& SynthesisTaskIdentifiers;

export interface SpeechSynthesisTaskResponse {
	SynthesisTask: SynthesisTaskResponse;
}

export interface ListLexiconsResponse {
	Lexicons: [
		{
			Name: Name;
			Attributes: {
				Alphabet: Alphabet;
				LanguageCode: LanguageCode;
				LastModified: number;
				LexemesCount: number;
				LexiconArn: string;
				Size: Size;
			};
		},
	];
	NextToken: string;
}

export interface ListSpeechSynthesisTasks {
	SynthesisTasks: SynthesisTaskResponse[];
	NextToken: string;
}

export type LanguageCode =
	| "arb"
	| "cmn-CN"
	| "cy-GB"
	| "da-DK"
	| "de-DE"
	| "en-AU"
	| "en-GB"
	| "en-GB-WLS"
	| "en-IN"
	| "en-US"
	| "es-ES"
	| "es-MX"
	| "es-US"
	| "fr-CA"
	| "fr-FR"
	| "is-IS"
	| "it-IT"
	| "ja-JP"
	| "hi-IN"
	| "ko-KR"
	| "nb-NO"
	| "nl-NL"
	| "pl-PL"
	| "pt-BR"
	| "pt-PT"
	| "ro-RO"
	| "ru-RU"
	| "sv-SE"
	| "tr-TR"
	| "en-NZ"
	| "en-Z";

export type VoiceId =
	| "Aditi"
	| "Amy"
	| "Aria"
	| "Astrid"
	| "Ayanda"
	| "Bianca"
	| "Brian"
	| "Camila"
	| "Carla"
	| "Carmen"
	| "Celine"
	| "Chantal"
	| "Conchita"
	| "Cristiano"
	| "Dora"
	| "Emma"
	| "Enrique"
	| "Ewa"
	| "Filiz"
	| "Gabrielle"
	| "Geraint"
	| "Giorgio"
	| "Gwyneth"
	| "Hans"
	| "Ines"
	| "Ivy"
	| "Jacek"
	| "Jan"
	| "Joanna"
	| "Joey"
	| "Justin"
	| "Karl"
	| "Kendra"
	| "Kevin"
	| "Kimberly"
	| "Lea"
	| "Liv"
	| "Lotte"
	| "Lucia"
	| "Lupe"
	| "Mads"
	| "Maja"
	| "Marlene"
	| "Mathieu"
	| "Matthew"
	| "Maxim"
	| "Mia"
	| "Miguel"
	| "Mizuki"
	| "Naja"
	| "Nicole"
	| "Olivia"
	| "Penelope"
	| "Raveena"
	| "Ricardo"
	| "Ruben"
	| "Russell"
	| "Salli"
	| "Seoyeon"
	| "Takumi"
	| "Tatyana"
	| "Vicki"
	| "Vitoria"
	| "Zeina"
	| "Zhiyu";

export interface ResponseOptions<T = unknown> {
	response: () => Promise<Response>;
	request: () => Promise<Request>;
	json: () => Promise<T>;
	text: () => Promise<string>;
}

export interface StartSpeechTaskRequired {
	Text: string;
	OutputS3BucketName: string;
	OutputS3KeyPrefix: string;
}

export interface ListSpeechTasks {
	MaxResults: number;
	NextToken: string;
	Status: Status;
}

export interface VoiceFilters {
	Engine?: Engine;
	IncludeAdditionalLanguageCodes?: "yes" | "no";
	LanguageCode?: LanguageCode;
	NextToken?: string;
}

export interface PollyClientInterface {
	DeleteLexicon: (LexiconName: string) => ResponseOptions;
	DescribeVoices: (
		filters?: VoiceFilters,
	) => ResponseOptions<DescribeVoicesResponse>;
	GetLexicon: (LexiconName: string) => ResponseOptions<GetLexiconResponse>;
	GetSpeechSynthesisTask: (
		taskID: string,
	) => ResponseOptions<SpeechSynthesisTaskResponse>;
	ListLexicons: (NextToken?: string) => ResponseOptions;
	ListSpeechSynthesisTasks: (
		opts?: Partial<ListSpeechTasks>,
	) => ResponseOptions<ListSpeechSynthesisTasks>;
	PutLexicon: (LexiconName: string, Content: string) => ResponseOptions;
	StartSpeechSynthesisTask: (
		reqd: StartSpeechTaskRequired,
		opts?: Partial<SynthesisTaskRequest>,
	) => ResponseOptions<SpeechSynthesisTaskResponse>;
	SynthesizeSpeech: (opts: SynthesisRequest) => ResponseOptions;
}

// #endregion types

const encoder = new TextEncoder();


const middleware = async (r: PromiseOr<Request>) => {
	// @todo
	// 1.add content-length for POST

	// const req = await r
	// req.headers.set('content-length',`${}`)

	return await r;
};

const final = <T>(r: PromiseOr<Request>) => {
	return {
		request: async () => await middleware(r),
		response: async () => fetch(await middleware(r)),
		json: async () => (await fetch(await middleware(r))).json() as Promise<T>,
		text: async () => (await fetch(await middleware(r))).text(),
		__mockedResponse: async (testingResponse: unknown) => await testingResponse,
	};
};


export const pollyClient = (
	awsKey: string,
	awsSecret: string,
	region = "us-west-2",
	// iamUSer?: string,
	useFips = false,
): PollyClientInterface => {
	const service = useFips ? "polly-fips" : "polly";
	const domain = "amazonaws.com";
	const basePath = "/v1";
	// @see: https://docs.aws.amazon.com/general/latest/gr/rande.html
	const base = `https://${service}.${region}.${domain}${basePath}`;
	const addSig = sigMaker(awsKey, awsSecret, region, service);
	return {
		DeleteLexicon: (LexiconName: string) => {
			const req = new Request(`${base}/lexicons/${LexiconName}`, {
				method: "DELETE",
				headers: {},
			});
			return final(addSig(req));
		},
		DescribeVoices: (
			filters: {
				Engine?: Engine;
				IncludeAdditionalLanguageCodes?: "yes" | "no";
				LanguageCode?: LanguageCode;
				NextToken?: string;
			} = { Engine: "neural", LanguageCode: "en-US" },
		) => {
			const qs = Object.keys(filters).length > 0 ? `?${qsStringify(filters)}` : "";
			const req = new Request(`${base}/voices${qs}`, {
				method: "GET",
			});
			return final<DescribeVoicesResponse>(addSig(req));
		},
		GetLexicon: (LexiconName: string) => {
			const req = new Request(`${base}/lexicons/${LexiconName}`, {
				method: "GET",
			});
			return final<GetLexiconResponse>(addSig(req));
		},
		GetSpeechSynthesisTask: (taskID: string) => {
			const req = new Request(`${base}/synthesisTasks/${taskID}`, {
				method: "GET",
			});
			return final(addSig(req));
		},
		ListLexicons: (NextToken?: string) => {
			const qs = NextToken ? `?${qsStringify({ NextToken })}` : "";
			const req = new Request(`${base}/lexicons${qs}`, {
				method: "GET",
			});
			return final<ListLexiconsResponse>(addSig(req));
		},
		ListSpeechSynthesisTasks: (
			opts: { MaxResults?: number; NextToken?: string; Status?: Status } = {
				MaxResults: 100,
			},
		) => {
			const qs = Object.keys(opts).length > 0 ? `?${qsStringify(opts)}` : "";
			const req = new Request(`${base}/synthesisTasks${qs}`, {
				method: "GET",
			});
			return final<ListSpeechSynthesisTasks>(addSig(req));
		},
		PutLexicon: (LexiconName: string, Content: string) => {
			const req = new Request(`${base}/lexicons/${LexiconName}`, {
				method: "PUT",
				body: encoder.encode(JSON.stringify({ Content })),
			});
			return final(addSig(req));
		},
		StartSpeechSynthesisTask: (
			reqd: StartSpeechTaskRequired,
			opts?: Partial<SynthesisTaskRequest>,
		) => {
			const defaultOps = {
				VoiceId: "Matthew",
				Engine: "neural",
				LanguageCode: "en-US",
				OutputFormat: "mp3",
				...opts,
			} as Partial<SynthesisTaskRequest>;

			const req = new Request(`${base}/synthesisTasks`, {
				method: "POST",
				body: encoder.encode(JSON.stringify({ ...defaultOps, ...reqd })),
			});
			return final(addSig(req));
		},
		SynthesizeSpeech: (opts: SynthesisRequest) => {
			const req = new Request(`${base}/lexicons`, {
				method: "POST",
				body: encoder.encode(JSON.stringify(opts)),
				headers: { "content-type": "application/json" },
			});
			return final<Uint8Array>(addSig(req));
		},
	};
};
