import * as jSchema from "jsonSchema";
const JSchemaString = "string" as jSchema.JSONSchema;

export const pollySchema: jSchema.JSONSchema = {
  $schema: jSchema.$schema,
  $id: "https://feeds.city/schemas/azure.polly.json",
  type: jSchema.TypeName.Object,
  required: ["key", "secret"],
  properties: {
    key: JSchemaString,
    secret: JSchemaString,
    region: JSchemaString,
  },
};

export default JSON.stringify(pollySchema);
