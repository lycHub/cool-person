import { addCollection } from '@iconify/vue';
import { createHead } from '@unhead/vue/client';
import iconData from '@personal/icons/icon-data.json';
import 'dayjs/locale/zh-cn';
import 'animate.css';

import router from './router/client';
import { createApp } from './main';
import { getInitHead } from './utils/head';
import './styles/index.scss';

addCollection(iconData);

const { app, pinia } = createApp();
const head = createHead({
  init: getInitHead(),
});
app.use(router).use(pinia).use(head);

router.isReady().then(() => {
  app.mount('#root');
});
