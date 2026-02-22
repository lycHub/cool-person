import type { MenuItem } from '../typings/data';

export const StorageKeys = {
  theme: 'theme',
  auth: 'authData',
  redirectUrl: 'redirectUrl',
};
export const ThemeToggleDuration = 300;
export const MenuItems: MenuItem[] = [
  {
    key: 'home',
    name: '首页',
    nameEn: 'home',
    link: '/',
  },
  {
    key: 'projects',
    name: '项目',
    nameEn: 'projects',
    link: '/projects',
  },
  {
    key: 'gallery',
    name: '画廊',
    nameEn: 'gallery',
    link: '/gallery',
  },
];
