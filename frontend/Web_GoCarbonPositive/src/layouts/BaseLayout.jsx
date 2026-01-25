// frontend/User/src/layouts/BaseLayout.jsx
// Also known as PublicLayout - wraps all public pages with Navbar + Footer

import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import { useModal } from "../contexts/ModalContext";

/**
 * BaseLayout (PublicLayout)
 *
 * Purpose:
 * - Single source of truth for Navbar + Footer
 * - Wraps all public and protected pages
 * - Manages Login/Signup modal state via ModalContext
 * - Prevents Navbar/Footer duplication
 *
 * Structure:
 * - Navbar (role-aware, JWT-driven, always visible)
 * - <Outlet /> (renders child routes)
 * - Footer (always visible)
 * - Login/Signup modals (controlled by ModalContext)
 */
export default function BaseLayout() {
  const { showLogin, showSignup, closeModals, switchToLogin, switchToSignup } = useModal();

  return (
    <div className="app-container">
      {/* Global Navbar - reads JWT, changes visibility only */}
      <Navbar />

      {/* Page Content - All routes render here */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Global Footer - always visible */}
      <Footer />

      {/* Global Login Modal */}
      {showLogin && (
        <Login
          onClose={closeModals}
          onSwitchToSignup={switchToSignup}
        />
      )}

      {/* Global Signup Modal */}
      {showSignup && (
        <Signup
          onClose={closeModals}
          onSwitchToLogin={switchToLogin}
        />
      )}
    </div>
  );
}
