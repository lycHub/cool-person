export function publicAssetsPrefix() {
  return import.meta.env.PROD ? import.meta.env.VITE_PUBLIC_PATH : '';
}
