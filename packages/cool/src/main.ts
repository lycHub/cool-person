import { addCollection } from '@iconify/vue';
import iconData from '@personal/icons/icon-data.json';
import 'dayjs/locale/zh-cn';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import 'animate.css';

import App from './App.vue';
import router from './router';
import './styles/index.scss';

addCollection(iconData);
const app = createApp(App);
const pinia = createPinia();
app.use(router).use(pinia).mount('#root');
