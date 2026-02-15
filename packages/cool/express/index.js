import express from 'express';
import { devRouter, prodRouter, apiRouter } from './routes/index.js';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const isDev = process.env.NODE_ENV === 'development';
app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(join(__dirname, '../dist/client'), { index: false }));

const PORT = isDev ? 3333 : 3334;

// console.log({ isDev });

app.use('/api', apiRouter);
app.get('*all', isDev ? devRouter : prodRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  console.log('next', next.name);
  res.status(500).send('Something broken!!!');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('Listen at http://localhost:' + PORT);
});
