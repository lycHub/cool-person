import { join } from 'node:path';

import vue from '@vitejs/plugin-vue';
import { defineConfig, loadEnv } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';

export default defineConfig(({ command, mode }) => {
  const isLocal = command === 'serve';
  const env = loadEnv(mode, join(__dirname, 'envs'), 'VITE_');
  return {
    plugins: [vue(), vueDevTools()],
    envDir: 'envs',
    base: isLocal ? '/' : env.VITE_PUBLIC_PATH,
    server: {
      host: '0.0.0.0',
    },
    ssr: {
      noExternal: ['@personal/shared', 'gsap'],
    },
  };
});
