export function publicAssetsPrefix() {
  return import.meta.env.SSR
    ? import.meta.env.VITE_PUBLIC_PATH_SSR
    : import.meta.env.VITE_PUBLIC_PATH;
}
