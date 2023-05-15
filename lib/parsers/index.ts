// deno-lint-ignore-file

/**
 * @Author: Eric Moore
 * @
 */

import { startFromURL, urlToAST } from "$lib/start.ts";

import type {
  Either as EITHER,
  Left as LEFT,
  Right as RIGHT,
} from "$lib/types.ts";

import { Either, isLeft, isRight, Left, Right } from "$lib/types.ts";

import { type AST, type ASTjson, computableToJson } from "$lib/parsers/ast.ts";

import * as atom from "./atom.ts";
import * as rss from "./rss.ts";
import * as jsonfeed from "./jsonFeed.ts";

export * as atom from "./atom.ts";
export * as rss from "./rss.ts";
export * as jsonfeed from "./jsonFeed.ts";
export * as sitemap from "./sitemap.ts";

import merge from "lodash.merge";

//#region Types

interface SCIPAB {
  from: string; // FeedFunc
  loc: string; // DataLocation
  situation: string; //  (what happened)
  complication: string; // (why its a problem)
  implication: string; // (why you might care)
  action: string; // (what we did to help you)
  benefit: string; // (hopefully you like it - because)
}

const message = (from: string) =>
(i: {
  loc?: string;
  situation?: string;
  complication?: string;
  implication?: string;
  action?: string;
  benefit?: string;
}) =>
  ({
    from,
    loc: i.loc ?? from,
    situation: i.situation ?? "What happened - not filled in  ",
    complication: i.complication ?? "Why that is a problem - not filled in  ",
    implication: i.implication ??
      "What other potential problems this could cause - not filled in",
    action: i.action ?? "What we did to help you - not filled in",
    benefit: i.benefit ??
      "Why this hopefully makes sense for you - not filled in",
  }) as SCIPAB;

type ReturnedMessages = { [location: string]: SCIPAB[] };

const addMessage = (msg: SCIPAB, retMsg: ReturnedMessages = {}) => {
  return {
    ...retMsg,
    [msg.loc]: merge(msg, retMsg[msg.loc]),
  } as ReturnedMessages;
};

const mergeMessages = (
  a: ReturnedMessages,
  b: ReturnedMessages = {},
): ReturnedMessages => merge(a, b);

type ResolvedEnhacementFn = (
  i: unknown,
  ast: AST,
  data?: JsonObject,
  config?: JsonObject,
) => Promise<EITHER<AST, ReturnedMessages>>;

type ModuleLocationURLstring = string;
type ExternalSystemAlias = string;
type UnResolvedEnhacement = ModuleLocationURLstring | ResolvedEnhacementFn;

type IFeedLoaderFn = (
  params?: unknown,
  data?: JsonObject,
  config?: JsonObject,
) => Promise<EITHER<AST, ReturnedMessages>>;

type IFeedExportingFn = (
  a: AST,
  params?: unknown,
  data?: JsonObject,
  config?: JsonObject,
) => Promise<EITHER<EnhanceFeed, ReturnedMessages>>;

type IModuleLoader = (
  s: string,
  data?: JsonObject,
  config?: JsonObject,
) => Promise<EITHER<ResolvedEnhacementFn, ReturnedMessages>>;

type ParameterizedFn<EFn> = {
  fn: EFn;
  params: unknown;
  moduleLoader: never;
};

type LoadableModule = {
  fn: ExternalSystemAlias;
  params: unknown;
  moduleLoader: IModuleLoader;
};

interface PipelineState {
  sourceURL?: string;
  data?: JsonObject;
  config?: JsonObject;
  loading: { fn: IFeedLoaderFn; params: unknown };
  exporting: { fn: IFeedExportingFn; params: unknown };
  enhancements: {
    input: (ParameterizedFn<ResolvedEnhacementFn> | LoadableModule)[];
    resolved: ParameterizedFn<ResolvedEnhacementFn>[];
  };
}

interface JsonObject {
  [property: string]: JsonType;
}
interface JsonArray extends Array<JsonType> {}
type JsonType = string | number | boolean | null | JsonArray | JsonObject;

type EnhanceFeed = {
  string: string;
  ast: ASTjson;
  messages: ReturnedMessages;
  warnings: ReturnedMessages;
};

