import { type RouterOptions } from 'vue-router';

import AppContainer from '../pages/app-container/index.vue';
import HomePage from '../pages/home/index.vue';
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
        meta: {
          prefetch: 'home',
        },
      },
      {
        name: 'projects',
        path: 'projects',
        component: () => import('../pages/projects/index.vue'),
        meta: {
          prefetch: 'projects',
        },
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
