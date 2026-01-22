import { Routes, Route, Navigate } from "react-router-dom";
import { ModalProvider } from "./contexts/ModalContext";
import BaseLayout from "./layouts/BaseLayout";
import UserLayout from "./layouts/UserLayout";
import OrgLayout from "./layouts/OrgLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import PrivacyPolicy from "./components/common/Privacy";
import TermsAndConditions from "./components/common/T&C";

// Public pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/about";
import Blog from "./pages/blog";
import Careers from "./pages/Careers";
import Community from "./pages/community";
import Contact from "./pages/contact";
import CaseStudy from "./pages/CaseStudy";

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
import Profile from "./pages/profile";
import Wallet from "./pages/wallet";
import Upload from "./components/upload";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import JoinOrganisation from "./pages/JoinOrganisation";
// import NotFoundAnimation from "./pages/NotFoundAnimation";

import OAuthSuccess from "./pages/OAuthSuccess";

import NotFoundAnimation from "./pages/NotFoundAnimation";


function App() {
  return (
    <ModalProvider>
      <Routes>
        <Route element={<BaseLayout />}>
          {/* ================= PUBLIC ROUTES ================= */}
          <Route path="/" element={<Home />} />
          {/* Login and Signup are handled by BaseLayout modals, not routes */}
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/signup" element={<Navigate to="/" replace />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/join-organisation" element={<JoinOrganisation />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />

          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/community" element={<Community />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/case-studies" element={<CaseStudy />} />
          <Route path="/settings" element={<NotFoundAnimation />} />
         <Route path="/privacypolicy" element={<PrivacyPolicy />} />
         <Route path="/termsandconditions" element={<TermsAndConditions/>} />



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
            <Route path="dashboard" element={<OrgDashboard />} />
            {/* Add nested dashboard tabs here later */}
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