interface IExporters {
  toAtom: (exportingParams?: unknown) => Promise<EnhanceFeed>;
  toCity: (exportingParams?: unknown) => Promise<EnhanceFeed>;
  toJsonFeed: (exportingParams?: unknown) => Promise<EnhanceFeed>;
  toRSS: (exportingParams?: unknown) => Promise<EnhanceFeed>;
  toCustomExport: (
    exportFn: IFeedExportingFn,
    params?: unknown,
  ) => Promise<EnhanceFeed>;
}

interface IMiddlwares {
  use: (
    enhancementFn: string | ResolvedEnhacementFn,
    params?: unknown,
  ) => IMiddlwares & IExporters;
  using: (
    enhancementFnArr:
      (ParameterizedFn<UnResolvedEnhacement> | LoadableModule)[],
  ) => IMiddlwares & IExporters;
  data: (dataToAdd: JsonObject) => IMiddlwares & IExporters;
  config: (configOpt: JsonObject) => IMiddlwares & IExporters;
  state: () => PipelineState;
}

interface ILoaders {
  from: (ast: AST) => IMiddlwares & IExporters;
  fromURL: (urlString: string) => IMiddlwares & IExporters;
  fromCustomLoader: (loaderFn: IFeedLoaderFn) => IMiddlwares & IExporters;
}

//#endregion Types

//#region ActionLoop
const load = async (
  loaderFn: IFeedLoaderFn,
  params?: unknown,
  data?: JsonObject,
  config?: JsonObject,
): Promise<EITHER<AST, ReturnedMessages>> => {
  const result = await loaderFn(params, data, config);
  return isLeft(result)
    ? Left(addMessage(
      message("loading from URL")({
        situation: "Loader Function Failed",
        complication: "All Processing Starts with this feed",
        implication: "It did not load, so nothing else can run on that feed",
        action: "No guesswork makes sense unless there is a feed ",
        benefit: "No worries of guessing wrong",
      }),
      result.left,
    ))
    : Right(result.right as AST);
};

const exporting = async (
  exporterFn: IFeedExportingFn,
  ast: AST,
  params?: unknown,
  data?: JsonObject,
  config?: JsonObject,
): Promise<EITHER<EnhanceFeed, ReturnedMessages>> => {
  // what about rejection
  const result = await exporterFn(ast, params, data, config);
  return result;
};

const resolveEnhancement = async (
  enhancementURL: string,
  _data?: JsonObject,
  _config?: JsonObject,
): Promise<EITHER<ResolvedEnhacementFn, ReturnedMessages>> => {
  const enhancementModule = await import(enhancementURL)
    .then((mod) => Right(mod))
    .catch((er) =>
      Left(
        addMessage(
          message("loading an enhancement module")(
            {
              loc: er.message,
              situation:'',
              action:'',
              benefit:'',
              complication:'',
              implication:''
            },
          ),
        ),
      )
    ) as EITHER<any, ReturnedMessages>;

  return enhancementModule.left
    ? Left(
      addMessage(
        message("loading an enhancement module")(
          {},
        ),
        enhancementModule.left,
      ),
    )
    : Right(
      enhancementModule.right.enhancement ??
        enhancementModule.right.fn as ResolvedEnhacementFn,
    );
};

const resolveAllEnhancements = async (
  enhancementArr: (ParameterizedFn<ResolvedEnhacementFn> | LoadableModule)[],
  data?: JsonObject,
  config?: JsonObject,
): Promise<
  Either<ParameterizedFn<ResolvedEnhacementFn>, ReturnedMessages>[]
> => {
  const r = await Promise.all(
    enhancementArr.map(async ({ fn, params, moduleLoader }) => {
      if (typeof fn === "string") {
        const result = await moduleLoader(fn, data, config);
        return result.left
          ? Left(result.left)
          : Right({ fn: result.right, params, moduleLoader });
      } else {
        return Right({ fn, params });
      }
    }),
  ) as EITHER<ParameterizedFn<ResolvedEnhacementFn>, ReturnedMessages>[];
  return r;
};

const runAllenhancements = async (
  enhancementArr: ParameterizedFn<ResolvedEnhacementFn>[],
  ast: AST,
  data?: JsonObject,
  config?: JsonObject,
) => {
  return enhancementArr.reduce(
    async (acc, { fn, params }) => {
      const [ast, errs] = await acc;
      const result = await fn(params, await ast.right, data, config);
      return result.left
        ? [ast, Left(mergeMessages(result.left, errs.left))] as [
          RIGHT<AST>,
          LEFT<ReturnedMessages>,
        ]
        : [result, errs] as [RIGHT<AST>, LEFT<ReturnedMessages>];
    },
    Promise.resolve([
      Right(ast),
      Left({} as ReturnedMessages),
    ]) as Promise<[RIGHT<AST>, LEFT<ReturnedMessages>]>,
  );
};

