import { randomInt } from 'es-toolkit/math';
import { simpleFaker } from '@faker-js/faker';

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

export const ContactWays = [
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

export const Projects = [
  {
    name: '最强陆战车',
    description:
      '这个漂浮球非常有意思，表面的光滑刚好不会阻挡爬坡（只要建的好），浮力应该是海拉鲁最强的了。',
    coverPic: 'project-car.jpg',
    link: 'https://www.bilibili.com/video/BV1zh4y1o7PF',
    startTime: simpleFaker.date.past(),
    endTime: simpleFaker.date.recent(),
  },
  {
    name: '不倒翁轰炸机',
    description:
      '通过将机体最大程度地向后倾倒，用机体把装在不倒翁上的炸弹推出并分离，就能进行轰炸啦！',
    coverPic: 'project-bdw.jpg',
    link: 'https://www.bilibili.com/video/BV1r63szHEsV',
    startTime: simpleFaker.date.past(),
    endTime: simpleFaker.date.recent(),
  },
  {
    name: '农用收割机',
    coverPic: 'project-harvester.jpg',
    link: 'https://www.bilibili.com/video/BV1Wa4y1u76q',
    startTime: simpleFaker.date.past(),
    endTime: simpleFaker.date.recent(),
    description: '海拉鲁农业不发达，必须要有收割机',
  },
  {
    name: '鬼火摩托',
    coverPic: 'project-motorcycle.jpg',
    link: 'https://www.bilibili.com/video/BV15c411M7fh',
    startTime: simpleFaker.date.past(),
    endTime: simpleFaker.date.recent(),
    description: '初代野炊摩托车',
  },
  {
    name: '巨神兵',
    coverPic: 'project-colossus.jpg',
    link: 'https://www.bilibili.com/video/BV15V4y1U7De',
    startTime: simpleFaker.date.past(),
    endTime: simpleFaker.date.recent(),
    description: '从此告别手动耍人马',
  },
  {
    name: '刑部尚书',
    coverPic: 'project-torture.png',
    link: 'https://www.bilibili.com/video/BV1iS411w7ce',
    startTime: simpleFaker.date.past(),
    endTime: simpleFaker.date.recent(),
    description: '老流氓刑拘',
  },
  {
    name: '老爷车',
    coverPic: 'project-vintage-car.jpg',
    link: 'https://www.bilibili.com/video/BV1o24y1K73J',
    startTime: simpleFaker.date.past(),
    endTime: simpleFaker.date.recent(),
    description: '海拉鲁科学界革命性成果',
  },
  {
    name: '激光坦克',
    coverPic: 'project-tank.jpg',
    link: 'https://www.bilibili.com/video/BV1VtWrzUECZ',
    startTime: simpleFaker.date.past(),
    endTime: simpleFaker.date.recent(),
    description: '陆地真理，又肉又有虚区',
  },
  {
    name: '一体式火箭',
    coverPic: 'project-rocket.jpg',
    link: 'https://www.bilibili.com/video/BV173bAeNEjR',
    startTime: simpleFaker.date.past(),
    endTime: simpleFaker.date.recent(),
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

export function getDefaultValue() {
  return {
    stacks: getStackOptions(),
    hobbys: HobbyOptions,
    contactWays: ContactWays,
    projects: Projects,
    sceneries: Sceneries,
    friends: Friends,
    intro: `我是海拉鲁大地的守护者。平时总被人叫作“勇者”，其实我只是个热爱探索的普通少年，喜欢攀爬峭壁、收集各种稀奇古怪的材料。我的背包里总是装满弓箭、盾牌和从怪物营地“借”来的武器——没办法，它们总是不太友好。
      作为海拉鲁的旅行者，我经历过两次重大的冒险：一次是从百年沉睡中醒来，拯救了被灾厄盖侬侵蚀的世界；另一次是在探索地下时突然被传送到浮空岛，追寻着神秘的手臂和古老的传说。我不太爱说话——人们总说我是沉默的勇者，但我更习惯用行动表达：用希卡之石解谜，用大师剑斩除邪恶，用滑翔帆掠过湖泊与山谷。
      每当夕阳将海拉鲁城堡染成金色，我总会想起公主的嘱托。我不是天生的英雄，只是愿意为了保护重要的事物而握紧剑柄。如果你在海拉鲁遇见一个戴着绿色帽子、奔跑时会被石头绊倒的青年，那大概就是我了——一个仍在学习如何拯救世界，却总被烹饪和捉虫子分心的勇者。要一起爬山吗？我带了很多精力药水。`,
  };
}

export function randomPick(arr) {
  const max = arr.length;
  const min = 0;
  const num = randomInt(min, max);
  return arr[num];
}

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
