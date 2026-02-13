export const SSR_IGNORE_PATTERNS = [
  /\.(js|css|json|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|map|txt|xml)$/i,
  /^\/api\//,
  /^\/health$/,
  /^\/favicon\.ico$/,
  /^\/robots\.txt$/,
  /^\/sitemap\.xml$/,
];

export function shouldSkipSSR(url) {
  return SSR_IGNORE_PATTERNS.some(pattern => pattern.test(url));
}
