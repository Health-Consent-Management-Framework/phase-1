/// <reference types="vite/client" />

interface Window {
    ethereum: any;
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_DEV_MODE: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}