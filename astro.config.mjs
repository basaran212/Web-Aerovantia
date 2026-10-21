// @ts-check
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// lastmod real: fecha del último commit del archivo que genera cada URL.
const lastCommit = (files) => {
  for (const f of files) {
    if (!existsSync(f)) continue;
    try {
      const d = execSync(`git log -1 --format=%cI -- "${f}"`, { encoding: 'utf8' }).trim();
      if (d) return d;
    } catch {}
  }
  return undefined;
};
const sourceOf = (url) => {
  const path = new URL(url).pathname.replace(/^\/|\/$/g, '');
  if (path.startsWith('zona/') && path.split('/').length === 3) return ['src/data/municipios.ts'];
  if (!path) return ['src/pages/index.astro'];
  return [`src/pages/${path}.astro`, `src/pages/${path}/index.astro`];
};

// https://astro.build/config
export default defineConfig({
  site: 'https://aerovantia.es',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !/\/(gracias|404)\//.test(page),
      chunks: {
        zona: (item) => (/\/zona\//.test(item.url) ? item : undefined),
        ayudas: (item) => (/\/ayudas\//.test(item.url) ? item : undefined),
        guias: (item) => (/\/(guias\/|aerotermia\/con-radiadores\/|placas-solares\/baterias\/)/.test(item.url) ? item : undefined),
        servicios: (item) => (/\/(zona|ayudas|guias)\/|\/aerotermia\/con-radiadores\/|\/placas-solares\/baterias\// .test(item.url) ? undefined : item),
      },
      serialize: (item) => ({ ...item, lastmod: lastCommit(sourceOf(item.url)) }),
    }),
  ],
});
