import axios from 'axios';

export interface HttpConfigContext {
  notCheck: boolean;
}

// 创建 axios 实例
const request = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
});

export { request };
