import express from 'express';

import { render } from '../../dist/server/entry-server.js';
import { join, dirname, basename } from 'node:path';
import fse from 'fs-extra';
import { fileURLToPath } from 'node:url';
import { renderPreloadLinks } from '../utils/preload.js';

const router = express.Router({ caseSensitive: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const manifest = JSON.parse(
  fse.readFileSync(join(__dirname, '../../dist/client/.vite/ssr-manifest.json'), 'utf-8'),
);

async function run() {
  router.get('*all', async (req, res, next) => {
    const originalUrl = req.originalUrl;

    let htmlStr = fse.readFileSync(join(__dirname, '../../dist/client/index.html'), 'utf-8');

    const loadedData = {};

    const ctx = {
      originalUrl,
      url: req.url,
      data: loadedData,
      manifest,
    };

    try {
      const stream = await render(ctx);

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      if (ctx.modules && manifest) {
        const preloadLinks = renderPreloadLinks(ctx.modules, manifest);
        htmlStr = htmlStr.replace('<!--preload-links-->', preloadLinks);
        // console.log('preloadLinks>>>', preloadLinks);
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
        next(error);
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

run();

export { router };
