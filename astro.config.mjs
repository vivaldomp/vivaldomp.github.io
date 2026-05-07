import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://vivaldomp.github.io',
  trailingSlash: 'ignore',
  build: {
    assets: 'assets',
  },
});
