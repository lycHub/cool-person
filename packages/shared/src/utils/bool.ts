import { BoolOptions } from './constants';

import type { StrOrNum } from '../typings';

export function boolLabel(value: StrOrNum, options = BoolOptions) {
  return options.find((item) => item.value === (value || 0).toString())?.label || '';
}
