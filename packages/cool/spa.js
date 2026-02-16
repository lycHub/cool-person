import { join } from 'node:path';

import express from 'express';

import { getDirname } from './express/utils/dirname.js';

const app = express();
const __dirname = getDirname(import.meta.url);

const isStaticResource = (path) => {
  return /\.(js|css|png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|eot|json|map)$/.test(path);
};

app.use('/spa', express.static(join(__dirname, 'dist')));

app.use((req, res, next) => {
  if (req.path.startsWith('/spa') && !isStaticResource(req.path)) {
    res.sendFile(join(__dirname, 'dist', 'index.html'));
  } else {
    next();
  }
});

app.use((err, req, res, next) => {
  res.status(500).send('Something broken!!!');
});

const PORT = 3335;
app.listen(PORT, '::', () => {
  console.log('Listen at http://localhost:' + PORT + '/spa');
});
