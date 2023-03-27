import { awsV4Sig } from "./aws-url-signer.ts";

// #region types
type Dict<T> = { [key: string]: T };
type OnlyHeaders = null;
export interface AssociateKmsKeyInput {
  // X-Amz-Target: Logs_20140328.AssociateKmsKey
  // Content-Type: application/x-amz-json-1.1
  kmsKeyId: string;
  logGroupName: string;
}
export type AssociateKmsKeyOutput = OnlyHeaders;
export interface CancelExportTaskInput {
  taskId: string;
}
export type CancelExportTaskOutput = OnlyHeaders;
export interface CreateExportTaskInput {
  to: number;
  destination: string;
  logGroupName: string;
  destinationPrefix?: string;
  from?: number;
  logStreamNamePrefix?: string;
  taskName?: string;
}
export interface CreateExportTaskOutput {
  taskId: string;
}
export interface CreateLogGroupInput {
  logGroupName: string;
  kmsKeyId?: string;
  tags?: {
    [key: string]: string;
  };
}
export type CreateLogGroupOutput = OnlyHeaders;
export interface CreateLogStreamInput {
  logGroupName: string;
  logStreamName: string;
}
export type CreateLogStreamOutput = OnlyHeaders;
export interface DeleteDestinationInput {
  destinationName: "string";
}
export type DeleteDestinationOutput = OnlyHeaders;
export interface DeleteLogGroupInput {
  logGroupName: string;
}
export type DeleteLogGroupOutput = OnlyHeaders;
export interface DeleteLogStreamInput {
  logGroupName: string;
  logStreamName: string;
}
export type DeleteLogStreamOutput = OnlyHeaders;
export interface DeleteMetricFilterInput {
  filterName: string;
  logGroupName: string;
}
export type DeleteMetricFilterOutput = OnlyHeaders;
export interface DeleteQueryDefinitionInput {
  queryDefinitionId: string;
}
export type DeleteQueryDefinitionOutput = OnlyHeaders;
export interface DeleteResourcePolicyInput {
  policyName: string;
}
export type DeleteResourcePolicyOutput = OnlyHeaders;
export interface DeleteRetentionPolicyInput {
  logGroupName: string;
}
export type DeleteRetentionPolicyOutput = OnlyHeaders;
export interface DeleteSubscriptionFilterInput {
  filterName: string;
  logGroupName: string;
}
export type DeleteSubscriptionFilterOutput = OnlyHeaders;
export interface DescribeDestinationsInput {
  DestinationNamePrefix?: string;
  limit?: number;
  nextToken?: string;
}
export interface DescribeDestinationsOutput {
  nextToken: string;
  destinations: {
    creationTime: number;
    accessPolicy: string;
    arn: string;
    destinationName: string;
    roleArn: string;
    targetArn: string;
  }[];
}
export interface DescribeExportTasksInput {
  limit?: number;
  statusCode?: string;
  taskId?: string;
  nextToken?: string;
}
export interface DescribeExportTasksOutput {
  nextToken: string;
  exportTasks: {
    destination: string;
    destinationPrefix: string;
    from: number;
    logGroupName: string;
    taskId: string;
    taskName: string;
    to: number;
    status: { code: string; message: string };
    executionInfo: {
      completionTime: number;
      creationTime: number;
    };
  }[];
}
export interface DescribeLogGroupsInput {
  limit?: number;
  logGroupNamePrefix?: string;
  nextToken?: string;
}
export interface DescribeLogGroupsOutput {
  nextToken: string;
  logGroups: {
    arn: string;
    kmsKeyId: string;
    logGroupName: string;
    creationTime: number;
    metricFilterCount: number;
    retentionInDays: number;
    storedBytes: number;
  }[];
}
export interface DescribeLogStreamsInput {
  logGroupName: string;
  descending?: boolean;
  limit?: number;
  logStreamNamePrefix?: string;
  nextToken?: string;
  orderBy?: string;
}
export interface DescribeLogStreamsOutput {
  nextToken: string;
  logStreams: {
    arn: string;
    logStreamName: string;
    uploadSequenceToken: string;
    creationTime: number;
    firstEventTimestamp: number;
    lastEventTimestamp: number;
    lastIngestionTime: number;
    storedBytes: number;
  }[];
}
export interface DescribeMetricFiltersInput {
  limit: number;
  filterNamePrefix: string;
  logGroupName: string;
  metricName: string;
  metricNamespace: string;
  nextToken: string;
}
export interface DescribeMetricFiltersOutput {
  nextToken: string;
  metricFilters: {
    creationTime: number;
    filterName: string;
    filterPattern: string;
    logGroupName: string;
    metricTransformations: {
      defaultValue: number;
      dimensions: Dict<string>;
      metricName: string;
      metricNamespace: string;
      metricValue: string;
      unit: string;
    }[];
  }[];
}
export interface DescribeQueriesInput {
  maxResults?: number;
  logGroupName?: string;
  status?: string;
  nextToken?: string;
}
export interface DescribeQueriesOutput {
  nextToken: string;
  queries: {
    createTime: number;
    logGroupName: string;
    queryId: string;
    queryString: string;
    status: string;
  }[];
}
export interface DescribeQueryDefinitionsInput {
  maxResults?: number;
  nextToken?: string;
  queryDefinitionNamePrefix?: string;
}
export interface DescribeQueryDefinitionsOutput {
  nextToken: string;
  queryDefinitions: {
    lastModified: number;
    logGroupNames: string[];
    name: string;
    queryDefinitionId: string;
    queryString: string;
  }[];
}
export interface DescribeResourcePoliciesInput {
  limit?: number;
  nextToken?: string;
}
export interface DescribeResourcePoliciesOutput {
  nextToken: string;
  resourcePolicies: {
    lastUpdatedTime: number;
    policyDocument: string;
    policyName: string;
  }[];
}
export interface DescribeSubscriptionFiltersInput {
  logGroupName: string;
  filterNamePrefix?: string;
  limit?: number;
  nextToken?: string;
}
export interface DescribeSubscriptionFiltersOutput {
  nextToken: string;
  subscriptionFilters: {
    creationTime: number;
    destinationArn: string;
    distribution: string;
    filterName: string;
    filterPattern: string;
    logGroupName: string;
    roleArn: string;
  }[];
}
export interface DisassociateKmsKeyInput {
  logGroupName: string;
}
export type DisassociateKmsKeyOutput = OnlyHeaders;
export interface FilterLogEventsInput {
  logGroupName: "string";
  logStreamNamePrefix: string;
  filterPattern: string;
  startTime: number;
  endTime: number;
  interleaved: boolean;
  limit: number;
  nextToken: string;
  logStreamNames: string[];
}
export interface FilterLogEventsOutput {
  nextToken: string;
  events: {
    eventId: string;
    logStreamName: string;
    message: string;
    timestamp: number;
    ingestionTime: number;
  }[];
  searchedLogStreams: {
    logStreamName: string;
    searchedCompletely: boolean;
  }[];
}
export interface GetLogEventsInput {
  logGroupName: string;
  logStreamName: string;
  startTime?: number;
  endTime?: number;
  limit?: number;
  startFromHead?: boolean;
  nextToken?: string;
}
export interface GetLogEventsOutput {
  events: {
    ingestionTime: number;
    message: string;
    timestamp: number;
  }[];
  nextBackwardToken: string;
  nextForwardToken: string;
}
export interface GetLogGroupFieldsInput {
  logGroupName: string;
  time?: number;
}
export interface GetLogGroupFieldsOutput {
  logGroupFields: {
    name: string;
    percent: number;
  }[];
}
export interface GetLogRecordInput {
  logRecordPointer: string;
}
export interface GetLogRecordOutput {
  logRecord: Dict<string>;
}
export interface GetQueryResultsInput {
  queryId: string;
}
export interface GetQueryResultsOutput {
  results: { field: string; value: string }[][];
  status: string;
  statistics: {
    bytesScanned: number;
    recordsMatched: number;
    recordsScanned: number;
  };
}
export interface ListTagsLogGroupInput {
  logGroupName: string;
}
export interface ListTagsLogGroupOutput {
  tags: Dict<string>;
}
export interface PutDestinationInput {
  destinationName: string;
  roleArn: string;
  targetArn: string;
}
export interface PutDestinationOutput {
  destination: {
    creationTime: number;
    accessPolicy: string;
    arn: string;
    destinationName: string;
    roleArn: string;
    targetArn: string;
  };
}
export interface PutDestinationPolicyInput {
  accessPolicy: string;
  destinationName: string;
  forceUpdate?: boolean;
}
export type PutDestinationPolicyOutput = OnlyHeaders;

