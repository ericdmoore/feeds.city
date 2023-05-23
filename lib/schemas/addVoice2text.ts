import S from "fluentSchema";

const IDroot = {
	protocol: "//",
	pathSeg: ["feeds.city", "schemas", "addVoiceToText", "run"],
	paths: ["feeds.city", "schemas", "addVoiceToText", "run.json"],
	str: "feeds.city/schemas/addVoiceToText/run.json",
	ext: ".json",
};

// I dont think this follows the docs of superstruct
// perhaps it was useing fluent schema

const configS3Part = S
	.object()
	.id(IDroot.protocol + IDroot.str + "#config/s3")
	.required(["bucket"])
	.prop("bucket", S.string())
	.prop("prefix", S.string());

const configDynamoPart = S
	.object()
	.id(IDroot.protocol + IDroot.str + "#config/dynamo")
	.required(["table"])
	.prop("table", S.string());

const configCloudfrontPart = S
	.object()
	.id(IDroot.protocol + IDroot.str + "#config/cloudfront")
	.required(["host"])
	.prop("host", S.string())
	.prop("expiresAfterSeconds", S.number());

const configPollyPart = S.object()
	.id(IDroot.protocol + IDroot.str + "#config/polly")
	.prop("voiceId", S.string())
	.prop("outputFormat", S.enum(["json", "mp3", "ogg_vorbis", "pcm"]))
	.prop("sampleRate", S.string())
	.prop("useNeuralEngine", S.boolean())
	.prop("isPlainText", S.boolean())
	.prop("onCompletion", S.object())
	.prop("snsTopic", S.string());

const configPart = S
	.object()
	.id(IDroot.protocol + IDroot.str + "#config")
	.prop("s3", configS3Part)
	.prop("polly", configPollyPart)
	.prop("dynamo", configDynamoPart)
	.prop("cloudfront", configCloudfrontPart);

const awsPart = S
	.object()
	.id(IDroot.protocol + IDroot.str + "#aws")
	.required(["key", "secret"])
	.prop("key", S.string())
	.prop("secret", S.string())
	.prop("region", S.string());

const pollyObjectSchema = S
	.object()
	.id(IDroot.protocol + IDroot.str)
	.title("Add Voice To Text lugin")
	.description("Validator for User params to the Add Voice To Text PLugin")
	.required(["aws", "config"])
	.prop("aws", awsPart)
	.prop("config", configPart);

export const pollyRunSchema = pollyObjectSchema.valueOf();