const runEverything = async (
  state: PipelineState,
): Promise<EITHER<EnhanceFeed, ReturnedMessages>> => {
  const ast = await load(
    state.loading.fn,
    state.loading.params,
    state?.data,
    state.config,
  );

  const eitherModuleOrMessgage = await resolveAllEnhancements(
    state.enhancements.input,
    state?.data,
    state.config,
  );

  const enhancementsModules = eitherModuleOrMessgage.filter((elem) =>
    elem.right
  ).map((elem) => elem.right) as ParameterizedFn<ResolvedEnhacementFn>[];
  const errMessages = eitherModuleOrMessgage.filter(isLeft).reduce(
    (acc, msg) => mergeMessages(msg.left, acc),
    {},
  );

  if (ast.right && enhancementsModules.length > 0) {
    state.enhancements.resolved = enhancementsModules;
    state.enhancements.input = [];

    const [finishedAST, messages] = await runAllenhancements(
      state.enhancements.resolved,
      ast.right,
      state?.data,
      state?.config,
    );

    if (finishedAST.right) {
      return exporting(
        state.exporting.fn,
        finishedAST.right,
        state.exporting.params,
        state?.data,
        state?.config,
      );
    } else {
      return Left(messages.left);
    }
  } else {
    return Left(mergeMessages(ast.left, errMessages));
  }
};

//#endregion ActionLoop

/**
 * ## Using
 * 2 Arity Funciton - where the first argument is an internal argumemnt used nby the framework
 * User Params
 * @param enhancementFnArr: (string | ((i: unknown)=>AST))[], paramsArr: unknown[] = []
 */
const using = (state: PipelineState) =>
(
  enhancementFnArr: (ParameterizedFn<UnResolvedEnhacement> | LoadableModule)[],
): IMiddlwares & IExporters => {
  const nextState = {
    ...state,
    enhancements: {
      ...state.enhancements,
      input: [...state.enhancements.input, ...enhancementFnArr],
    },
  } as PipelineState;

  return {
    use: use(nextState),
    using: using(nextState),
    data: data(nextState),
    state: extractState(nextState),
    config: config(nextState),
    toAtom: toAtom(nextState),
    toCity: toCity(nextState),
    toJsonFeed: toJsonFeed(nextState),
    toRSS: toRSS(nextState),
    toCustomExport: toCustomExport(nextState),
  };
};

const use = (state: PipelineState) =>
(
  enhancementFn: string | ResolvedEnhacementFn,
  params?: unknown,
): IMiddlwares & IExporters => {
  const resolveableEnhancementMod = typeof enhancementFn === "string"
    // give strings the default loader
    ? {
      fn: enhancementFn,
      params,
      moduleLoader: (id: string, d?: JsonObject, c?: JsonObject) =>
        resolveEnhancement(id, d, c),
    }
    : {
      fn: enhancementFn,
      params,
    };

  const nextState = {
    ...state,
    enhancements: {
      ...state.enhancements,
      input: [
        ...state.enhancements.input,
        resolveableEnhancementMod,
      ],
    },
  } as PipelineState;

  return {
    use: use(nextState),
    using: using(nextState),
    data: data(nextState),
    state: extractState(nextState),
    config: config(nextState),
    toAtom: toAtom(nextState),
    toCity: toCity(nextState),
    toJsonFeed: toJsonFeed(nextState),
    toRSS: toRSS(nextState),
    toCustomExport: toCustomExport(nextState),
  };
};

const extractState = (state: PipelineState) => () => {
  return Object.freeze(state);
};

const data = (state: PipelineState) =>
(
  dataToAdd: JsonObject,
): IMiddlwares & IExporters => {
  const nextState = {
    ...state,
    data: dataToAdd,
  } as PipelineState;

  return {
    use: use(nextState),
    using: using(nextState),
    data: data(nextState),
    state: extractState(nextState),
    config: config(nextState),
    toAtom: toAtom(nextState),
    toCity: toCity(nextState),
    toJsonFeed: toJsonFeed(nextState),
    toRSS: toRSS(nextState),
    toCustomExport: toCustomExport(nextState),
  };
};

