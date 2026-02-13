import { createPinia } from 'pinia';
import { createSSRApp } from 'vue';

import App from './App.vue';
// import { RootStoreProvideKey } from './utils';

import type { SSRContext } from 'vue/server-renderer';

export interface SsrRenderContext extends SSRContext {
  manifest: Record<string, string[]>;
  data: object;
  originalUrl: string;
  url: string;
}

export function createApp() {
  const app = createSSRApp(App);
  const pinia = createPinia();
  // app.provide(RootStoreProvideKey, pinia);

  return { app, pinia };
}
