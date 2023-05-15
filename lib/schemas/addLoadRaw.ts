import * as jSchema from "jsonSchema";

export const pollySchema = {
  $schema: jSchema.$schema,
  $id: "https://feeds.city/schemas/aws.polly.json",
  type: jSchema.TypeName.Object,
  required: ["key", "secret"],
  properties: {
    key: jSchema.TypeName.String,
    secret: jSchema.TypeName.String,
    region: jSchema.TypeName.String,
    pollyBucket: jSchema.TypeName.String,
    snsTopic: jSchema.TypeName.String,
    dynamoTable: jSchema.TypeName.String,
    useCDN: jSchema.TypeName.Boolean,
  },
};

export default JSON.stringify(pollySchema);
