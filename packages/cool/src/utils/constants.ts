import { randomPick } from '@personal/shared';
import { randomInt } from 'es-toolkit/math';

import type { ContactWay, MenuItem, ProjectInfo } from '../typings/data';

export const StorageKeys = {
  theme: 'theme',
  auth: 'authData',
  redirectUrl: 'redirectUrl',
};

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

const Stacks = [
  'TypeScript',
  'React',
  'Vue',
  'Angular',
  'Svg',
  'Node.js',
  'Gsap',
  'Vite',
  'Webpack',
  'Rspack',
  'Babel',
  'Sass',
  'Jest',
  'Vitest',
  'Supabase',
  'Tanstack',
  'Biome',
  'Eslint',
  'Pnpm',
];

const ColorSys = ['red', 'yellow', 'green', 'orange', 'purple', 'cyan'];

export function getStackOptions() {
  return Stacks.map((item) => {
    const colorSet = randomPick(ColorSys);
    const num = randomInt(1, 9);
    const color = `var(--prc-${colorSet}-${num})`;
    return {
      label: item,
      rippleColor: color,
    };
  });
}

export const HobbyOptions = [
  {
    name: 'program',
    angle: 50,
  },
  {
    name: 'dog',
    angle: 20,
  },
  {
    name: 'fried-chicken',
    angle: 0,
  },
  {
    name: 'game',
    angle: -20,
  },
  {
    name: 'learn',
    angle: -50,
  },
  // left
  {
    name: 'animate',
    angle: -110,
  },
  {
    name: 'music',
    angle: -140,
  },
  {
    name: 'record-video',
    angle: -180,
  },
  {
    name: 'sleep',
    angle: -200,
  },
  {
    name: 'tv',
    angle: -230,
  },
];
export const ThemeToggleDuration = 300;
export const ContactWays: ContactWay[] = [
  {
    key: 'bilibili',
    name: 'bilibili',
    link: 'https://space.bilibili.com/142925973?spm_id_from=666.25.0.0',
    icon: 'bilibili',
  },
  {
    key: 'github',
    name: 'github',
    link: 'https://github.com/lycHub',
    icon: 'github',
  },
  {
    key: 'npm',
    name: 'npm',
    link: 'https://www.npmjs.com/~madao2019',
    icon: 'npm',
  },
  {
    key: 'email',
    name: '邮箱',
    link: 'mailto:1120805364@qq.com',
    icon: 'email',
  },
  {
    key: 'phone',
    name: '电话',
    link: 'tel:15079010174',
    icon: 'phone',
  },
  {
    key: 'blog',
    name: '博客',
    link: 'https://segmentfault.com/blog/madao',
    icon: 'blog',
  },
];

/* 
startTime: simpleFaker.date.past(),
    endTime: simpleFaker.date.recent(),
*/
export const Projects: ProjectInfo[] = [
  {
    name: '最强陆战车',
    description:
      '这个漂浮球非常有意思，表面的光滑刚好不会阻挡爬坡（只要建的好），浮力应该是海拉鲁最强的了。',
    coverPic: 'project-car.jpg',
    link: 'https://www.bilibili.com/video/BV1zh4y1o7PF',
    startTime: new Date('2025-02-28'),
    endTime: new Date('2026-02-1'),
  },
  {
    name: '不倒翁轰炸机',
    description:
      '通过将机体最大程度地向后倾倒，用机体把装在不倒翁上的炸弹推出并分离，就能进行轰炸啦！',
    coverPic: 'project-bdw.jpg',
    link: 'https://www.bilibili.com/video/BV1r63szHEsV',
    startTime: new Date('2025-12-04'),
    endTime: new Date('2026-02-11'),
  },
  {
    name: '农用收割机',
    coverPic: 'project-harvester.jpg',
    link: 'https://www.bilibili.com/video/BV1Wa4y1u76q',
    startTime: new Date('2025-12-04'),
    endTime: new Date('2026-02-11'),
    description: '海拉鲁农业不发达，必须要有收割机',
  },
  {
    name: '鬼火摩托',
    coverPic: 'project-motorcycle.jpg',
    link: 'https://www.bilibili.com/video/BV15c411M7fh',
    startTime: new Date('2025-12-04'),
    endTime: new Date('2026-02-11'),
    description: '初代野炊摩托车',
  },
  {
    name: '巨神兵',
    coverPic: 'project-colossus.jpg',
    link: 'https://www.bilibili.com/video/BV15V4y1U7De',
    startTime: new Date('2025-12-04'),
    endTime: new Date('2026-02-11'),
    description: '从此告别手动耍人马',
  },
  {
    name: '刑部尚书',
    coverPic: 'project-torture.png',
    link: 'https://www.bilibili.com/video/BV1iS411w7ce',
    startTime: new Date('2025-12-04'),
    endTime: new Date('2026-02-11'),
    description: '老流氓刑拘',
  },
  {
    name: '老爷车',
    coverPic: 'project-vintage-car.jpg',
    link: 'https://www.bilibili.com/video/BV1o24y1K73J',
    startTime: new Date('2025-12-04'),
    endTime: new Date('2026-02-11'),
    description: '海拉鲁科学界革命性成果',
  },
  {
    name: '激光坦克',
    coverPic: 'project-tank.jpg',
    link: 'https://www.bilibili.com/video/BV1VtWrzUECZ',
    startTime: new Date('2025-12-04'),
    endTime: new Date('2026-02-11'),
    description: '陆地真理，又肉又有虚区',
  },
  {
    name: '一体式火箭',
    coverPic: 'project-rocket.jpg',
    link: 'https://www.bilibili.com/video/BV173bAeNEjR',
    startTime: new Date('2025-12-04'),
    endTime: new Date('2026-02-11'),
    description: '火箭界的天花板',
  },
];

export const Sceneries = [
  'scenery-1.webp',
  'scenery-2.webp',
  'scenery-3.jpg',
  'scenery-4.jpg',
  'scenery-5.jpg',
  'scenery-6.jpg',
  'scenery-7.webp',
  'scenery-8.jpg',
  'scenery-9.jpg',
];

export const Friends = [
  'friend-1.webp',
  'friend-2.jpg',
  'friend-3.webp',
  'friend-4.webp',
  'friend-5.jpg',
];
