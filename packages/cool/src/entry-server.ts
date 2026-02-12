import { renderToNodeStream } from 'vue/server-renderer';
import { createHead } from '@unhead/vue/server';

import { getInitHead } from './utils/head';
import { createApp, type SsrRenderContext } from './main';
import router from './router/ssr';

export function render(ctx: SsrRenderContext) {
  // console.log('render ctx>>', {
  //   originalUrl: ctx?.originalUrl,
  //   url: ctx?.url,
  // });
  const { app, pinia } = createApp();

  if (ctx.originalUrl) {
    router.push(ctx.originalUrl);
  }

  const head = createHead({
    init: getInitHead(),
  });

  app.use(router).use(pinia).use(head);

  return router.isReady().then(() => {
    return {
      stream: renderToNodeStream(app, ctx),
      head,
    };
  });
}
