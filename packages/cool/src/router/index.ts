import { createRouter, createWebHistory, type RouterOptions } from 'vue-router';
import { sleep } from '@personal/shared';

import AppContainer from '../pages/app-container/index.vue';
import HomePage from '../pages/home/index.vue';
import { useLoadingStore } from '../store';

export const allRoutes: RouterOptions['routes'] = [
  {
    name: 'layout',
    path: '/',
    component: AppContainer,
    children: [
      {
        name: 'home',
        path: '',
        component: HomePage,
      },
      {
        name: 'projects',
        path: 'projects',
        component: () => import('../pages/projects/index.vue'),
      },
      {
        name: 'gallery',
        path: 'gallery',
        component: () => import('../pages/gallery/index.vue'),
      },
    ],
  },
];

export const DefaultRoute = allRoutes[0]!.children![0];

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
