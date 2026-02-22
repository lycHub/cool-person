import express from 'express';
import { devRouter, prodRouter, apiRouter } from './routes/index.js';
import { join } from 'node:path';
import { getDirname } from './utils/dirname.js';
import { BasePathName } from './utils/constants.js';

const app = express();
const isDev = process.env.NODE_ENV === 'development';
app.use(express.json());
const __dirname = getDirname(import.meta.url);

// Serve static files under /ssr base URL
app.use('/' + BasePathName, express.static(join(__dirname, './client'), { index: false }));

const PORT = isDev ? 3333 : 3334;

// console.log({ isDev });

app.use('/api', apiRouter);
// Mount SSR routers under /ssr base URL
app.use('/' + BasePathName, isDev ? devRouter : prodRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  console.log('next', next.name);
  res.status(500).send('Something broken!!!');
});

app.listen(PORT, '::', () => {
  console.log(`Listen at http://localhost:${PORT}/${BasePathName}`);
});
