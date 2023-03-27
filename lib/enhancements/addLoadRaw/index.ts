// tie it all together
// deno-lint-ignore-file require-await
// tie it all together
import {
  type ASTChainFunc,
  type EnhancementModule,
  type ProviderFunctions,
  type ProviderInstallParamSchemas,
} from "../index.ts";
import { addLoadRawAndArticle, paramSchema } from "./addLoadRaw.ts";

const run = addLoadRawAndArticle as ASTChainFunc;

const aws = (() => {
  const installSchema = "";
  const removeSchema = "";
  const install = async () => "";
  const remove = async () => "";
  const paramSchema = {
    install: installSchema,
    remove: removeSchema,
  } as ProviderInstallParamSchemas;
  return { funcs: { install, remove }, paramSchema };
})() as { funcs: ProviderFunctions; paramSchema: ProviderInstallParamSchemas };

const azure = (() => {
  const installSchema = "";
  const removeSchema = "";
  const install = async () => "";
  const remove = async () => "";
  const paramSchema = {
    install: installSchema,
    remove: removeSchema,
  } as ProviderInstallParamSchemas;

  return { funcs: { install, remove }, paramSchema };
})() as { funcs: ProviderFunctions; paramSchema: ProviderInstallParamSchemas };

const gcloud = (() => {
  const installSchema = "";
  const removeSchema = "";
  const install = async () => "";
  const remove = async () => "";
  const paramSchema = {
    install: installSchema,
    remove: removeSchema,
  } as ProviderInstallParamSchemas;
  return { funcs: { install, remove }, paramSchema };
})() as { funcs: ProviderFunctions; paramSchema: ProviderInstallParamSchemas };

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
