import axios from 'axios';

export interface HttpConfigContext {
  notCheck: boolean;
}

const request = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
});

export { request };
