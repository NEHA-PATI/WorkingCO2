const viteEnv = import.meta.env;

const stripTrailingSlashes = (value) => (value ? value.replace(/\/+$/, "") : value);

const normalizeServiceUrl = (value, servicePath, fallback) => {
  const base = stripTrailingSlashes(value || fallback);
  if (base.endsWith(servicePath)) return base;

  const serviceName = servicePath.split("/").filter(Boolean).at(-1);
  if (base.endsWith("/api/v1")) return `${base}/${serviceName}`;
  if (base.endsWith("/api")) return `${base}/v1/${serviceName}`;

  return `${base}${servicePath}`;
};

const normalizeApiRootUrl = (value, fallback) => {
  const base = stripTrailingSlashes(value || fallback);
  if (base.endsWith("/api/v1/calculate")) {
    return base.slice(0, -"/v1/calculate".length);
  }
  if (base.endsWith("/api/v1")) {
    return base.slice(0, -"/v1".length);
  }
  if (base.endsWith("/api")) return base;
  return `${base}/api`;
};

const normalizeProfileApiUrl = (value, fallback) => {
  const base = stripTrailingSlashes(value || fallback);
  if (base.endsWith("/api/v1/profile")) {
    return base.slice(0, -"/profile".length);
  }
  if (base.endsWith("/api/v1")) return base;
  if (base.endsWith("/api")) return `${base}/v1`;
  return `${base}/api/v1`;
};

const normalizeApiV1Url = (value, fallback) => {
  const base = stripTrailingSlashes(value || fallback);
  if (base.endsWith("/api/v1")) return base;
  if (base.endsWith("/api")) return `${base}/v1`;
  return `${base}/api/v1`;
};

export const ENV = {
  API_URL: viteEnv.VITE_API_URL || "http://localhost:5002",
  AUTH_SERVICE_URL: normalizeServiceUrl(
    viteEnv.VITE_AUTH_SERVICE_URL ||
      viteEnv.VITE_AUTH_API,
    "/api/v1/auth",
    "http://localhost:5002",
  ),
  ASSET_SERVICE_URL: normalizeServiceUrl(
    viteEnv.VITE_ASSET_SERVICE_URL ||
      viteEnv.VITE_ASSET_API,
    "/api/v1",
    "http://localhost:5000",
  ),
  ORG_ASSET_API_URL:
    viteEnv.VITE_ASSET_SERVICE_URL ||
    viteEnv.VITE_ASSET_API ||
    "http://localhost:8080/api",
  ORG_SERVICE_URL: normalizeApiV1Url(
    viteEnv.VITE_ORG_SERVICE_URL ||
      viteEnv.VITE_ORG_API,
    "http://localhost:5003/api/v1",
  ),
  ADMIN_API_URL: normalizeApiV1Url(
    viteEnv.VITE_ADMIN_API_URL ||
      viteEnv.VITE_ADMIN_API,
    "http://localhost:8080/api/v1",
  ),
  NOTIFICATION_SERVICE_URL:
    viteEnv.VITE_NOTIFICATION_SERVICE_URL || "http://localhost:5001",
  CAREER_SERVICE_URL: viteEnv.VITE_CAREER_SERVICE_URL || "http://localhost:5006",
  BLOG_API_URL: normalizeServiceUrl(
    viteEnv.VITE_BLOG_API_URL ||
      viteEnv.VITE_BLOG_API,
    "/api/v1/blog",
    "http://localhost:4000/api/v1/blog",
  ),
  CONTACT_API_URL: normalizeServiceUrl(
    viteEnv.VITE_CONTACT_API_URL ||
      viteEnv.VITE_CONTACT_API,
    "/api/v1/contact",
    "http://localhost:5005/api/v1/contact",
  ),
  CARBON_API_URL: normalizeApiRootUrl(
    viteEnv.VITE_CFC_SERVICE_URL ||
      viteEnv.VITE_CFC_API,
    "http://localhost:8004/api",
  ),
  TICKET_API_URL: normalizeServiceUrl(
    viteEnv.VITE_TICKET_API_URL ||
      viteEnv.VITE_TICKET_API,
    "/api/v1/tickets",
    "http://localhost:5004/api/v1/tickets",
  ),
  DEMO_API_URL: normalizeServiceUrl(
    viteEnv.VITE_DEMO_API_URL ||
      viteEnv.VITE_DEMO_API,
    "/api/v1/demo",
    "http://localhost:5007/api/v1/demo",
  ),
  REWARD_SERVICE_URL: normalizeServiceUrl(
    viteEnv.VITE_REWARD_SERVICE_URL ||
      viteEnv.VITE_REWARD_API,
    "/api/v1/rewards",
    "http://localhost:5008/api/v1/rewards",
  ),
  PROFILE_API_URL: normalizeProfileApiUrl(
    viteEnv.VITE_PROFILE_API_URL ||
      viteEnv.VITE_PROFILE_API,
    "http://localhost:5009/api/v1",
  ),
  QUIZ_API_URL: normalizeServiceUrl(
    viteEnv.VITE_QUIZ_API_URL ||
      viteEnv.VITE_QUIZ_API ||
      (viteEnv.VITE_REWARD_SERVICE_URL || viteEnv.VITE_REWARD_API || "")
        .replace(/\/+$/, "")
        .replace(/\/rewards$/, "/quiz"),
    "/api/v1/quiz",
    "http://localhost:5008/api/v1/quiz",
  ),
  DEFAULT_USER_ID: viteEnv.VITE_DEFAULT_USER_ID,
};
