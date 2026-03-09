import express from 'express';
import { getDefaultValue } from '../../utils/constants.js';

const router = express.Router({ caseSensitive: true });

router.get(`/page-data`, (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(getDefaultValue());
});

export { router };
