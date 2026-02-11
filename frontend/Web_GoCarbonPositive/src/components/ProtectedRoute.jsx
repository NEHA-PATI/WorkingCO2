import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../auth/useAuth.jsx";

/**
 * ProtectedRoute Component
 *
 * Features:
 * - JWT-based authentication check
 * - Role-based access control
 * - Account status validation (only active users)
 * - Automatic redirect to login if not authenticated
 * - Redirect to user's dashboard if wrong role
 *
 * Usage:
 * - <ProtectedRoute> - requires any authentication
 * - <ProtectedRoute requiredRole="user"> - requires specific role
 * - <ProtectedRoute allowedRoles={["user", "organization"]}> - requires one of the allowed roles
 */
const ProtectedRoute = ({
  children,
  requiredRole = null,
  allowedRoles = null,
}) => {
  const { isAuthenticated, role, user, authLoading } = useAuth();
  const location = useLocation();

  // 🔑 CRITICAL: Wait for auth to hydrate before checking authentication
  // This prevents the flash where ProtectedRoute redirects before useAuth finishes reading localStorage
  if (authLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        <div>
          <div className="spinner" style={{
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          Loading...
        </div>
      </div>
    );
  }

  // Helper function to get dashboard route based on role
  const getDashboardRoute = (userRole) => {
    switch (userRole?.toLowerCase()) {
      case "admin":
        return "/admin/dashboard";
      case "organization":
        return "/org/dashboard";
      case "user":
        return "/user/dashboard";
      default:
        return "/";
    }
  };

  // All protected routes require authentication
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Account must be active
  if (user?.status !== "active") {
    return <Navigate to="/" replace />;
  }

  // Check if specific role is required
  if (requiredRole && role !== requiredRole.toLowerCase()) {
    const dashboardRoute = getDashboardRoute(role);
    return <Navigate to={dashboardRoute} replace />;
  }

  // Check if role is in allowed roles list
  if (
    allowedRoles &&
    !allowedRoles.map((r) => r.toLowerCase()).includes(role)
  ) {
    const dashboardRoute = getDashboardRoute(role);
    return <Navigate to={dashboardRoute} replace />;
  }

  // All checks passed, render children
  return children;
};

export default ProtectedRoute;
