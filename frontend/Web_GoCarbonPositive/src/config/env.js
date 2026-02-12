const viteEnv = import.meta.env;

export const ENV = {
  API_URL: viteEnv.VITE_API_URL || "http://localhost:5002",
  AUTH_SERVICE_URL: viteEnv.VITE_AUTH_SERVICE_URL || "http://localhost:5002",
  ASSET_SERVICE_URL: viteEnv.VITE_ASSET_SERVICE_URL || "http://localhost:5000",
  ORG_ASSET_API_URL:
    viteEnv.VITE_ASSET_SERVICE_URL || "http://localhost:8080/api",
  ORG_SERVICE_URL: viteEnv.VITE_ORG_SERVICE_URL || "http://localhost:5003",
  NOTIFICATION_SERVICE_URL:
    viteEnv.VITE_NOTIFICATION_SERVICE_URL || "http://localhost:5001",
  CAREER_SERVICE_URL: viteEnv.VITE_CAREER_SERVICE_URL || "http://localhost:5006",
  BLOG_API_URL: viteEnv.VITE_BLOG_API_URL || "http://localhost:4000/api/blog",
  DEFAULT_USER_ID: viteEnv.VITE_DEFAULT_USER_ID,
};
