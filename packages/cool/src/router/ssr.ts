import { createMemoryHistory, createRouter } from 'vue-router';

import { allRoutes } from './routes';

export function createRouterInstance() {
  const router = createRouter({
    history: createMemoryHistory(import.meta.env.VITE_PUBLIC_PATH),
    routes: allRoutes,
  });

  return router;
}
