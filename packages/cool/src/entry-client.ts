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

// 完整 URL
// const currentUrl = window.location.pathname + window.location.search
// router.push(currentUrl)

router.isReady().then(() => {
  if (window.__PINIA_STATE__) {
    pinia.state.value = window.__PINIA_STATE__;
    delete window.__PINIA_STATE__;
  }
  app.mount('#root');
});
