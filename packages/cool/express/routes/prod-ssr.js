import express from 'express';
import { join } from 'node:path';
import fse from 'fs-extra';
import { renderPreloadLinks } from '../utils/preload.js';
import { transformHtmlTemplate } from '@unhead/vue/server';
import { shouldSkipSSR } from '../utils/ssr-filter.js';
import { getDefaultValue } from '../utils/constants.js';
import { getDirname } from '../utils/dirname.js';

const router = express.Router({ caseSensitive: true });

const __dirname = getDirname(import.meta.url);

async function run() {
  const manifest = JSON.parse(
    fse.readFileSync(join(__dirname, '../client/.vite/ssr-manifest.json'), 'utf-8'),
  );

  const { render } = await import('../server/entry-server.js');

  router.get('*all', async (req, res, next) => {
    // Remove /ssr prefix from the URL for SSR processing
    const originalUrl = req.originalUrl.replace(/^\/ssr/, '') || '/';
    const url = req.url.replace(/^\/ssr/, '') || '/';

    if (shouldSkipSSR(originalUrl)) {
      return next();
    }

    let originHtml = fse.readFileSync(join(__dirname, '../client/index.html'), 'utf-8');

    const ctx = {
      originalUrl,
      url,
      apiData: getDefaultValue(),
      manifest,
    };

    try {
      const { stream, head, piniaState } = await render(ctx);
      if (!stream || !head || !piniaState) {
        return next();
      }

      originHtml = originHtml.replace(
        '<!--pinia-state-->',
        `<script>window.__PINIA_STATE__ = ${piniaState}</script>`,
      );

      let htmlStr = await transformHtmlTemplate(head, originHtml);

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      if (ctx.modules && manifest) {
        const preloadLinks = renderPreloadLinks(ctx.modules, manifest);
        htmlStr = htmlStr.replace('<!--preload-links-->', preloadLinks);
      }

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
      console.error(error);
      next(error);
    }
  });
}

export { router, run };
