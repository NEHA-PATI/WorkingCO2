export const ORG_DASHBOARD_BASE = "/org/dashboard";

export const ORG_TAB_CONFIG = [
  {
    id: "overview",
    path: "overview",
    label: "Overview",
    iconKey: "overview",
    accent: "#3b82f6",
  },
  {
    id: "assets",
    path: "assets",
    label: "Assets",
    iconKey: "assets",
    accent: "#10b981",
  },
  {
    id: "earnings",
    path: "earnings",
    label: "Earnings",
    iconKey: "earnings",
    accent: "#f59e0b",
  },
  {
    id: "compliance",
    path: "compliance",
    label: "Compliance",
    iconKey: "compliance",
    accent: "#ef4444",
  },
  {
    id: "team",
    path: "team",
    label: "Team",
    iconKey: "team",
    accent: "#8b5cf6",
  },
  {
    id: "actions",
    path: "actions",
    label: "Quick Actions",
    iconKey: "actions",
    accent: "#06b6d4",
  },
];

export const ORG_DEFAULT_TAB_ID = ORG_TAB_CONFIG[0]?.id ?? "overview";

export const getOrgTabPath = (tabId) => {
  const tab = ORG_TAB_CONFIG.find((entry) => entry.id === tabId);
  const path = tab?.path ?? tabId;
  return `${ORG_DASHBOARD_BASE}/${path}`;
};

export const getOrgTabIdFromPath = (pathname) => {
  const match = pathname.match(/\/org\/dashboard\/([^/]+)/);
  if (!match) return null;

  const tabPath = match[1];
  const tab = ORG_TAB_CONFIG.find((entry) => entry.path === tabPath);
  return tab?.id ?? null;
};
