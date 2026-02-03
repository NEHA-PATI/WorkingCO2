import {
  FaUsers,
  FaBlog,
  FaBriefcase,
  FaBookOpen,
  FaInfoCircle,
  FaEnvelope,
  FaUserPlus,
  FaSignOutAlt,
} from "react-icons/fa";
import { MdDashboard, MdUpload } from "react-icons/md";
import { GiWallet } from "react-icons/gi";

import { FaStore } from "react-icons/fa";
import { MdAnalytics, MdWorkspaces } from "react-icons/md";
import { FaIndustry } from "react-icons/fa";

/* ================= USER / ORG ================= */

export const USER_ORG_MENU = {
  guest: [
    { label: "Community", path: "/community", icon: FaUsers, color: "#28a745" },
    { label: "Blog", path: "/blog", icon: FaBlog, color: "#ff5722" },
    {
      label: "Case Studies",
      path: "/case-studies",
      icon: FaBookOpen,
      color: "#17a2b8",
    },
    { label: "Careers", path: "/careers", icon: FaBriefcase, color: "#6f42c1" },
    { label: "About Us", path: "/about", icon: FaInfoCircle, color: "#fd7e14" },
    {
      label: "Contact Us",
      path: "/contact",
      icon: FaEnvelope,
      color: "#20c997",
    },
    {
      label: "Industrial Solutions",
      path: "/industrial",
      icon: FaIndustry,
      color: "#0d6efd",
    },

    // { label: "Sign Up", path: "/signup", icon: FaUserPlus, color: "#ffc107" },
  ],

  user: [
    {
      label: "Dashboard",
      path: "/user/dashboard",
      icon: MdDashboard,
      color: "#2e7d32",
    },
    { label: "Add Asset", path: "/upload", icon: MdUpload, color: "#8e24aa" },
    { label: "Wallet", action: "/wallet", icon: GiWallet, color: "#f59e0b" },
    { label: "Community", path: "/community", icon: FaUsers, color: "#28a745" },
    { label: "Blog", path: "/blog", icon: FaBlog, color: "#ff5722" },
    {
      label: "Case Studies",
      path: "/case-studies",
      icon: FaBookOpen,
      color: "#17a2b8",
    },
    { label: "Careers", path: "/careers", icon: FaBriefcase, color: "#6f42c1" },
    { label: "About Us", path: "/about", icon: FaInfoCircle, color: "#fd7e14" },
    {
      label: "Contact Us",
      path: "/contact",
      icon: FaEnvelope,
      color: "#20c997",
    },
    { label: "Logout", action: "logout", icon: FaSignOutAlt, color: "#e53935" },
    {
      label: "Industrial Solutions",
      path: "/industrial",
      icon: FaIndustry,
      color: "#0d6efd",
    },
  ],

  organization: [
    {
      label: "Dashboard",
      path: "/org/dashboard",
      icon: MdDashboard,
      color: "#2e7d32",
    },
    {
      label: "Add Asset",
      path: "/add-asset",
      icon: MdUpload,
      color: "#8e24aa",
    },
    { label: "Wallet", action: "/wallet", icon: GiWallet, color: "#f59e0b" },
    { label: "Community", path: "/community", icon: FaUsers, color: "#28a745" },
    { label: "Blog", path: "/blog", icon: FaBlog, color: "#ff5722" },
    {
      label: "Case Studies",
      path: "/case-studies",
      icon: FaBookOpen,
      color: "#17a2b8",
    },
    // { label: "Careers", path: "/careers", icon: FaBriefcase, color: "#6f42c1" },
    { label: "About Us", path: "/about", icon: FaInfoCircle, color: "#fd7e14" },
    {
      label: "Contact Us",
      path: "/contact",
      icon: FaEnvelope,
      color: "#20c997",
    },
    { label: "Logout", action: "logout", icon: FaSignOutAlt, color: "#e53935" },
    {
      label: "Industrial Solutions",
      path: "/industrial",
      icon: FaIndustry,
      color: "#0d6efd",
    },
  ],
};

/* ================= ADMIN ================= */

export const ADMIN_MENU = [
  { label: "Dashboard", path: "/admin", icon: MdDashboard },
  { label: "Blog Management", path: "/blog-management", icon: FaBlog },
  {
    label: "Case Study Management",
    path: "/case-study-management",
    icon: FaBookOpen,
  },
  { label: "Analytics", path: "/analytics", icon: MdAnalytics },
  { label: "Asset Management", path: "/assets", icon: MdWorkspaces },
  { label: "Marketplace", path: "/marketplace", icon: FaStore },
  {
    label: "Community Management",
    path: "/community-management",
    icon: FaUsers,
  },
  { label: "Career Management", path: "/career-management", icon: FaBriefcase },
];
