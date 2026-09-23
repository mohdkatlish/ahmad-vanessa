// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { legalTodos } from './src/data/legal.ts';

if (legalTodos.length) {
  console.warn(
    `\n⚠️  Impressum/Datenschutz: fill in src/data/legal.ts before going live (missing: ${legalTodos.join(', ')})\n`,
  );
}

// https://astro.build/config
export default defineConfig({
  site: 'https://ahmad-vanessa.com',
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (page) => !page.includes('/kontakt/danke/') })],
});
