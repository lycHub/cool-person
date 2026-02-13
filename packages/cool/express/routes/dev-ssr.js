import express from 'express';
import { createServer } from 'vite';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import fse from 'fs-extra';
import { RouteServerMap } from '../route-apis/index.js';
import { buildMultiPath } from '../utils/path.js';
import { transformHtmlTemplate } from '@unhead/vue/server';
import { shouldSkipSSR } from '../utils/ssr-filter.js';

const router = express.Router({ caseSensitive: true });

async function run() {
  const vite = await createServer({
    mode: 'ssr',
    logLevel: 'info',
    server: {
      middlewareMode: true,
      watch: {
        usePolling: true,
        interval: 100,
      },
    },
    appType: 'custom',
  });

  router.use(vite.middlewares);

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  router.get('*all', async (req, res, next) => {
    const originalUrl = req.originalUrl;

    if (shouldSkipSSR(originalUrl)) {
      return next();
    }

    let originHtml = fse.readFileSync(join(__dirname, '../../index.html'), 'utf-8');
    

    let loadedData = {};

    // const matchRouteInfo = Object.keys(RouteServerMap)
    //   .map((item) => {
    //     const fn = match(item);
    //     const matchInfo = fn(originalUrl);
    //     return {
    //       apiKey: item,
    //       key: matchInfo ? buildMultiPath(matchInfo.path) : item,
    //       matchInfo,
    //     };
    //   })
    //   .filter((item) => item.matchInfo)[0];

    // // console.log("matchRouteKey :>> ", matchRouteInfo?.key);
    // if (matchRouteInfo) {
    //   const serverAction = RouteServerMap[matchRouteInfo.apiKey];
    //   req.params.id = matchRouteInfo.matchInfo
    //     ? matchRouteInfo.matchInfo.params?.id
    //     : "";
    //   const data = await serverAction(req);
    //   loadedData = { [matchRouteInfo.key]: data };
    // }

    // console.log('loadedData>>>>>>>', loadedData);

    try {
      const { render } = await vite.ssrLoadModule(join(__dirname, '../../src/entry-server.ts'));
      const { stream, head } = await render({
        originalUrl,
        url: req.url,
        data: loadedData,
      });
      if (!stream || !head) {
        return next();
      }
console.log('SSR rendering>>>', originalUrl);
      const htmlWithHead = await transformHtmlTemplate(head, originHtml);
      const htmlStr = await vite.transformIndexHtml(originalUrl, htmlWithHead);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      const [templateStart, templateEnd] = htmlStr.split('<!--ssr-outlet-->');
      res.write(templateStart);
      stream.pipe(res, { end: false });

      stream.on('error', (err) => {
        console.error(err);
        res.statusCode = 500;
        res.setHeader('content-type', 'text/html');
        res.send('<h1>出错了</h1>');
        stream.abort();
        next(error);
      });

      stream.on('end', () => {
        res.write(templateEnd);
        res.end();
      });
    } catch (error) {
      vite.ssrFixStacktrace(error);
      console.error(error);
      next(error);
    }
  });
}

run();

export { router };
