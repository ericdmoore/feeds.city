import * as jSchema from "jsonSchema";

const JSchemaString = "string" as jSchema.JSONSchema;
const JSchemaBool = "boolean" as jSchema.JSONSchema;

export const pollySchema: jSchema.JSONSchema = {
  $schema: jSchema.$schema,
  $id: "https://feeds.city/schemas/aws.polly.json",
  type: jSchema.TypeName.Object,
  required: ["key", "secret"],
  properties: {
    key: JSchemaString,
    secret: JSchemaString,
    region: JSchemaString,
    pollyBucket: JSchemaString,
    snsTopic: JSchemaString,
    dynamoTable: JSchemaString,
    useCDN: JSchemaBool,
  },
};

export default JSON.stringify(pollySchema);