export type EasyLogEvent =
  | { message: string; timestamp: number }
  | number
  | Date
  | string
  | Dict<unknown>;
export interface PutLogEventsInput {
  logEvents: EasyLogEvent[];
  logGroupName: string;
  logStreamName: string;
  sequenceToken?: string;
}
export interface PutLogEventsOutput {
  nextSequenceToken: string;
  rejectedLogEventsInfo: {
    expiredLogEventEndIndex: number;
    tooNewLogEventStartIndex: number;
    tooOldLogEventEndIndex: number;
  };
}

export interface PutMetricFilterInput {
  filterName: string;
  filterPattern: string;
  logGroupName: string;
  metricTransformations: {
    defaultValue: number;
    dimensions: Dict<string>;
    metricName: string;
    metricNamespace: string;
    metricValue: string;
    unit: string;
  }[];
}
export type PutMetricFilterOutput = OnlyHeaders;

export interface PutQueryDefinitionInput {
  name: string;
  queryString: string;
  logGroupNames?: string[];
  queryDefinitionId?: string;
}
export interface PutQueryDefinitionOutput {
  queryDefinitionId: string;
}

export interface PutResourcePolicyInput {
  policyDocument: string;
  policyName: string;
}
export interface PutResourcePolicyOutput {
  resourcePolicy: {
    lastUpdatedTime: number;
    policyDocument: string;
    policyName: string;
  };
}

