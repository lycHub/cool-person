import { createRouter, createWebHistory } from 'vue-router';
import { sleep } from '@personal/shared';

import { useLoadingStore } from '../store';

import { allRoutes } from './routes';

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_PUBLIC_PATH),
  routes: allRoutes,
});

router.beforeEach(async () => {
  const loadingStore = useLoadingStore();
  if (loadingStore.state.initialed) {
    loadingStore.changeState({
      status: 'loading',
      trigger: 'router',
    });
    // 对应 --animate-duration: 1s;
    await sleep(1000);
  }
  return true;
});

export default router;
