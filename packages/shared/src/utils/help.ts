interface GetValidParams<T> {
  params: T;
  excludeKeys: string[];
}

export function isValidValue(value: unknown) {
  let result = false;
  if (value !== null && value !== undefined && value !== '') {
    if (Array.isArray(value)) {
      result = (value as unknown[]).length > 0;
    } else if (typeof value === 'object' && value !== null) {
      result = Object.keys(value).length > 0;
    } else {
      result = true;
    }
  }

  return result;
}

export function getValidSearchParams<T extends object>({ params, excludeKeys }: GetValidParams<T>) {
  const validParams: Partial<T> = {};

  (Object.entries(params) as [keyof T, T[keyof T]][]).forEach(([key, value]) => {
    if (isValidValue(value) && !excludeKeys.includes(key as string)) {
      validParams[key] = value;
    }
  });

  return validParams;
}

export function countValidParams<T extends object>(validParams: T) {
  return Object.keys(validParams).length;
}
