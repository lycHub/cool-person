import { join } from 'node:path';

import vue from '@vitejs/plugin-vue';
import { defineConfig, loadEnv } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';

export default defineConfig(({ mode, isSsrBuild }) => {
  const env = loadEnv(mode, join(__dirname, 'envs'), 'VITE_');
  return {
    plugins: [vue(), vueDevTools()],
    envDir: 'envs',
    base: isSsrBuild ? env.VITE_PUBLIC_PATH_SSR : env.VITE_PUBLIC_PATH,
    server: {
      host: '0.0.0.0',
    },
  };
});