export interface PutRetentionPolicyInput {
  logGroupName: string;
  retentionInDays: number;
}
export type PutRetentionPolicyOutput = OnlyHeaders;

export interface PutSubscriptionFilterInput {
  destinationArn: string;
  filterName: string;
  filterPattern: string;
  logGroupName: string;
  distribution?: string;
  roleArn?: string;
}
export type PutSubscriptionFilterOutput = OnlyHeaders;

export type StartQueryInput =
  | StartQueryInputSingleGroupName
  | StartQueryInputMultiGroupName;
export interface StartQueryInputSingleGroupName {
  logGroupName: string;
  queryString: string;
  startTime: number;
  endTime: number;
  limit?: number;
}
export interface StartQueryInputMultiGroupName {
  logGroupNames: string[];
  queryString: string;
  startTime: number;
  endTime: number;
  limit?: number;
}

export interface StartQueryOutput {
  queryId: string;
}

export interface StopQueryInput {
  queryId: string;
}
export interface StopQueryOutput {
  success: boolean;
}

export interface TagLogGroupInput {
  logGroupName: string;
  tags: Dict<string>;
}
export type TagLogGroupOutput = OnlyHeaders;

export interface TestMetricFilterInput {
  filterPattern: string;
  logEventMessages: string[];
}
export interface TestMetricFilterOutput {
  matches: {
    eventMessage: string;
    eventNumber: number;
    extractedValues: Dict<string>;
  }[];
}

export interface UntagLogGroupInput {
  logGroupName: string;
  tags: string[];
}
export type UntagLogGroupOutput = OnlyHeaders;

// #endregion types

export type PromiseRequestFn = (
  req: Request | Promise<Request>,
) => Promise<Request>;

const sigMaker = (
  accessKeyId: string,
  secretAccessKey: string,
  region: string,
  service: string,
) => {
  const sign = awsV4Sig({
    region,
    service,
    awsAccessKeyId: accessKeyId,
    awsSecretKey: secretAccessKey,
  });
  return async (req: Request | Promise<Request>) => sign(await req);
};

