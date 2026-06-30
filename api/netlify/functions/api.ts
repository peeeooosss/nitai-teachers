import app from "../../src/app";

export const handler = async (
  event: any,
  context: Record<string, unknown>,
) => {
  // Support both streaming (Request) and buffered (event) invocation
  const req =
    event instanceof Request
      ? event
      : new Request(
          new URL(
            event.path,
            `https://${event.headers?.host ?? "nitaiaiteachersautomation.netlify.app"}`,
          ),
          {
            method: event.httpMethod ?? "GET",
            headers: new Headers(event.headers ?? {}),
            body: event.body
              ? event.isBase64Encoded
                ? Uint8Array.from(atob(event.body), (c) => c.charCodeAt(0))
                : event.body
              : null,
          },
        );

  const res = await app.fetch(req, { context });

  // Support buffered invocation (old format)
  if (!(event instanceof Request)) {
    return {
      statusCode: res.status,
      headers: Object.fromEntries(res.headers.entries()),
      body: await res.text(),
    };
  }

  return res;
};
