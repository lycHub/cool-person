import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export function getFilename(metaUrl) {
  return fileURLToPath(metaUrl);
}

export function getDirname(metaUrl) {
  return dirname(getFilename(metaUrl));
}
