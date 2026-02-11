import express from 'express';
import { devRouter, prodRouter, apiRouter } from './routes/index.js';

const app = express();
const isDev = process.env.NODE_ENV === 'development';
app.use(express.json());
app.use(express.static('dist/client', { index: false }));

const PORT = isDev ? 3333 : 3334;

console.log({ isDev });

app.use('/api', apiRouter);
app.get('*all', isDev ? devRouter : prodRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  console.log('next', next.name);
  res.status(500).send('Something broken!!!');
});

app.listen(PORT, () => {
  console.log('Listen at http://localhost:' + PORT);
});
