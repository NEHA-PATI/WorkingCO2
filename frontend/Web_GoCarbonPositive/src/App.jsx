import { Routes, Route, Navigate } from "react-router-dom";
import { ModalProvider } from "./contexts/ModalContext";
import BaseLayout from "./layouts/BaseLayout";
import UserLayout from "./layouts/UserLayout";
import OrgLayout from "./layouts/OrgLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import PrivacyPolicy from "./components/common/Privacy";
import TermsAndConditions from "./components/common/T&C";
import { ORG_DEFAULT_TAB_ID, ORG_TAB_CONFIG } from "./config/orgTabConfig";

// Public pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/about";
import Blog from "./pages/blog";
import BlogDetailPage from './pages/blog-detail';
import Careers from "./pages/Careers";
import Community from "./pages/community";
import Contact from "./pages/contact";
import CaseStudy from "./pages/CaseStudy";
import Faq from "./pages/Faq";
import IndustrialSolutions from "./pages/Industrial";

// Dashboard pages
import UserDashboard from "./pages/userDashboard";
import OrgDashboard from "./pages/OrgDashboard";
import AdminDashboard from "./pages/AdminDashboard";

// Admin pages
import AdminOverview from "./pages/admin/Overview";
import AdminUsers from "./pages/admin/Users";
import AdminSupport from "./pages/admin/Support";
import AdminSecurity from "./pages/admin/Security";
import AdminConfiguration from "./pages/admin/Configuration";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminCareerManagement from "./pages/admin/CareerManagement";
import AdminCaseStudyManagement from "./pages/admin/CaseStudyManagement";
import AdminReports from "./pages/admin/Reports";

// Protected routes (in public layout)
import ViewAssets from "./pages/ViewAssets";
import Profile from "./components/common/Profile";
import Wallet from "./pages/wallet";
import Upload from "./components/upload";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import JoinOrganisation from "./pages/JoinOrganisation";

import OAuthSuccess from "./pages/OAuthSuccess";
import Arena from "./Arena/Arena";
import ArenaStandalone from "./Arena/arenaStandalone";

import NotFoundAnimation from "./pages/NotFoundAnimation";

function App() {
  return (
    <ModalProvider>
      <Routes>
        <Route path="/arena" element={<Arena />} />
        <Route path="/arena-standalone" element={<ArenaStandalone />} />
        <Route element={<BaseLayout />}>
          {/* ================= PUBLIC ROUTES ================= */}
          <Route path="/" element={<Home />} />
          {/* Login and Signup are handled by BaseLayout modals, not routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/join-organisation" element={<JoinOrganisation />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />

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
          <Route path="/industrial" element={< IndustrialSolutions />} />


          <Route path="/faq" element={<Faq />} />

          {/* <Route path="/settings" element={<NotFoundAnimation />} /> */}

          {/* ================= PROTECTED ROUTES (PUBLIC LAYOUT) ================= */}
          {/* These routes are in BaseLayout but require authentication */}
          {/* They render differently based on role, but structure stays in public layout */}
          {/* Profile dropdown menu contents change based on auth/role (handled by Navbar) */}

          <Route
            path="/upload"
            element={
              <ProtectedRoute allowedRoles={["user", "organization"]}>
                <Upload />
              </ProtectedRoute>
            }
          />
          <Route path="/oauth-success" element={<OAuthSuccess />} />

          <Route
            path="/view-assets"
            element={
              <ProtectedRoute allowedRoles={["user", "organization"]}>
                <ViewAssets />
              </ProtectedRoute>
            }
          />

          <Route
            path="/wallet"
            element={
              <ProtectedRoute allowedRoles={["user", "organization"]}>
                <Wallet />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* ================= USER DASHBOARD ROUTES ================= */}
          <Route
            path="/user/*"
            element={
              <ProtectedRoute requiredRole="user">
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<UserDashboard />} />
            {/* Add nested dashboard tabs here later */}
            {/* Redirect /user to /user/dashboard */}
            <Route path="" element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* ================= ORGANIZATION DASHBOARD ROUTES ================= */}
          <Route
            path="/org/*"
            element={
              <ProtectedRoute requiredRole="organization">
                <OrgLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<OrgDashboard />}>
              <Route
                index
                element={<Navigate to={ORG_DEFAULT_TAB_ID} replace />}
              />
              {ORG_TAB_CONFIG.map((tab) => (
                <Route
                  key={tab.id}
                  path={tab.path ?? tab.id}
                  element={<tab.component />}
                />
              ))}
              <Route
                path="*"
                element={<Navigate to={ORG_DEFAULT_TAB_ID} replace />}
              />
            </Route>
            {/* Redirect /org to /org/dashboard */}
            <Route path="" element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* ================= ADMIN DASHBOARD ROUTES ================= */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route
              path="dashboard"
              element={<Navigate to="overview" replace />}
            />
            <Route path="overview" element={<AdminOverview />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="support" element={<AdminSupport />} />
            <Route path="security" element={<AdminSecurity />} />
            <Route path="configuration" element={<AdminConfiguration />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route
              path="career-management"
              element={<AdminCareerManagement />}
            />
            <Route
              path="case-study-management"
              element={<AdminCaseStudyManagement />}
            />
            <Route path="reports" element={<AdminReports />} />
            {/* Redirect /admin to /admin/overview */}
            <Route path="" element={<Navigate to="overview" replace />} />
          </Route>

          {/* ================= LEGACY ROUTE REDIRECTS ================= */}
          {/* Keep these for backward compatibility during migration */}
          <Route
            path="/userDashboard"
            element={<Navigate to="/user/dashboard" replace />}
          />
          <Route
            path="/orgDashboard"
            element={<Navigate to="/org/dashboard" replace />}
          />
          <Route
            path="/adminDashboard"
            element={<Navigate to="/admin/dashboard" replace />}
          />

          {/* ================= CATCH ALL ================= */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </ModalProvider>
  );
}

export default App;
