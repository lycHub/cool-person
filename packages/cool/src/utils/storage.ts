import { createStorage } from 'unstorage';
import localStorageDriver from 'unstorage/drivers/localstorage';

import type { SingleOrArray } from '@personal/shared';

export const StorageKeyPrefix = 'vue';

export const storage = createStorage({
  driver: localStorageDriver({ base: StorageKeyPrefix, windowKey: 'localStorage' }),
});

export async function toggleStorage<T extends object | string>(key: string, data?: T) {
  if (data) {
    const value = typeof data === 'string' ? data : JSON.stringify(data);
    await storage.setItem(key, value);
  } else {
    await storage.removeItem(key);
  }
}

export function removeStorages(keys: SingleOrArray<string>) {
  const props = Array.isArray(keys) ? keys : [keys];
  props.forEach((item) => storage.removeItem(item));
}
