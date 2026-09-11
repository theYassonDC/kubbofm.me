declare namespace NodeJS {
  interface ProcessEnv {
    VITE_BASE_URL: string;
    VITE_BASE_API_URL: string;
    VITE_defaultkekoimg: string;
    VITE_MAINTENANCE: boolean;
    VITE_WEBHBOOK: string;
  }
}