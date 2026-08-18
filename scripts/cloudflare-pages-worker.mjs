import worker from "../dist/server/index.js";

const pagesWorker = {
  async fetch(request, env, context) {
    if (
      env.ASSETS &&
      (request.method === "GET" || request.method === "HEAD")
    ) {
      const assetResponse = await env.ASSETS.fetch(request);
      if (assetResponse.status !== 404) return assetResponse;
    }

    const response = await worker.fetch(request, env, context);
    const linkHeader = response.headers.get("link");
    if (!linkHeader || !linkHeader.includes(".woff2")) return response;

    const headers = new Headers(response.headers);
    const nonFontPreloads = linkHeader
      .split(/,\s*(?=<)/)
      .filter((entry) => !entry.includes(".woff2"));
    if (nonFontPreloads.length > 0) {
      headers.set("link", nonFontPreloads.join(", "));
    } else {
      headers.delete("link");
    }

    return new Response(response.body, {
      headers,
      status: response.status,
      statusText: response.statusText,
    });
  },
};

export default pagesWorker;
