// import React, { useState, useEffect } from "react";
// import { Routes, Route, useLocation } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "./App.css";
// import Home from "./pages/Home";
// import UserDashboard from "./components/userDashboard";
// // import OrgDashboard from '../../OrgDashboard/src/pages/OrgDashboard'
// // import AddAsset from './components/AddAsset';
// import AdminDashboard from "../../Admin/src/pages/AdminDashboard";
// import Upload from "./components/upload";
// import Blog from "./pages/blog";
// import Engage from "./pages/engage";
// import Wallet from "./pages/wallet";
// import Profile from "./pages/profile";
// import Games from "./pages/game";
// import About from "./pages/about";
// import Community from "./pages/community";
// import UserNavbar from "./components/userNavbar";
// import ViewAssets from "./pages/ViewAssets";
// import Contact from "./pages/contact";
// import Navbar from "./components/Navbar";
// // import AddAsset from '../../OrgDashboard/frontend/src/components/AddAsset';
// import EcoVoyageGame from "./game/EcoShooter/EcoVoyage/EcoVoyageGame";
// import Ecoshooter from "./game/EcoShooter/Bubble";
// import Memorygame from "./game/MemoryGame/Memory";
// import Activities from "./pages/activities";
// import ActivityDetail from "./pages/Careers";
// import Careers from "./pages/Careers";
// import CaseStudy from "./pages/CaseStudy";
// import LoginPopup from "./pages/Login";
// import SignupPopup from "./pages/Signup";

// const App = () => {
//   const location = useLocation();

//   const RedirectToOrg = () => {
//     useEffect(() => {
//       window.location.href = "https://frontend-org.onrender.com";
//     }, []);
//     return <p>Redirecting to Organization Dashboard...</p>;
//   };

//   const RedirectToAdmin = () => {
//     useEffect(() => {
//       window.location.href = "http://localhost:3001";
//     }, []);
//     return <p>Redirecting to Admin Dashboard...</p>;
//   };

//   // Initial auth state based on token in localStorage
//   const [isAuthenticated, setIsAuthenticated] = useState(
//     !!localStorage.getItem("token")
//   );
//   const [user, setUser] = useState(null);
//   const [showLogin, setShowLogin] = useState(false);
//   const [showSignup, setShowSignup] = useState(false);

//   // Listen for storage events (e.g. login/logout in other tabs)
//   useEffect(() => {
//     const handleStorageChange = () => {
//       setIsAuthenticated(!!localStorage.getItem("token"));
//     };
//     window.addEventListener("storage", handleStorageChange);
//     return () => window.removeEventListener("storage", handleStorageChange);
//   }, []);

//   // Update auth state immediately after login/signup
//   const handleAuthChange = (token, userData = null) => {
//     if (token) {
//       localStorage.setItem("token", token);
//       setIsAuthenticated(true);
//       if (userData) setUser(userData);
//     } else {
//       localStorage.removeItem("token");
//       setIsAuthenticated(false);
//       setUser(null);
//     }
//   };

//   // Re-check auth on every route change
//   useEffect(() => {
//     setIsAuthenticated(!!localStorage.getItem("token"));
//   }, [location.pathname]);

//   // Decide when to hide Navbar
//   const shouldHideNavbar = () => {
//     const hideNavbarRoutes = ["/userDashboard", "/orgDashboard", "/admin"];
//     if (location.pathname.startsWith("/games")) return true;
//     return hideNavbarRoutes.includes(location.pathname);
//   };

//   return (
//     <>
//       <ToastContainer />

//       {/* Navbar logic */}
//       {!shouldHideNavbar() &&
//         (isAuthenticated ? (
//           <UserNavbar onAuthChange={handleAuthChange} />
//         ) : (
//           <Navbar
//             isAuthenticated={isAuthenticated}
//             user={user}
//             showAuth={showLogin || showSignup}
//             openLoginPopup={() => setShowLogin(true)}
//             openSignupPopup={() => setShowSignup(true)}
//           />
//         ))}

//       {/* ✅ Show login/signup popup when state is true */}
//       {showLogin && (
//         <LoginPopup
//           onClose={() => setShowLogin(false)}
//           onLogin={(token, userData) => handleAuthChange(token, userData)}
//           onSwitchToSignup={() => {
//             setShowLogin(false);
//             setShowSignup(true);
//           }}
//         />
//       )}

//       {showSignup && (
//         <SignupPopup
//           onClose={() => setShowSignup(false)}
//           onSignup={(token, userData) => handleAuthChange(token, userData)}
//           onSwitchToLogin={() => {
//             setShowSignup(false);
//             setShowLogin(true);
//           }}
//         />
//       )}

//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/home" element={<Home />} />
//         <Route path="/game" element={<Games />} />
//         <Route path="/userDashboard" element={<UserDashboard />} />
//         <Route path="/orgDashboard" element={<RedirectToOrg />} />
//         <Route path="/adminDashboard" element={<RedirectToAdmin />} />
//         <Route path="/upload" element={<Upload />} />
//         <Route
//           path="/blog"
//           element={<Blog isAuthenticated={isAuthenticated} />}
//         />
//         <Route path="/engage" element={<Engage />} />
//         <Route path="/wallet" element={<Wallet />} />
//         <Route path="/profile" element={<Profile />} />
//         <Route path="/view-assets" element={<ViewAssets />} />
//         {/* <Route path="/add-asset" element={<AddAsset />} /> */}
//         <Route path="/community" element={<Community />} />
//         <Route path="/careers" element={<Careers />} />
//         <Route path="/case-studies" element={<CaseStudy />} />
//         <Route path="/contact" element={<Contact />} />
//         <Route path="/about" element={<About />} />
//         <Route path="/games/eco-voyage" element={<EcoVoyageGame />} />
//         <Route path="/games/eco-shooter" element={<Ecoshooter />} />
//         <Route path="/games/memory" element={<Memorygame />} />
//         <Route path="/activities" element={<Activities />} />
//         <Route path="/activity/:activityKey" element={<ActivityDetail />} />
//       </Routes>
//     </>
//   );
// };

// export default App;

import { Routes, Route, Navigate } from "react-router-dom";
import { ModalProvider } from "./contexts/ModalContext";
import BaseLayout from "./layouts/BaseLayout";
import UserLayout from "./layouts/UserLayout";
import OrgLayout from "./layouts/OrgLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

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
import Faq from "./pages/Faq";


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

          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/community" element={<Community />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/case-studies" element={<CaseStudy />} />
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