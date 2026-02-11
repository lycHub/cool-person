import { addCollection } from '@iconify/vue';
import iconData from '@personal/icons/icon-data.json';
import 'dayjs/locale/zh-cn';
import 'animate.css';

import { createApp } from './main';
import './styles/index.scss';
import router from './router/client';

addCollection(iconData);

const { app, pinia } = createApp();
app.use(router).use(pinia);
router.isReady().then(() => {
  app.mount('#root');
});
