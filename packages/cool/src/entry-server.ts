import { renderToNodeStream } from 'vue/server-renderer';
import { createHead } from '@unhead/vue/server';
import devalue from '@nuxt/devalue';

import { getInitHead } from './utils/head';
import { createApp, type SsrRenderContext } from './main';
import { createRouterInstance } from './router/ssr';
import { useApiDataStore } from './store';

export async function render(ctx: SsrRenderContext) {
  const { app, pinia } = createApp();
  const router = createRouterInstance();

  const head = createHead({
    init: getInitHead(),
  });

  app.use(router).use(pinia).use(head);

  router.push(ctx.originalUrl);

  await router.isReady();

  const matchedRoute = router.currentRoute.value;

  if (!matchedRoute.matched.length) {
    return {
      stream: null,
      head: null,
    };
  }

  const appStore = useApiDataStore(pinia);

  if (ctx.apiData) {
    appStore.changeState(ctx.apiData);
  }
  const piniaState = devalue(pinia.state.value);
  return {
    stream: renderToNodeStream(app, ctx),
    head,
    piniaState,
  };
}
