import { createMemoryHistory, createRouter } from 'vue-router';

import { allRoutes } from './routes';

const router = createRouter({
  history: createMemoryHistory(import.meta.env.VITE_PUBLIC_PATH),
  routes: allRoutes,
});

export default router;
