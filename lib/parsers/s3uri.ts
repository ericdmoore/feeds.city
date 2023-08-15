interface S3UriParts {
	Bucket: string;
	Key: string;
	hash: string;
	protocol: string;
	query: Record<string, string>;
	creds?: {
		region: string;
		key: string; // username
		secret: string; // password
	};
}

export const s3UriParse = (str: string) => {
	const s3URL = new URL(str);
	const [preamble, _, BucketAt, KeyPathAt] = s3URL.pathname.split("/");
	const [proto, region_] = s3URL.href.includes("@")
		? preamble.split("@")[1].slice(0, -1).split(".")
		: s3URL.protocol.slice(0, -1).split(".");

	// console.log({proto, region_ })

	const {
		username,
		password,
		protocol,
		region,
		Bucket,
		Key,
	} = s3URL.href.includes("@")
		? {
			protocol: proto,
			password: preamble.split("@")[0],
			username: s3URL.protocol.slice(0, -1),
			region: region_,
			Key: KeyPathAt,
			Bucket: BucketAt,
		}
		: {
			protocol: proto,
			password: s3URL.password,
			username: s3URL.username,
			region: region_,
			Key: s3URL.pathname.slice(1),
			Bucket: s3URL.hostname,
		};

	const query = Object.fromEntries(s3URL.searchParams.entries());
	return {
		Bucket,
		Key,
		protocol: protocol ?? "s3",
		hash: s3URL.hash.slice(1),
		query,
		creds: {
			key: username,
			secret: password,
			region: region ?? query["region"] ?? "",
		},
	} as S3UriParts;
};

export const s3stringer = (_config?: unknown) => {
	const httpString = (input: S3UriParts, other: { region: string; webhosting: boolean }) => {
		const usingCreds = input.creds?.key && input.creds?.secret ? `${input.creds.key}:${input.creds.secret}@` : "";

		const queryString = Object.entries(input.query)
			.map(([key, val]) => {
				return `${key}=${val}`;
			}).join("&");

		const usingQueryString = queryString.length > 0 ? `?${queryString}` : "";

		const usingWebhosting = other.webhosting ? `s3-website` : "s3";

		const usingHash = input.hash.length > 0 ? `#${input.hash}` : "";

		return `${usingCreds}` +
			`http://` +
			`${input.Bucket}.` +
			` ${usingWebhosting}` +
			`.${other.region}.amazonaws.com/` +
			`${input.Key}` +
			`${usingQueryString}` +
			`${usingHash}`;
	};

	const s3String = (input: S3UriParts) => {
		const protocolAndMaybeRegion = input.creds?.region ? `s3.${input.creds?.region}://` : `s3://`;

		const usingCreds = input.creds?.key && input.creds?.secret && input.creds?.region
			? `${input.creds.key}:${input.creds.secret}@`
			: "";

		const queryString = Object.entries(input.query)
			.map(([key, val]) => {
				return `${key}=${val}`;
			}).join("&");

		const usingQueryString = queryString.length > 0 ? `?${queryString}` : "";

		return `${usingCreds}` +
			`${protocolAndMaybeRegion}` +
			`${input.Bucket}/${input.Key}` +
			`${usingQueryString}` +
			`${input.hash.length > 0 ? `#${input.hash}` : ""}`;
	};

	return { httpString, s3String, parse: (input: string) => s3UriParse(input) };
};

export default s3stringer;
