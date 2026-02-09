import { type TypeWithNull } from '@personal/shared';
import { createConsola, LogLevels } from 'consola';

const searchParams = new URLSearchParams(location.search);
const logLevel = searchParams.get('logLevel');

function processLevel(value: TypeWithNull<string>) {
  const res = +(value || '');
  const defaultLevel = import.meta.env.PROD ? LogLevels.warn : LogLevels.debug;
  return Number.isNaN(res) || res <= 0 ? defaultLevel : res;
}

export const logger = createConsola({
  level: processLevel(logLevel),
});
