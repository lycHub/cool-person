export function emptyFunc() {
  /* empty func */
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
