import { renderToNodeStream } from 'vue/server-renderer';

import router from './router/ssr';
import { createApp, type SsrRenderContext } from './main';

export function render(ctx: SsrRenderContext) {
  // console.log('render ctx>>', {
  //   originalUrl: ctx?.originalUrl,
  //   url: ctx?.url,
  // });
  const { app, pinia } = createApp();

  if (ctx.originalUrl) {
    router.push(ctx.originalUrl);
  }
  app.use(router).use(pinia);
  return router.isReady().then(() => renderToNodeStream(app, ctx));
}
