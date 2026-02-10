import { canUseDOM } from '@personal/shared';
import { createConsola, LogLevels } from 'consola';

function processLevel() {
  const defaultLevel = import.meta.env.PROD ? LogLevels.warn : LogLevels.debug;
  if (canUseDOM()) {
    const searchParams = new URLSearchParams(location.search);
    const logLevel = searchParams.get('logLevel');
    const res = +(logLevel || '');
    return Number.isNaN(res) || res <= 0 ? defaultLevel : res;
  }
  return defaultLevel;
}

export const logger = createConsola({
  level: processLevel(),
});
