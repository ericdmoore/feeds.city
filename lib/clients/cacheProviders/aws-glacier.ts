/**
 * Due to the nature of how the glacier API works,
 * we need to use the a DynamoDB table to store the metadata of the vaults.
 * This helps with retaining the required information so that
 * vault retrival is avaiable at some later time.
 *
 * Determine if this is actually helpful...
 * The better approach might be to just ensure that
 * lifecycle configs exist on buckets to use the Tiered Storage Classes
 * so that S3 managages what is moved up and down witin the storage classes.
 *
 * Since Glacier is organized around "Running JOBs"... (and their status, and completions...)
 * this feels like a sufficiently different way to manage the data
 * than using within another tiered cache.
 */

// @ref: https://www.npmjs.com/package/@aws-sdk/client-glacier
import {
	GlacierClient,
	ListVaultsCommand,
	UploadArchiveCommand,
	type UploadArchiveInput,
} from "@aws-sdk/client-glacier";

import {
	DeleteItemCommand,
	DeleteItemCommandOutput,
	DescribeTableCommand,
	DescribeTableCommandOutput,
	DescribeTimeToLiveCommand,
	DescribeTimeToLiveCommandOutput,
	DynamoDBClient,
	GetItemCommand,
	PutItemCommand,
	QueryCommand,
	type QueryCommandInput,
	QueryCommandOutput,
	ScanCommand,
	type ScanCommandInput,
	ScanCommandOutput,
} from "@aws-sdk/client-dynamodb";

import {
	type CacheName,
	defaultFromBytes,
	defaultRenamer,
	defaultToBytesWithTypeNote,
	type ICacheableDataForCache,
	type ICacheDataFromProvider,
	type ICacheProvider,
	type NullableProviderData,
	type TransformFromBytes,
	type TransformToBytes,
} from "../cache.ts";

/**
 *
AbortMultipartUpload
AbortVaultLock
AddTagsToVault
CompleteMultipartUpload
CompleteVaultLock
CreateVault
    - Names can be between 1 and 255 characters long.
    - Allowed characters are a-z, A-Z, 0-9, '_' (underscore), '-' (hyphen), and '.' (period).
    - limit of - 1,000 vaults per account
	Creates a Vault Location - used in down stream calls
DeleteArchive
DeleteVault
DeleteVaultAccessPolicy
DeleteVaultNotifications
DescribeJob
DescribeVault
GetDataRetrievalPolicy
GetJobOutput
GetVaultAccessPolicy
GetVaultLock
GetVaultNotifications
InitiateJob
	tyeps: "select", "archive-retrieval" and "inventory-retrieval"
	- why not just instatiate each job type with its own command/function?
InitiateMultipartUpload
InitiateVaultLock
ListJobs
ListMultipartUploads
ListParts
ListProvisionedCapacity
ListTagsForVault
ListVaults
PurchaseProvisionedCapacity
RemoveTagsFromVault
SetDataRetrievalPolicy
SetVaultAccessPolicy
SetVaultNotifications
UploadArchive
UploadMultipartPart
 */

export interface GlacierCache extends ICacheProvider<Uint8Array> {
	provider: string;
	meta: {
		size: () => number;
		cloud: "AWS:Glacier";
		service: "Glacier";
		region: string;
		describeTable: () => Promise<DescribeTableCommandOutput>;
		describeTTL: () => Promise<DescribeTimeToLiveCommandOutput>;
		deleteItem: (name: string) => Promise<DeleteItemCommandOutput>;
		scan: (input: Omit<ScanCommandInput, "TableName">) => Promise<ScanCommandOutput>;
		query: (input: Omit<QueryCommandInput, "TableName">) => Promise<QueryCommandOutput>;
	};
	transforms: {
		renamer(originalName: string): Promise<CacheName>;
		toBytes: TransformToBytes;
		fromBytes: TransformFromBytes;
	};
	set: (name: string, data: Uint8Array | string) => Promise<ICacheDataFromProvider>;
	get: (name: string) => Promise<NullableProviderData<Uint8Array>>;
	peek: (name: string) => Promise<NullableProviderData<Uint8Array>>;
	del: (name: string) => Promise<NullableProviderData<Uint8Array>>;
	has: (name: string) => Promise<boolean>;
}
