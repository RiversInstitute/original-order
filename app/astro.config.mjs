// @ts-check
import { defineConfig } from 'astro/config';
import path from "path";

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  vite: {
    resolve: {
      alias: {
        "@": path.resolve("./src"),
      },
    },
  }
});