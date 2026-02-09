import { type MaybeRefOrGetter, unref, type MaybeRef } from 'vue';

import type { MaybeComputedElementRef, MaybeElement } from '@vueuse/core';

type Params<T = MaybeElement> =
  | MaybeComputedElementRef
  | MaybeRefOrGetter<T[]>
  | MaybeComputedElementRef[];

export function unRefNodes<T = MaybeElement>(event: Params<T>) {
  const nodes: HTMLElement[] = [];
  if (Array.isArray(event)) {
    event.forEach((item) => {
      const node = unref(item) as HTMLElement;
      if (node) {
        nodes.push(node);
      }
    });
  } else {
    const node = unref(event as MaybeRef<HTMLElement>);
    if (node) {
      nodes.push(node);
    }
  }
  return nodes;
}
