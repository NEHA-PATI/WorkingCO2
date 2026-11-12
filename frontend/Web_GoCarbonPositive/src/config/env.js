const viteEnv = import.meta.env;

const isProduction = viteEnv.PROD;
const localService = (port) => `http://localhost:${port}`;
const hostedOrigin = "";

const serviceUrl = (serviceVariable, _pathVariable, port) =>
  viteEnv[serviceVariable] ||
  (isProduction ? hostedOrigin : localService(port));

const normalizeBlogApiUrl = (value) => {
  if (!value) return value;
  const trimmed = value.replace(/\/+$/, "");
  return trimmed.endsWith("/api/blog") ? trimmed : `${trimmed}/api/blog`;
};

export const ENV = {
  // Service URLs are origins. Route prefixes are kept separately so the
  // frontend can use localhost in development and same-origin proxy paths in
  // a hosted build without changing application code.
  API_URL: serviceUrl("VITE_API_URL", "VITE_AUTH_API", 5002),
  AUTH_SERVICE_URL: serviceUrl("VITE_AUTH_SERVICE_URL", "VITE_AUTH_API", 5002),
  AUTH_API_URL: viteEnv.VITE_AUTH_API || (isProduction ? "/api/v1/auth" : `${localService(5002)}/api/v1/auth`),
  ASSET_SERVICE_URL: serviceUrl("VITE_ASSET_SERVICE_URL", "VITE_ASSET_API", 5000),
  ORG_ASSET_API_URL:
    viteEnv.VITE_ORG_ASSET_API_URL || (isProduction ? "/api" : "http://localhost:8080/api"),
  ADMIN_API_URL: viteEnv.VITE_ADMIN_API || (isProduction ? "/api/v1" : "http://localhost:8080/api/v1"),
  ORG_SERVICE_URL: serviceUrl("VITE_ORG_SERVICE_URL", "VITE_ORG_API", 5003),
  NOTIFICATION_SERVICE_URL:
    serviceUrl("VITE_NOTIFICATION_SERVICE_URL", "VITE_NOTIFICATION_API", 5001),
  CONTACT_SERVICE_URL: serviceUrl("VITE_CONTACT_SERVICE_URL", "VITE_CONTACT_API", 5005),
  CAREER_SERVICE_URL: serviceUrl("VITE_CAREER_SERVICE_URL", "VITE_CAREER_API", 5006),
  BLOG_API_URL: normalizeBlogApiUrl(
    viteEnv.VITE_BLOG_API_URL ||
      (viteEnv.PROD ? hostedOrigin : localService(4000))
  ),
  REWARD_SERVICE_URL:
    serviceUrl("VITE_REWARD_SERVICE_URL", "VITE_REWARD_API", 5008),
  REWARD_API_ROOT: viteEnv.VITE_REWARD_API
    ? viteEnv.VITE_REWARD_API.replace(/\/rewards\/?$/, "")
    : (isProduction ? "/api/v1" : `${localService(5008)}/api/v1`),
  REWARD_API_URL: viteEnv.VITE_REWARD_API || (isProduction ? "/api/v1/rewards" : `${localService(5008)}/api/v1/rewards`),
  DEMO_API_URL: viteEnv.VITE_DEMO_API || (isProduction ? "/api/demo" : `${localService(5007)}/api/demo`),
  PROFILE_API_URL: viteEnv.VITE_PROFILE_API || (isProduction ? "/api" : `${localService(5009)}/api`),
  TICKET_API_URL: viteEnv.VITE_TICKET_API || (isProduction ? "/api/tickets" : `${localService(5004)}/api/tickets`),
  TICKET_SERVICE_URL: serviceUrl("VITE_TICKET_SERVICE_URL", "VITE_TICKET_API", 5004),
  DEFAULT_USER_ID: viteEnv.VITE_DEFAULT_USER_ID,
};
