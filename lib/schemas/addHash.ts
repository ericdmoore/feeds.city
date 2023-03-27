import * as jSchema from "jsonSchema";

export const pollyRunSchema = {
  $schema: jSchema.$schema,
  $id: "https://feeds.city/schemas/addVoiceToText.run.json",
  type: jSchema.TypeName.Object,
  properties: {
    aws: {
      type: jSchema.TypeName.Object,
      required: ["key", "secret"],
      properties: {
        key: jSchema.TypeName.String,
        secret: jSchema.TypeName.String,
        region: jSchema.TypeName.String,
      },
    },
    config: {
      type: jSchema.TypeName.Object,
      required: ["s3"],
      properties: {
        s3: {
          type: jSchema.TypeName.Object,
          required: ["bucket"],
          properties: {
            bucket: jSchema.TypeName.String,
            prefix: jSchema.TypeName.String,
          },
        },
        polly: {
          type: jSchema.TypeName.Object,
          properties: {
            voiceId: jSchema.TypeName.String,
            outputFormat: { enum: ["json", "mp3", "ogg_vorbis", "pcm"] },
            sampleRate: jSchema.TypeName.String,
            useNeuralEngine: jSchema.TypeName.Boolean,
            isPlainText: jSchema.TypeName.Boolean,
            onCompletion: {
              type: jSchema.TypeName.Object,
              properties: {
                snsTopic: jSchema.TypeName.String,
              },
            },
          },
        },
        cloudfront: {
          type: jSchema.TypeName.Object,
          required: ["host"],
          properties: {
            host: jSchema.TypeName.String,
            expiresAfterSeconds: jSchema.TypeName.Number,
          },
        },
        dynamo: {
          type: jSchema.TypeName.Object,
          properties: {
            table: jSchema.TypeName.String,
          },
        },
      },
    },
  },
} as unknown as jSchema.JSONSchema;
