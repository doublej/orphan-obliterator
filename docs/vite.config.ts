import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [sveltekit()],
  resolve: {
    alias: {
      'orphan-obliterator': resolve(__dirname, '../dist/index.js')
    }
  },
  ssr: {
    noExternal: ['orphan-obliterator']
  }
});
