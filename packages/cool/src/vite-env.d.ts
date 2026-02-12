/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_APPNAME: string;
  VITE_SERVER_URL: string;
  VITE_PUBLIC_PATH: string;
  VITE_SITEURL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
