import {
  FaChartBar,
  FaCoins,
  FaShieldAlt,
  FaUsers,
  FaRocket,
  FaEye,
} from "react-icons/fa";

import Overview from "../components/org/Overview";
import AssetManagement from "../components/org/AssetManagement";
import CreditEarnings from "../components/org/CreditEarnings";
import ComplianceReports from "../components/org/ComplianceReports";
import TeamManagement from "../components/org/TeamManagement";
import QuickActions from "../components/org/QuickActions";

export const ORG_DASHBOARD_BASE = "/org/dashboard";

export const ORG_TAB_CONFIG = [
  {
    id: "overview",
    path: "overview",
    label: "Overview",
    icon: FaEye,
    component: Overview,
    accent: "#3b82f6",
  },
  {
    id: "assets",
    path: "assets",
    label: "Assets",
    icon: FaChartBar,
    component: AssetManagement,
    accent: "#10b981",
  },
  {
    id: "earnings",
    path: "earnings",
    label: "Earnings",
    icon: FaCoins,
    component: CreditEarnings,
    accent: "#f59e0b",
  },
  {
    id: "compliance",
    path: "compliance",
    label: "Compliance",
    icon: FaShieldAlt,
    component: ComplianceReports,
    accent: "#ef4444",
  },
  {
    id: "team",
    path: "team",
    label: "Team",
    icon: FaUsers,
    component: TeamManagement,
    accent: "#8b5cf6",
  },
  {
    id: "actions",
    path: "actions",
    label: "Quick Actions",
    icon: FaRocket,
    component: QuickActions,
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