const middleware =
  (fns: ((r: Request | Promise<Request>) => Promise<Request>)[]) =>
  (r: Request | Promise<Request>) => {
    return fns.reduce(async (p, f) => await f(p), Promise.resolve(r));
  };

const sendIt = <T>(r: Request | Promise<Request>) => {
  return {
    fetch: async (init?: RequestInit) => fetch(await r, init),
    request: async () => await r,
    json: async () => (await fetch(await r)).json() as Promise<T>,
    text: async () => (await fetch(await r)).text(),
    __mockedResponse: async (testingResponse: unknown) => await testingResponse,
  };
};

export const contentLen: PromiseRequestFn = async (r_) => {
  const r = await r_;
  const ab = await r.arrayBuffer();
  const len = ab.byteLength;
  return new Request(r.url, {
    ...r_,
    headers: {
      ...r.headers,
      "Content-Length": len.toString(),
    },
    body: ab,
  });
};

export class cloudwatchClient {
  #key: string;
  #secret: string;
  service = "logs";
  region: string;
  baseURL: string;
  middlewareFns: PromiseRequestFn[];
  signer: PromiseRequestFn;

  constructor(
    key: string,
    secret: string,
    region?: string,
    signer?: PromiseRequestFn,
    middlewareFns?: PromiseRequestFn[],
  ) {
    this.#key = key;
    this.#secret = secret;
    this.region = region ?? "us-central-1";
    this.signer = signer ??
      sigMaker(this.#key, this.#secret, this.region, this.service);
    this.baseURL = `https://${this.service}.${this.region}.amazonaws.com`;
    this.middlewareFns = middlewareFns
      ? middlewareFns.concat([this.signer, contentLen])
      : [contentLen, this.signer];
  }

  async associateKmsKey(i: AssociateKmsKeyInput) {
    const r = new Request(this.baseURL, {
      method: "POST",
      headers: {
        "X-Amz-Target": "Logs_20140328.AssociateKmsKey",
        "Content-Type": "application/x-amz-json-1.1",
      },
      body: JSON.stringify(await i),
    });
    return sendIt<AssociateKmsKeyOutput>(middleware(this.middlewareFns)(r));
  }
  cancelExportTask(i: CancelExportTaskInput) {
    const r = new Request(this.baseURL, {
      method: "POST",
      headers: {
        "X-Amz-Target": "Logs_20140328.CancelExportTask",
        "Content-Type": "application/x-amz-json-1.1",
      },
      body: JSON.stringify(i),
    });
    return sendIt<CancelExportTaskOutput>(middleware(this.middlewareFns)(r));
  }
  createExportTask(i: CreateExportTaskInput) {
    const r = new Request(this.baseURL, {
      method: "POST",
      headers: {
        "X-Amz-Target": "Logs_20140328.CreateExportTask",
        "Content-Type": "application/x-amz-json-1.1",
      },
      body: JSON.stringify(i),
    });
    return sendIt<CreateExportTaskOutput>(middleware(this.middlewareFns)(r));
  }
  createLogGroup(i: CreateLogGroupInput) {
    const r = new Request(this.baseURL, {
      method: "POST",
      headers: {
        "X-Amz-Target": "Logs_20140328.CreateLogGroup",
        "Content-Type": "application/x-amz-json-1.1",
      },
      body: JSON.stringify(i),
    });
    return sendIt<CreateLogGroupOutput>(middleware(this.middlewareFns)(r));
  }
  createLogStream(i: CreateLogStreamInput) {
    const r = new Request(this.baseURL, {
      method: "POST",
      headers: {
        "X-Amz-Target": "Logs_20140328.CreateLogStream",
        "Content-Type": "application/x-amz-json-1.1",
      },
      body: JSON.stringify(i),
    });
    return sendIt<CreateLogStreamOutput>(middleware(this.middlewareFns)(r));
  }
  deleteDestination(i: DeleteDestinationInput) {
    const r = new Request(this.baseURL, {
      method: "POST",
      headers: {
        "X-Amz-Target": "Logs_20140328.DeleteDestination",
        "Content-Type": "application/x-amz-json-1.1",
      },
      body: JSON.stringify(i),
    });
    return sendIt<DeleteDestinationOutput>(middleware(this.middlewareFns)(r));
  }
  deleteLogGroup(i: DeleteLogGroupInput) {
    const r = new Request(this.baseURL, {
      method: "POST",
      headers: {
        "X-Amz-Target": "Logs_20140328.DeleteLogGroup",
        "Content-Type": "application/x-amz-json-1.1",
      },
      body: JSON.stringify(i),
    });
    return sendIt<DeleteLogGroupOutput>(middleware(this.middlewareFns)(r));
  }
  deleteLogStream(i: DeleteLogStreamInput) {
    const r = new Request(this.baseURL, {
      method: "POST",
      headers: {
        "X-Amz-Target": "Logs_20140328.DeleteLogStream",
        "Content-Type": "application/x-amz-json-1.1",
      },
      body: JSON.stringify(i),
    });
    return sendIt<DeleteLogStreamOutput>(middleware(this.middlewareFns)(r));
  }
  deleteMetricFilter(i: DeleteMetricFilterInput) {
    const r = new Request(this.baseURL, {
      method: "POST",
      headers: {
        "X-Amz-Target": "Logs_20140328.DeleteLogStream",
        "Content-Type": "application/x-amz-json-1.1",
      },
      body: JSON.stringify(i),
    });
    return sendIt<DeleteMetricFilterInput>(middleware(this.middlewareFns)(r));
  }
  deleteQueryDefinition(i: DeleteQueryDefinitionInput) {
    const r = new Request(this.baseURL, {
      method: "POST",
      headers: {
        "X-Amz-Target": "Logs_20140328.DeleteQueryDefinition",
        "Content-Type": "application/x-amz-json-1.1",
      },
      body: JSON.stringify(i),
    });
    return sendIt<DeleteQueryDefinitionInput>(
      middleware(this.middlewareFns)(r),
    );
  }
  deleteResourcePolicy(i: DeleteResourcePolicyInput) {
    const r = new Request(this.baseURL, {
      method: "POST",
      headers: {
        "X-Amz-Target": "Logs_20140328.DeleteResourcePolicy",
        "Content-Type": "application/x-amz-json-1.1",
      },
      body: JSON.stringify(i),
    });
    return sendIt<DeleteResourcePolicyInput>(middleware(this.middlewareFns)(r));
  }
  deleteRetentionPolicy(i: DeleteRetentionPolicyInput) {
    const r = new Request(this.baseURL, {
      method: "POST",
      headers: {
        "X-Amz-Target": "Logs_20140328.DeleteRetentionPolicy",
        "Content-Type": "application/x-amz-json-1.1",
      },
      body: JSON.stringify(i),
    });
    return sendIt<DeleteRetentionPolicyInput>(
      middleware(this.middlewareFns)(r),
    );
  }
  deleteSubscriptionFilter(i: DeleteSubscriptionFilterInput) {
    const r = new Request(this.baseURL, {
      method: "POST",
      headers: {
        "X-Amz-Target": "Logs_20140328.DeleteSubscriptionFilter",
        "Content-Type": "application/x-amz-json-1.1",
      },
      body: JSON.stringify(i),
    });
    return sendIt<DeleteSubscriptionFilterInput>(
      middleware(this.middlewareFns)(r),
    );
  }
  describeDestinations(i: DescribeDestinationsInput) {
    const r = new Request(this.baseURL, {
      method: "POST",
      headers: {
        "X-Amz-Target": "Logs_20140328.DescribeDestinations",
        "Content-Type": "application/x-amz-json-1.1",
      },
      body: JSON.stringify(i),
    });
    return sendIt<DescribeDestinationsInput>(middleware(this.middlewareFns)(r));
  }
  describeExportTasks(i: DescribeExportTasksInput) {
    const r = new Request(this.baseURL, {
      method: "POST",
      headers: {
        "X-Amz-Target": "Logs_20140328.DescribeExportTasks",
        "Content-Type": "application/x-amz-json-1.1",
      },
      body: JSON.stringify(i),
    });
    return sendIt<DescribeExportTasksInput>(middleware(this.middlewareFns)(r));
  }
  describeLogGroups(i: DescribeLogGroupsInput) {
    const r = new Request(this.baseURL, {
      method: "POST",
      headers: {
        "X-Amz-Target": "Logs_20140328.DescribeLogGroups",
        "Content-Type": "application/x-amz-json-1.1",
      },
      body: JSON.stringify(i),
    });
    return sendIt<DescribeLogGroupsInput>(middleware(this.middlewareFns)(r));
  }
  describeLogStreams(i: DescribeLogStreamsInput) {
    const r = new Request(this.baseURL, {
      method: "POST",
      headers: {
        "X-Amz-Target": "Logs_20140328.DescribeLogStreams",
        "Content-Type": "application/x-amz-json-1.1",
      },
      body: JSON.stringify(i),
    });
    return sendIt<DescribeLogStreamsInput>(middleware(this.middlewareFns)(r));
  }
  describeMetricFilters(i: DescribeMetricFiltersInput) {
    const r = new Request(this.baseURL, {
      method: "POST",
      headers: {
        "X-Amz-Target": "Logs_20140328.DescribeMetricFilters",
        "Content-Type": "application/x-amz-json-1.1",
      },
      body: JSON.stringify(i),
    });
    return sendIt<DescribeMetricFiltersInput>(
      middleware(this.middlewareFns)(r),
    );
  }
  describeQueries(i: DescribeQueriesInput) {
    const r = new Request(this.baseURL, {
      method: "POST",
      headers: {
        "X-Amz-Target": "Logs_20140328.DescribeQueries",
        "Content-Type": "application/x-amz-json-1.1",
      },
      body: JSON.stringify(i),
    });
    return sendIt<DescribeQueriesInput>(middleware(this.middlewareFns)(r));
  }
  describeQueryDefinitions(i: DescribeQueryDefinitionsInput) {
    const r = new Request(this.baseURL, {
      method: "POST",
      headers: {
        "X-Amz-Target": "Logs_20140328.DescribeQueryDefinitions",
        "Content-Type": "application/x-amz-json-1.1",
      },
      body: JSON.stringify(i),
    });
    return sendIt<DescribeQueryDefinitionsInput>(
      middleware(this.middlewareFns)(r),
    );
  }
  describeResourcePolicies(i: DescribeResourcePoliciesInput) {
    const r = new Request(this.baseURL, {
      method: "POST",
      headers: {
        "X-Amz-Target": "Logs_20140328.DescribeResourcePolicies",
        "Content-Type": "application/x-amz-json-1.1",
      },
      body: JSON.stringify(i),
    });
    return sendIt<DescribeResourcePoliciesInput>(
      middleware(this.middlewareFns)(r),
    );
  }
  describeSubscriptionFilters(i: DescribeSubscriptionFiltersInput) {
    const r = new Request(this.baseURL, {
      method: "POST",
      headers: {
        "X-Amz-Target": "Logs_20140328.DescribeSubscriptionFilters",
        "Content-Type": "application/x-amz-json-1.1",
      },
      body: JSON.stringify(i),
    });
    return sendIt<DescribeSubscriptionFiltersInput>(
      middleware(this.middlewareFns)(r),
    );
  }
  disassociateKmsKey(i: DisassociateKmsKeyInput) {
    const r = new Request(this.baseURL, {
      method: "POST",
      headers: {
        "X-Amz-Target": "Logs_20140328.DisassociateKmsKey",
        "Content-Type": "application/x-amz-json-1.1",
      },
      body: JSON.stringify(i),
    });
    return sendIt<DisassociateKmsKeyInput>(middleware(this.middlewareFns)(r));
  }
  filterLogEvents(i: FilterLogEventsInput) {
    const r = new Request(this.baseURL, {
      method: "POST",
      headers: {
        "X-Amz-Target": "Logs_20140328.FilterLogEvents",
        "Content-Type": "application/x-amz-json-1.1",
      },
      body: JSON.stringify(i),
    });
    return sendIt<FilterLogEventsInput>(middleware(this.middlewareFns)(r));
  }
  getLogEvents(i: GetLogEventsInput) {
    const r = new Request(this.baseURL, {
      method: "POST",
      headers: {
        "X-Amz-Target": "Logs_20140328.GetLogEvents",
        "Content-Type": "application/x-amz-json-1.1",
      },
      body: JSON.stringify(i),
    });
    return sendIt<GetLogEventsInput>(middleware(this.middlewareFns)(r));
  }
  getLogGroupFields(i: GetLogGroupFieldsInput) {
    const r = new Request(this.baseURL, {
      method: "POST",
      headers: {
        "X-Amz-Target": "Logs_20140328.GetLogGroupFields",
        "Content-Type": "application/x-amz-json-1.1",
      },
      body: JSON.stringify(i),
    });
    return sendIt<GetLogGroupFieldsInput>(middleware(this.middlewareFns)(r));
  }
  getLogRecord(i: GetLogRecordInput) {
    const r = new Request(this.baseURL, {
      method: "POST",
      headers: {
        "X-Amz-Target": "Logs_20140328.GetLogRecord",
        "Content-Type": "application/x-amz-json-1.1",
      },
      body: JSON.stringify(i),
    });
    return sendIt<GetLogRecordInput>(middleware(this.middlewareFns)(r));
  }
  getQueryResults(i: GetQueryResultsInput) {
    const r = new Request(this.baseURL, {
      method: "POST",
      headers: {
        "X-Amz-Target": "Logs_20140328.GetQueryResults",
        "Content-Type": "application/x-amz-json-1.1",
      },
      body: JSON.stringify(i),
    });
    return sendIt<GetQueryResultsInput>(middleware(this.middlewareFns)(r));
  }
  listTagsLogGroup(i: ListTagsLogGroupInput) {
    const r = new Request(this.baseURL, {
      method: "POST",
      // headers:{
      // 'X-Amz-Target': 'Logs_20140328.ListTagsLogGroup',
      // 'Content-Type': 'application/x-amz-json-1.1'
      // },
      body: JSON.stringify(i),
    });
    return sendIt<ListTagsLogGroupInput>(middleware(this.middlewareFns)(r));
  }
  putDestination(i: PutDestinationInput) {
    const r = new Request(this.baseURL, {
      method: "POST",
      headers: {
        "X-Amz-Target": "Logs_20140328.PutDestination",
        "Content-Type": "application/x-amz-json-1.1",
      },
      body: JSON.stringify(i),
    });
    return sendIt<PutDestinationInput>(middleware(this.middlewareFns)(r));
  }
  putDestinationPolicy(i: PutDestinationPolicyInput) {
    const r = new Request(this.baseURL, {
      method: "POST",
      headers: {
        "X-Amz-Target": "Logs_20140328.PutDestinationPolicy",
        "Content-Type": "application/x-amz-json-1.1",
      },
      body: JSON.stringify(i),
    });
    return sendIt<PutDestinationPolicyInput>(middleware(this.middlewareFns)(r));
  }
  putLogEvents(i: PutLogEventsInput) {
    const r = new Request(this.baseURL, {
      method: "POST",
      headers: {
        "X-Amz-Target": "Logs_20140328.PutLogEvents",
        "Content-Type": "application/x-amz-json-1.1",
      },
      body: JSON.stringify(i),
    });
    return sendIt<PutLogEventsInput>(middleware(this.middlewareFns)(r));
  }
  putMetricFilter(i: PutMetricFilterInput) {
    const r = new Request(this.baseURL, {
      method: "POST",
      headers: {
        "X-Amz-Target": "Logs_20140328.PutMetricFilter",
        "Content-Type": "application/x-amz-json-1.1",
      },
      body: JSON.stringify(i),
    });
    return sendIt<PutMetricFilterInput>(middleware(this.middlewareFns)(r));
  }
  putQueryDefinition(i: PutQueryDefinitionInput) {
    const r = new Request(this.baseURL, {
      method: "POST",
      headers: {
        "X-Amz-Target": "Logs_20140328.PutQueryDefinition",
        "Content-Type": "application/x-amz-json-1.1",
      },
      body: JSON.stringify(i),
    });
    return sendIt<PutQueryDefinitionInput>(middleware(this.middlewareFns)(r));
  }
  putResourcePolicy(i: PutResourcePolicyInput) {
    const r = new Request(this.baseURL, {
      method: "POST",
      headers: {
        "X-Amz-Target": "Logs_20140328.PutResourcePolicy",
        "Content-Type": "application/x-amz-json-1.1",
      },
      body: JSON.stringify(i),
    });
    return sendIt<PutResourcePolicyInput>(middleware(this.middlewareFns)(r));
  }
  putRetentionPolicy(i: PutRetentionPolicyInput) {
    const r = new Request(this.baseURL, {
      method: "POST",
      headers: {
        "X-Amz-Target": "Logs_20140328.PutRetentionPolicy",
        "Content-Type": "application/x-amz-json-1.1",
      },
      body: JSON.stringify(i),
    });
    return sendIt<PutRetentionPolicyInput>(middleware(this.middlewareFns)(r));
  }
  putSubscriptionFilter(i: PutSubscriptionFilterInput) {
    const r = new Request(this.baseURL, {
      method: "POST",
      headers: {
        "X-Amz-Target": "Logs_20140328.PutSubscriptionFilter",
        "Content-Type": "application/x-amz-json-1.1",
      },
      body: JSON.stringify(i),
    });
    return sendIt<PutSubscriptionFilterInput>(
      middleware(this.middlewareFns)(r),
    );
  }
  startQuery(i: StartQueryInput) {
    const r = new Request(this.baseURL, {
      method: "POST",
      headers: {
        "X-Amz-Target": "Logs_20140328.StartQuery",
        "Content-Type": "application/x-amz-json-1.1",
      },
      body: JSON.stringify(i),
    });
    return sendIt<StartQueryInput>(middleware(this.middlewareFns)(r));
  }
  stopQuery(i: StopQueryOutput) {
    const r = new Request(this.baseURL, {
      method: "POST",
      headers: {
        "X-Amz-Target": "Logs_20140328.StopQuery",
        "Content-Type": "application/x-amz-json-1.1",
      },
      body: JSON.stringify(i),
    });
    return sendIt<StopQueryOutput>(middleware(this.middlewareFns)(r));
  }
  tagLogGroup(i: TagLogGroupInput) {
    const r = new Request(this.baseURL, {
      method: "POST",
      headers: {
        "X-Amz-Target": "Logs_20140328.TagLogGroup",
        "Content-Type": "application/x-amz-json-1.1",
      },
      body: JSON.stringify(i),
    });
    return sendIt<TagLogGroupInput>(middleware(this.middlewareFns)(r));
  }
  testMetricFilter(i: TestMetricFilterInput) {
    const r = new Request(this.baseURL, {
      method: "POST",
      headers: {
        "X-Amz-Target": "Logs_20140328.TestMetricFilter",
        "Content-Type": "application/x-amz-json-1.1",
      },
      body: JSON.stringify(i),
    });
    return sendIt<TestMetricFilterInput>(middleware(this.middlewareFns)(r));
  }
  untagLogGroup(i: UntagLogGroupInput) {
    const r = new Request(this.baseURL, {
      method: "POST",
      headers: {
        "X-Amz-Target": "Logs_20140328.UntagLogGroup",
        "Content-Type": "application/x-amz-json-1.1",
      },
      body: JSON.stringify(i),
    });
    return sendIt<UntagLogGroupInput>(middleware(this.middlewareFns)(r));
  }
}
