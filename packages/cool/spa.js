import { join } from 'node:path';

import express from 'express';
import history from 'connect-history-api-fallback';

import { getDirname } from './express/utils/dirname.js';

const app = express();
const __dirname = getDirname(import.meta.url);
app.use(history());
app.use(express.static(join(__dirname, 'dist')));

app.use((err, req, res, next) => {
  res.status(500).send('Something broken!!!');
});

const PORT = 3335;
app.listen(PORT, '::', () => {
  console.log('Listen at http://localhost:' + PORT);
});
