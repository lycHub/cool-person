let devRouter;
let prodRouter;

if (process.env.NODE_ENV === 'development') {
  const dev = await import('./dev-ssr.js');
  await dev.run();
  devRouter = dev.router;
} else {
  const prod = await import('./prod-ssr.js');
  await prod.run();
  prodRouter = prod.router;
}

export { devRouter, prodRouter };
export { router as apiRouter } from "./apis/index.js";
