import { jsonSchema as jSchema, superstruct as s } from "../../../deps.ts";
import {
  addVoice2text as voiceSchema,
  aws,
  azure,
  gcloud,
} from "../../schemas/index.ts";
import { ASTChainFunc, EnhancementModule } from "../index.ts";
import { textToVoice } from "./addVoice2text.ts";

const cloudParams_AWS = {
  schema: aws.pollySchema,
  struct: s.object({
    key: s.string(),
    secret: s.string(),
    region: s.optional(s.string()),
    pollyBucket: s.optional(s.string()),
    snsTopic: s.optional(s.string()),
    dynamoTable: s.optional(s.string()),
    useCDN: s.optional(s.boolean()),
  }),
};

const cloudParams_GCLOUD = {
  schema: gcloud.pollySchema,
  struct: s.object({
    key: s.string(),
    secret: s.string(),
    region: s.optional(s.string()),
  }),
};

const cloudParams_AZURE = {
  schema: azure.pollySchema,
  struct: s.object({
    key: s.string(),
    secret: s.string(),
    region: s.optional(s.string()),
  }),
};

const oneOrMoreCloudParams = {
  struct: s.union([
    s.object({ aws: cloudParams_AWS.struct }),
    s.object({ gcloud: cloudParams_GCLOUD.struct }),
    s.object({ azure: cloudParams_AZURE.struct }),
  ]),
  schema: {
    anyOf: [
      {
        type: jSchema.TypeName.Object,
        required: ["aws"],
        properties: { aws: cloudParams_AWS.schema },
      },
      {
        type: jSchema.TypeName.Object,
        required: ["azure"],
        properties: { azure: cloudParams_AZURE.schema },
      },
      {
        type: jSchema.TypeName.Object,
        required: ["gcloud"],
        properties: { gcloud: cloudParams_GCLOUD.schema },
      },
    ],
  },
};

export const cloudParams = {
  aws: cloudParams_AWS,
  gcloud: cloudParams_GCLOUD,
  azure: cloudParams_AZURE,
  install: oneOrMoreCloudParams,
  remove: oneOrMoreCloudParams,
};

const enhancementModuleFn = () => {
  const awsInstall = async (opts: typeof cloudParams.aws.struct.TYPE) => {
    return await `all resource IDs that are generated from the cloud - useful for deletion ${opts}`;
  };
  const awsRemove = async (
    opts: typeof cloudParams.aws.struct.TYPE,
    resourceManifest: string,
  ) => {
    return await `confirm the resource IDs removed, or provide ACTIONable messages on how to resolve conflicts so that it can be removed ${opts} ${resourceManifest}`;
  };

  const azureInstall = async (opts: typeof cloudParams.azure.struct.TYPE) => {
    return await `all resource IDs that are generated from the cloud - useful for deletion ${opts}`;
  };

  const azureRemove = async (
    opts: typeof cloudParams.azure.struct.TYPE,
    resourceManifest: string,
  ) => {
    return await `confirm the resource IDs removed, or provide ACTIONable messages on how to resolve conflicts so that it can be removed ${opts} ${resourceManifest}`;
  };

  const gcloudInstall = async (opts: typeof cloudParams.gcloud.struct.TYPE) => {
    return await `all resource IDs that are generated from the cloud - useful for deletion ${opts}`;
  };

  const gcloudRemove = async (
    opts: typeof cloudParams.gcloud.struct.TYPE,
    resourceManifest: string,
  ) => {
    return await `confirm the resource IDs removed, or provide ACTIONable messages on how to resolve conflicts so that it can be removed ${opts} ${resourceManifest}`;
  };

  return {
    run: textToVoice as ASTChainFunc,
    cloud: {
      install: async (opts: typeof cloudParams.install.struct.TYPE) => {
        // return JSON string of resources that were created
        return JSON.stringify({
          ...("aws" in opts ? { aws: await awsInstall(opts.aws) } : {}),
          ...("azure" in opts ? { azure: await awsInstall(opts.azure) } : {}),
          ...("gcloud" in opts
            ? { gcloud: await awsInstall(opts.gcloud) }
            : {}),
        });
      },
      remove: async (
        opts: typeof cloudParams.remove.struct.TYPE,
        resourceManifest: string,
      ) => {
        // run all cloud versions together
        return await `message: that shows successful deletion / or conflict  ${opts} ${resourceManifest}`;
      },
      aws: { install: awsInstall, remove: awsRemove },
      azure: { install: azureInstall, remove: azureRemove },
      gcloud: { install: gcloudInstall, remove: gcloudRemove },
    },
    paramsSchema: {
      run: JSON.stringify(voiceSchema),
      cloud: {
        install: JSON.stringify(cloudParams.install.schema),
        remove: JSON.stringify(cloudParams.remove.schema),
        aws: {
          install: JSON.stringify(cloudParams.aws.schema),
          remove: JSON.stringify(cloudParams.aws.schema),
        },
        gcloud: {
          install: JSON.stringify(cloudParams.gcloud.schema),
          remove: JSON.stringify(cloudParams.gcloud.schema),
        },
        azure: {
          install: JSON.stringify(cloudParams.azure.schema),
          remove: JSON.stringify(cloudParams.azure.schema),
        },
      },
    },
  } as EnhancementModule;
};

export const enhancementModule = enhancementModuleFn();
