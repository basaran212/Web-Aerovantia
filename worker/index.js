// Sirve la web estática (dist/) y añade dos cosas:
// 1. Redirecciones 301 de las URL antiguas, sin cadenas.
// 2. noindex en cualquier dominio que no sea aerovantia.es (workers.dev y previews): cabecera
//    X-Robots-Tag y <meta name="robots">, para que el staging no se indexe nunca.
const PRODUCTION = new Set(["aerovantia.es", "www.aerovantia.es"]);
const REDIRECTS = {
  "/reformas-de-lujo/": "/reformas/",
  "/reformas-de-lujo": "/reformas/",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const to = REDIRECTS[url.pathname];
    if (to) return Response.redirect(new URL(to + url.search, url.origin).toString(), 301);
    if (url.hostname === "www.aerovantia.es") return Response.redirect(`https://aerovantia.es${url.pathname}${url.search}`, 301);

    const res = await env.ASSETS.fetch(request);
    if (PRODUCTION.has(url.hostname)) return res;

    const out = new Response(res.body, res);
    out.headers.set("X-Robots-Tag", "noindex, nofollow");
    if (!(out.headers.get("content-type") || "").includes("text/html")) return out;
    return new HTMLRewriter()
      .on('meta[name="robots"]', { element: (el) => el.remove() })
      .on("head", { element: (el) => el.append('<meta name="robots" content="noindex, nofollow">', { html: true }) })
      .transform(out);
  },
};
