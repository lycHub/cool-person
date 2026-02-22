import express from 'express';
import { createServer } from 'vite';
import { join } from 'node:path';
import fse from 'fs-extra';
import { transformHtmlTemplate } from '@unhead/vue/server';
import { shouldSkipSSR } from '../utils/ssr-filter.js';
import { getDefaultValue } from '../utils/constants.js';
import { getDirname } from '../utils/dirname.js';
import { BasePathName } from '../utils/constants.js';

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

  const __dirname = getDirname(import.meta.url);

  router.get('*all', async (req, res, next) => {
    // Remove /ssr prefix from the URL for SSR processing
    const originalUrl = req.originalUrl.replace(new RegExp('^/' + BasePathName), '') || '/';
    const url = req.url.replace(new RegExp('^/' + BasePathName), '') || '/';

    if (shouldSkipSSR(originalUrl)) {
      return next();
    }

    let originHtml = fse.readFileSync(join(__dirname, '../../index.html'), 'utf-8');

    try {
      const { render } = await vite.ssrLoadModule(join(__dirname, '../../src/entry-server.ts'));
      const { stream, head, piniaState } = await render({
        originalUrl,
        url,
        apiData: getDefaultValue(),
      });
      if (!stream || !head || !piniaState) {
        return next();
      }
      console.log('SSR rendering>>>', originalUrl);
      originHtml = originHtml.replace(
        '<!--pinia-state-->',
        `<script>window.__PINIA_STATE__ = ${piniaState}</script>`,
      );
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
        next(err);
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

export { router, run };
