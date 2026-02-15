import { join } from 'node:path';

import vue from '@vitejs/plugin-vue';
import { defineConfig, loadEnv } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';
import UnheadVite from '@unhead/addons/vite';

export default defineConfig(({ command, mode, isSsrBuild }) => {
  const isLocal = command === 'serve';
  const env = loadEnv(mode, join(__dirname, 'envs'), 'VITE_');
  const outputDir = isSsrBuild ? './dist/server' : './dist/client';
  return {
    plugins: [vue(), UnheadVite(), vueDevTools()],
    envDir: 'envs',
    base: isLocal ? '/' : env.VITE_PUBLIC_PATH,
    server: {
      host: '0.0.0.0',
    },
    ssr: {
      noExternal: ['@personal/shared', 'gsap'],
    },
    build: {
      outDir: outputDir,
    },
  };
});
