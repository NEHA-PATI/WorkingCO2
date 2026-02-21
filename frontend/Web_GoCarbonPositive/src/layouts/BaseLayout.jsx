// frontend/User/src/layouts/BaseLayout.jsx

import { Outlet, useLocation } from "react-router-dom";
import Navbar from "@shared/components/Navbar";
import Footer from "@shared/components/Footer";
import Login from "@features/auth/pages/Login";
import Signup from "@features/auth/pages/Signup";
import { useModal } from "@contexts/ModalContext";

/**
 * Pages where footer should NOT be shown
 * Add paths here as needed
 */
const FOOTER_HIDDEN_PATHS = ["/settings", "/my-carbon-footprint"];

const FOOTER_HIDDEN_PREFIXES = ["/admin"];

export default function BaseLayout() {
  const location = useLocation();
  const { showLogin, showSignup, closeModals, switchToLogin, switchToSignup } =
    useModal();

  /**
   * Footer visibility logic
   * - Exact match
   * - Also supports nested paths later if needed
   */
  const hideFooter =
    FOOTER_HIDDEN_PATHS.includes(location.pathname) ||
    FOOTER_HIDDEN_PREFIXES.some((prefix) =>
      location.pathname.startsWith(prefix)
    );

  return (
    <div className="app-container">
      {/* Global Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Global Footer (conditionally rendered) */}
      {!hideFooter && <Footer />}

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
