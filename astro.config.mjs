import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.mypropair.com',
  output: 'static',
  build: {
    assets: '_assets',
  },
});