const config = (state: PipelineState) =>
(
  configOpt: JsonObject,
): IMiddlwares & IExporters => {
  // maybe config can piece by piece update the State Obj?
  const nextState = {
    ...state,
    config: configOpt,
  };
  return {
    use: use(nextState),
    using: using(nextState),
    data: data(nextState),
    state: extractState(nextState),
    config: config(nextState),
    toAtom: toAtom(nextState),
    toCity: toCity(nextState),
    toJsonFeed: toJsonFeed(nextState),
    toRSS: toRSS(nextState),
    toCustomExport: toCustomExport(nextState),
  };
};

const toJsonFeed =
  (state: PipelineState) =>
  async (exportingParams: unknown = undefined): Promise<EnhanceFeed> => {
    state.exporting.params = exportingParams;
    state.exporting.fn = (async (ast, param, data, config) => {
      
      console.log('to JSON feed')
      
      const resp = await jsonfeed.JsonFeed<jsonfeed.RespStruct>(
        {},
        state?.sourceURL ?? "",
      )
        .fromAST(ast)
        .then((resp) => Right(resp))
        .catch((err) => Left(mergeMessages({ err })));
      
      console.log({ resp })

      if (isRight(resp)) {
        const string = jsonfeed.JsonFeed(resp.right, resp.right.feed_url)
          .toString();

        return Right({
          ast: await computableToJson(ast),
          string,
          messages: {},
          warnings: {},
        });

      } else {

        return Left(
          mergeMessages(resp.left, 
            addMessage(
              message('exporting jsonFeed')({ 
                situation: 'Error occured during the export of the ast to jsonFeed',
                complication: 'Not sure how to show the ast',
                implication: 'You will not have anything to see',
                action: '>>  Try another export?',
                benefit: 'so that you can see something?'
              }),
              resp.left)
            )
          );
      }
    }) as IFeedExportingFn;

    return runEverything(state).then((final) => {
      return isRight(final)
        ? Promise.resolve(final.right)
        : Promise.reject(final.left);
    });
  };

const toAtom =
  (state: PipelineState) =>
  async (exportingParams: unknown = undefined): Promise<EnhanceFeed> => {
    state.exporting.params = exportingParams;
    state.exporting.fn = (async (ast, param, data, config) => {
      const resp = await atom.Atom<atom.RespStruct>({}, "").fromAST(ast)
        .then((resp) => Right(resp))
        .catch((err) => Left(mergeMessages({ err })));

      if (isRight(resp)) {
        const string = atom.Atom(
          resp.right,
          typeof Array.isArray(resp.right.feed.link)
            ? (resp.right.feed.link as any[])[0]._attributes.href
            : (resp.right.feed.link as any)._attributes.href ?? "",
        ).toString();

        return Right({
          ast: await computableToJson(ast),
          string,
          messages: {},
          warnings: {},
        });
      } else {
        return Left(
          mergeMessages(resp.left, 
            addMessage(
              message('exporting Atom')({ 
                situation: 'Error occured during the export of the ast to Atom Feed',
                complication: 'Not sure how to show the ast',
                implication: 'You will not have anything to see',
                action: '>>  Try another export?',
                benefit: 'so that you can see something?'
              }),
              resp.left)
            )
          );
      }
    }) as IFeedExportingFn;

    return runEverything(state).then((final) => {
      return isRight(final)
        ? Promise.resolve(final.right)
        : Promise.reject(final.left);
    });
  };

const toRSS =
  (state: PipelineState) =>
  async (exportingParams: unknown = undefined): Promise<EnhanceFeed> => {
    state.exporting.params = exportingParams;
    state.exporting.fn = (async (ast, param, data, config) => {
      const resp = await rss.Rss<rss.RespStruct>({}, "")
        .fromAST(ast)
        .then((d) => Right(d))
        .catch((er) => Left(mergeMessages({ er })));
      if (isRight(resp)) {
        const string = rss.Rss(
          resp.right,
          typeof resp.right.rss.channel.link === "string"
            ? resp.right.rss.channel.link
            : resp.right.rss.channel.link._text ?? "",
        ).toString();

        return Right({
          ast: await computableToJson(ast),
          string,
          messages: {},
          warnings: {},
        } as EnhanceFeed);
      } else {
        return Left(resp.left);
      }
    }) as IFeedExportingFn;

    return runEverything(state).then((final) => {
      return isRight(final)
        ? Promise.resolve(final.right)
        : Promise.reject(final.left);
    });
  };

