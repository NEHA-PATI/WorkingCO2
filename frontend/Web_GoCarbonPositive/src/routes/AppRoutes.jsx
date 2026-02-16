import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import useAuth from "@contexts/AuthContext";
import BaseLayout from "@layouts/BaseLayout";
import UserLayout from "@layouts/UserLayout";
import OrgLayout from "@layouts/OrgLayout";
import AdminLayout from "@layouts/AdminLayout";
import { ORG_DEFAULT_TAB_ID, ORG_TAB_CONFIG } from "@config/orgTabConfig";
import ProtectedRoute from "@shared/components/ProtectedRoute";
import PrivacyPolicy from "@shared/components/Privacy";
import TermsAndConditions from "@shared/components/TermsAndConditions";

import Home from "@features/user/pages/Home";
import About from "@features/user/pages/about";
import Community from "@features/user/pages/community";
import Contact from "@features/user/pages/contact";
import CaseStudy from "@features/user/pages/CaseStudy";
import IndustrialSolutions from "@features/user/pages/Industrial";
import Faq from "@features/user/pages/FAQ";
import NotFoundAnimation from "@features/user/pages/NotFoundAnimation";
import UserDashboard from "@features/user/pages/userDashboard";
import UserProfile from "@features/user/components/UserProfile";

import Login from "@features/auth/pages/Login";
import Signup from "@features/auth/pages/Signup";
import ForgotPassword from "@features/auth/pages/ForgotPassword";
import ResetPassword from "@features/auth/pages/ResetPassword";
import JoinOrganisation from "@features/auth/pages/JoinOrganisation";
import OAuthSuccess from "@features/auth/pages/OAuthSuccess";

import Blog from "@features/blog/pages/blog";
import BlogDetailPage from "@features/blog/pages/blog-detail";
import Careers from "@features/careers/pages/Careers";

import MarketplacePage from "@features/marketplace/pages/MarketplacePage";
import ViewAssets from "@shared/pages/ViewAssets";
import WalletPage from "@shared/pages/wallet";
import Upload from "@shared/pages/upload";

import ArenaStandalonePage from "@features/arena/pages/arenaStandalone";
import ArenaRewardsPage from "@features/arena/pages/rewards";
import ArenaHistoryPage from "@features/arena/pages/history";
import ArenaLeaderboardPage from "@features/arena/pages/leaderboard";


import OrgDashboard, {
  ORG_DASHBOARD_TAB_COMPONENTS,
} from "@features/org/pages/OrgDashboard";
import OrgProfile from "@features/org/components/OrgProfile";

import AdminOverview from "@features/admin/pages/Overview";
import AdminUsers from "@features/admin/pages/User Management";
import AdminSupport from "@features/admin/pages/Support";
import AdminSecurity from "@features/admin/pages/Security";
import AdminConfiguration from "@features/admin/pages/Configuration";
import AdminAnalytics from "@features/admin/pages/Analytics";
import AdminCareerManagement from "@features/admin/pages/CareerManagement";
import AdminCaseStudyManagement from "@features/admin/pages/CaseStudyManagement";
import AdminReports from "@features/admin/pages/Reports";
import AdminAssetManagement from "@features/admin/pages/AssetManagement";
import AdminContestManagement from "@features/admin/pages/ContestManagement";
import AdminOrganizationManagement from "@features/admin/pages/OrganizationManagement";
import AdminOrgRequest from "@features/admin/pages/OrgRequest";
import AdminOrganizationList from "@features/admin/pages/OrganizationList";
import AdminProfile from "@features/admin/components/AdminProfile";

const RoleProfilePage = () => {
  const { role, authLoading } = useAuth();

  if (authLoading) return null;
  if (role === "organization") return <OrgProfile />;
  if (role === "admin") return <AdminProfile />;
  return <UserProfile />;
};

const getOrgTabElement = (tabId) => {
  const Component = ORG_DASHBOARD_TAB_COMPONENTS[tabId];
  return Component ? <Component /> : null;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/arena" element={<Navigate to="/arena-standalone" replace />} />
      <Route path="/arena-standalone" element={<ArenaStandalonePage />} />
      <Route path="/arena/rewards" element={<ArenaRewardsPage />} />
      <Route path="/arena/history" element={<ArenaHistoryPage />} />
      <Route path="/arena/leaderboard" element={<ArenaLeaderboardPage />} />

      <Route element={<BaseLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/join-organisation" element={<JoinOrganisation />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route path="/walletui" element={<WalletPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetailPage />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/community" element={<Community />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/case-studies" element={<CaseStudy />} />
        <Route path="/settings" element={<NotFoundAnimation />} />
        <Route path="/privacypolicy" element={<PrivacyPolicy />} />
        <Route path="/termsandconditions" element={<TermsAndConditions />} />
        <Route path="/industrial" element={<IndustrialSolutions />} />
        <Route path="/faq" element={<Faq />} />

        <Route
          path="/marketplace"
          element={
            <ProtectedRoute allowedRoles={["user", "organization", "admin"]}>
              <MarketplacePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute allowedRoles={["user", "organization", "admin"]}>
              <Upload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/view-assets"
          element={
            <ProtectedRoute allowedRoles={["user", "organization", "admin"]}>
              <ViewAssets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wallet"
          element={
            <ProtectedRoute allowedRoles={["user", "organization", "admin"]}>
              <WalletPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <RoleProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/*"
          element={
            <ProtectedRoute requiredRole="user">
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="" element={<Navigate to="dashboard" replace />} />
        </Route>

        <Route
          path="/org/*"
          element={
            <ProtectedRoute requiredRole="organization">
              <OrgLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<OrgDashboard />}>
            <Route index element={<Navigate to={ORG_DEFAULT_TAB_ID} replace />} />
            {ORG_TAB_CONFIG.map((tab) => (
              <Route
                key={tab.id}
                path={tab.path ?? tab.id}
                element={getOrgTabElement(tab.id)}
              />
            ))}
            <Route path="*" element={<Navigate to={ORG_DEFAULT_TAB_ID} replace />} />
          </Route>
          <Route path="profile" element={<OrgProfile />} />
          <Route path="" element={<Navigate to="dashboard" replace />} />
        </Route>

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<AdminOverview />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="support" element={<AdminSupport />} />
          <Route path="security" element={<AdminSecurity />} />
          <Route path="configuration" element={<AdminConfiguration />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="asset-management" element={<AdminAssetManagement />} />
          <Route
            path="organization-management"
            element={<AdminOrganizationManagement />}
          />
          <Route
            path="organization-management/org-request"
            element={<AdminOrgRequest />}
          />
          <Route
            path="organization-management/organization"
            element={<AdminOrganizationList />}
          />
          <Route path="career-management" element={<AdminCareerManagement />} />
          <Route
            path="case-study-management"
            element={<AdminCaseStudyManagement />}
          />
          <Route path="contest" element={<AdminContestManagement />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="" element={<Navigate to="overview" replace />} />
        </Route>

        <Route path="/adminDashboard" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/orgDashboard" element={<Navigate to="/org/dashboard" replace />} />
        <Route path="/userDashboard" element={<Navigate to="/user/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
