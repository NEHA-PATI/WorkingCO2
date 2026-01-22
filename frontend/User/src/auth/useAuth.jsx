import React, { createContext, useContext, useEffect, useState } from "react";

/**
 * AuthContext
 */
const AuthContext = createContext(null);

/**
 * AuthProvider
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  /**
   * 🔁 Hydrate auth state from localStorage on app load
   */
  useEffect(() => {
    const initAuth = () => {
      try {
        const token = localStorage.getItem("authToken");
        const rawUser = localStorage.getItem("authUser");

        if (token && rawUser && rawUser !== "undefined") {
          const parsedUser = JSON.parse(rawUser);

          const normalizedRole =
            parsedUser?.role?.toLowerCase() ||
            parsedUser?.role_name?.toLowerCase() ||
            null;

          setUser(parsedUser);
          setRole(normalizedRole);
          setIsAuthenticated(true);

          console.log("✅ Auth initialized:", {
            userId: parsedUser?.u_id,
            role: normalizedRole,
          });
        } else {
          clearAuth();
        }
      } catch (err) {
        console.error("❌ Auth init failed:", err);
        clearAuth();
      } finally {
        setAuthLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * 🔑 Login (used by Email + Google OAuth)
   */
  const login = ({ token, user }) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("authUser", JSON.stringify(user));

    const normalizedRole =
      user?.role?.toLowerCase() ||
      user?.role_name?.toLowerCase() ||
      null;

    setUser(user);
    setRole(normalizedRole);
    setIsAuthenticated(true);

    console.log("✅ User logged in:", {
      userId: user?.u_id,
      role: normalizedRole,
    });
  };

  /**
   * 🚪 Logout
   */
  const logout = () => {
    clearAuth();
    console.log("✅ User logged out");
  };

  /**
   * 🧹 Clear auth helper
   */
  const clearAuth = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        authLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth hook
 */
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export default useAuth;
