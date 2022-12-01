export const sendJson = (data: unknown, status: number, statusText: string) => {
  const jsonstr = JSON.stringify(data);
  return new Response(jsonstr, {
    status,
    statusText,
    headers: {
      "content-length": jsonstr.length.toString(),
      "content-type": "application/json; charset=UTF-8",
    },
  });
};

export default sendJson;
