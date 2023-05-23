export const sendJsonNd = <T>(
	data: T[],
	status: number,
	headers?: Record<string, string>,
) => {
	let enc: TextEncoder | undefined;
	let i = 0;
	let accLen = 0;
	return new Response(
		new ReadableStream({
			start() {
				enc = new TextEncoder();
			},
			pull: (defController) => {
				const encMsg = enc!.encode(data.at(i)?.toString());
				defController.enqueue(encMsg);
				accLen = accLen + encMsg.length;
				i++;
			},
			cancel() {
				enc = undefined;
			},
		}),
		{
			status,
			headers: {
				...headers,
				"charset": "UTF-8",
				"content-length": accLen.toString(),
				"content-type": "application/jsonlines+json",
			},
		},
	);
};

export default sendJsonNd;
