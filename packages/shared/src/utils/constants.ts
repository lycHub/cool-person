import { formatDate } from './dateTime';

import type { CommonPageListParams, SelectOption, Theme } from '../typings';

export const ThemeValue: Record<Theme, Theme> = {
  dark: 'dark',
  light: 'light',
};

export const DebounceTime = {
  quick: 100,
  normal: 300,
  middle: 600,
  slow: 800,
};

export const DateFormatDashboard = 'YYYY.MM.DD';
export const DateFormat = 'YYYY-MM-DD';
export const DateMinuteFormat = 'YYYY-MM-DD HH:mm';
export const DateTimeFormat = 'YYYY-MM-DD HH:mm:ss';
export const EofDateFormat = 'YYYY-MM-DD A';

export const TableListX = '100%'; // 1200
export const MaxFileCount = 5;

export const BoolOptions: SelectOption[] = [
  {
    label: '是',
    value: '1',
  },
  {
    label: '否',
    value: '0',
  },
];

export const DefCommonListParams: CommonPageListParams = {
  pageNo: 1,
  pageSize: 20,
};

export const AXIOS_HEADER_AUTHNAME = 'X-Token';
export const STORAGE_AUTH = 'user-auth';
export const STORAGE_REDIRECT_URL = 'redirect-url';
export const STORAGE_SSO_CONFIG = 'sso-config';
export const LANGS = {
  en: 'en',
  zh: 'zh',
};

export const AUTH_CODE = {
  loginFail: 'login fail',
  parseFail: 'parse auth fail',
  noLogin: 'no login',
  valid: 'valid',
};

export const PASSWORD_LENGTH = 8;

export const UserTypes = ['innerUser', 'extraUser'];
export const BoolLabels = ['no', 'yes'];
export const PermissionLevels = ['low', 'middle', 'high'];
export const IBaseLabels = ['iBaseDes', 'machineModel'];

export const CommonRemarkMaxLength = 600;

export const OtherOptionKey = '99';
export const LockStatusLabels = ['noLock', 'locked'];
export const DefaultDate = formatDate(new Date(), DateFormat);

export const EofTimeOptions = [
  {
    label: 'AM',
    value: 'AM',
  },
  {
    label: 'PM',
    value: 'PM',
  },
];
