// deno-lint-ignore-file require-await
// tie it all together
import {
  type ASTChainFunc,
  type EnhancementModule,
  type ProviderFunctions,
  type ProviderParamSchemas,
} from "../index.ts";
import { addKeywordDigest, paramSchema } from "./addKeywordDigest.ts";

const run = addKeywordDigest as ASTChainFunc;

const aws = (() => {
  const install = async () => "";
  const remove = async () => "";
  const paramSchema = {
    install: "",
    remove: "",
  } as ProviderParamSchemas;
  return { funcs: { install, remove }, paramSchema };
})() as { funcs: ProviderFunctions; paramSchema: ProviderParamSchemas };

const azure = (() => {
  const install = async () => "";
  const remove = async () => "";
  const paramSchema = {
    install: "",
    remove: "",
  } as ProviderParamSchemas;
  return { funcs: { install, remove }, paramSchema };
})() as { funcs: ProviderFunctions; paramSchema: ProviderParamSchemas };

const gcloud = (() => {
  const install = async () => "";
  const remove = async () => "";
  const paramSchema = {
    install: "",
    remove: "",
  } as ProviderParamSchemas;
  return { funcs: { install, remove }, paramSchema };
})() as { funcs: ProviderFunctions; paramSchema: ProviderParamSchemas };

export const enhancementModule = {
  run,
  cloud: {
    aws: aws.funcs,
    azure: azure.funcs,
    gcloud: gcloud.funcs,
    install: async (
      input: { aws?: unknown; azure?: unknown; gcloud?: unknown },
    ) => {
      const [sAws, sAzure, sGcloud] = await Promise.all([
        aws.funcs.install(input.aws),
        azure.funcs.install(input.azure),
        gcloud.funcs.install(input.gcloud),
      ]);

      return JSON.stringify({
        aws: sAws,
        azure: sAzure,
        gcloud: sGcloud,
      });
    },
    remove: async (
      input: { aws?: unknown; azure?: unknown; gcloud?: unknown },
    ) => {
      const [sAws, sAzure, sGcloud] = await Promise.all([
        aws.funcs.remove(input.aws),
        azure.funcs.remove(input.azure),
        gcloud.funcs.remove(input.gcloud),
      ]);
      return JSON.stringify({
        aws: sAws,
        azure: sAzure,
        gcloud: sGcloud,
      });
    },
  },
  paramsSchema: {
    run: JSON.stringify(paramSchema),
    cloud: {
      install: JSON.stringify({
        aws: aws.paramSchema.install,
        gcloud: gcloud.paramSchema.install,
        azure: azure.paramSchema.install,
      }),
      remove: JSON.stringify({
        aws: aws.paramSchema.remove,
        gcloud: gcloud.paramSchema.remove,
        azure: azure.paramSchema.remove,
      }),
      aws: aws.paramSchema,
      azure: azure.paramSchema,
      gcloud: gcloud.paramSchema,
    },
  },
} as EnhancementModule;

export default enhancementModule;
