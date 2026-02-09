import { randomInt } from 'es-toolkit';

import type { SelectOption, StrOrNum, TreeOption, TypeWithNull } from '../typings';

export function findTarget<T extends object>(value?: StrOrNum, options?: SelectOption<T>[]) {
  // eslint-disable-next-line eqeqeq
  return (options || []).find((item) => item.value == value?.toString());
}

export function keyToLabel<T extends object>(value?: StrOrNum, options?: SelectOption<T>[]) {
  return findTarget(value, options)?.label || '';
}

export function keysToLabel<T extends object>(value?: string, options?: SelectOption<T>[]) {
  const keys = value?.split(',')?.filter(Boolean);
  if (keys?.length) {
    return keys
      .map((item) => keyToLabel(item, options))
      .filter(Boolean)
      .join(',');
  }
  return '';
}

export function findTree<T extends object>(
  key: TreeOption<T>['key'],
  tree: TreeOption<T>[],
): TypeWithNull<TreeOption<T>> {
  let res: TypeWithNull<TreeOption<T>> = null;
  const loop = (list: TreeOption<T>[]) => {
    for (const item of list) {
      if (item.key === key) {
        res = item;
        break;
      }
      if (item.children?.length) {
        loop(item.children);
      }
    }
  };
  loop(tree);
  return res;
}

interface FilterOptionsParams<T> {
  validKeys: string[];
  options: SelectOption<T>[];
  disabled?: boolean;
}

export function filterOptions<T>({ options, validKeys, disabled = false }: FilterOptionsParams<T>) {
  const validOpts = options || [];
  return disabled
    ? validOpts.map((item) => ({
        ...item,
        disabled: !validKeys.includes(item.value),
      }))
    : validOpts.filter((item) => validKeys.includes(item.value));
}

export function randomPick<T>(arr: T[]): T {
  const max = arr.length;
  const min = 0;
  const num = randomInt(min, max);
  return arr[num] as T;
}

export function numberSort({ values, rule = 'asc' }: { values: number[]; rule?: 'asc' | 'desc' }) {
  return values.sort((a, b) => (rule === 'desc' ? b - a : a - b));
}