const toCity =
  (state: PipelineState) =>
  async (exportingParams: unknown = undefined): Promise<EnhanceFeed> => {
    state.exporting.params = exportingParams;
    state.exporting.fn = (async (ast, param, data, config) => {
      const resp = await jsonfeed.JsonFeed<jsonfeed.RespStruct>(
        {},
        state?.sourceURL ?? "",
      ).fromAST(ast)
        .then(async (d) => Right(d))
        .catch((er) => Left(mergeMessages({ er })));

      if (isRight(resp)) {
        const string = JSON.stringify(resp.right);

        return Right({
          ast: await computableToJson(ast),
          string,
          messages: {},
          warnings: {},
        } as EnhanceFeed);
      } else {
        return Left(resp.left);
      }
    }) as IFeedExportingFn;

    return runEverything(state).then((final) => {
      return isRight(final)
        ? Promise.resolve(final.right)
        : Promise.reject(final.left);
    });
  };

const toCustomExport =
  (state: PipelineState) =>
  async (exportFn: IFeedExportingFn, params: unknown): Promise<EnhanceFeed> => {
    state.exporting = { fn: exportFn, params };

    return runEverything(state).then((final) => {
      return isRight(final)
        ? Promise.resolve(final.right)
        : Promise.reject(final.left);
    });
  };

const defaultState = () =>
  ({
    loading: {
      fn: ((params?: unknown, data?: JsonObject, config?: JsonObject) =>
        Promise.reject("No Loader has been set")) as IFeedLoaderFn,
      params: undefined,
    },
    exporting: {
      fn: (async (
        a: AST,
        params?: unknown,
        data?: JsonObject,
        config?: JsonObject,
      ) => Promise.reject("No Exporter has been set")) as IFeedExportingFn,
      params: undefined,
    },
    enhancements: {
      input: [] as (ParameterizedFn<UnResolvedEnhacement> | LoadableModule)[],
      resolved: [] as ParameterizedFn<ResolvedEnhacementFn>[],
    },
  }) as PipelineState;

export const loadFeed = (initalState = defaultState()): ILoaders => {
  return {
    /**
     * ## From
     *
     * Load the AST from the AST that you give it
     *
     * @param ast
     */
    from: (ast: AST) => {
      const nextState: PipelineState = {
        ...initalState,
        loading: {
          fn: () => Promise.resolve(Right(ast)),
          params: undefined,
        },
      };

      return {
        use: use(nextState),
        config: config(nextState),
        data: data(nextState),
        state: extractState(nextState),
        toAtom: toAtom(nextState),
        toCity: toCity(nextState),
        toJsonFeed: toJsonFeed(nextState),
        toRSS: toRSS(nextState),
      } as IMiddlwares & IExporters;
    },

    /**
     * ## From Custom Loader
     *
     * Example Uses might be from non http styled look ups. For example
     *   - from the file system
     *   - from S3
     *   - from a database
     *   - from IPFS
     * @param loaderFn
     */
    fromCustomLoader(loaderFn: IFeedLoaderFn, params?: unknown) {
      const nextState: PipelineState = {
        ...initalState,
        loading: {
          fn: loaderFn,
          params,
        },
      };

      return {
        use: use(nextState),
        config: config(nextState),
        data: data(nextState),
        state: extractState(nextState),
        toAtom: toAtom(nextState),
        toCity: toCity(nextState),
        toJsonFeed: toJsonFeed(nextState),
        toRSS: toRSS(nextState),
      } as IMiddlwares & IExporters;
    },
    /**
     * ## From URL
     * Load a Feed from a URL or a URL string
     *
     * @param url
     */
    fromURL: (url: string | URL) => {
      const urlString = typeof url === "string" ? url : url.href;

      const nextState: PipelineState = {
        ...initalState,
        sourceURL: urlString,
        loading: {
          fn: async () =>
            urlToAST(await startFromURL(urlString))
              .then((d) => Right(d))
              .catch((er) => Left({ er })),
          params: undefined,
        },
      };

      console.log({nextState})

      return {
        use: use(nextState),
        config: config(nextState),
        data: data(nextState),
        state: extractState(nextState),
        toAtom: toAtom(nextState),
        toCity: toCity(nextState),
        toJsonFeed: toJsonFeed(nextState),
        toRSS: toRSS(nextState),
      } as IMiddlwares & IExporters;
    },
  };
};

export default loadFeed;
