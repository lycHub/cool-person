export type TypeWithUndefined<T> = T | undefined;
export type TypeWithNull<T> = T | null;
export type SingleOrArray<T> = T | T[];
export type StrOrNum = string | number;

export type Theme = 'dark' | 'light';
export type PointEventType = PointerEvent | MouseEvent | TouchEvent;
export interface ClientCoordinate {
  clientX: number;
  clientY: number;
}
export interface SelectOption<T = object> {
  value: string;
  label: string;
  children?: SelectOption<T>[];
  disabled?: boolean;
  data?: T;
}

export interface TreeOption<T = Record<string, unknown>> {
  key: string;
  title: string;
  children?: TreeOption<T>[];
  data?: T;
}

export type CopyKeys<T> = {
  [P in keyof T]: T[P];
};
export type PartialByKeys<T, K extends keyof T = keyof T> = CopyKeys<
  Partial<Pick<T, Extract<keyof T, K>>> & Omit<T, K>
>;

export type RequiredByKeys<T, K extends keyof T = keyof T> = CopyKeys<
  Omit<T, K> & {
    [P in K]-?: T[P];
  }
>;

export interface CommonPageListParams {
  pageNo: number;
  pageSize: number;
}

export interface CommonPageListResponse<T = unknown> {
  total: number;
  size: number;
  current: number;
  pages: number;
  records: T[];
}

export interface ServerCommonResponse<T = unknown> {
  code: number;
  msg: string;
  data?: T;
}

export interface ConfirmModalInfo {
  type: string;
  icon: string;
  title: string;
  describe: string;
}

export interface City {
  id: number;
  parentCode: number;
  code: number;
  name: string;
  areaCode: string;
  mergerName: string;
  children?: City[];
}

export interface Dict {
  category: string;
  dictKey: string;
  dictValue: string;
}

export interface CommonReason {
  reasonType: string;
  reason: string;
}

export interface CommonFlowItem {
  label: string;
  data: {
    user: string;
    time: string;
  }[];
}

export interface RowSpinMeta {
  key: string;
}

export interface RegionAddress {
  company: string;
  address: string;
  province: string;
  city: string;
  person: string;
  mobile: string;
}
