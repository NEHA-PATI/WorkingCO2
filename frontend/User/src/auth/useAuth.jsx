import React, { createContext, useContext, useEffect, useState } from "react";

/**
 * AuthContext - Provides authentication state across the app
 * Prevents race conditions by managing loading state properly
 */
const AuthContext = createContext(null);

/**
 * AuthProvider Component
 * Wraps the app to provide auth state to all components
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true); // 🔑 Start as loading

  // Hydrate auth state from localStorage on mount
  useEffect(() => {
    const initAuth = () => {
      try {
        const token = localStorage.getItem("authToken");
        const storedUser = localStorage.getItem("authUser");

        if (token && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          
          // Extract role (support both role and role_name fields)
          const normalizedRole =
            parsedUser.role?.toLowerCase() ||
            parsedUser.role_name?.toLowerCase() ||
            null;

          setUser(parsedUser);
          setRole(normalizedRole);
          setIsAuthenticated(true);
          
          console.log("✅ Auth initialized:", { role: normalizedRole, userId: parsedUser.u_id });
        } else {
          setUser(null);
          setRole(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("❌ Auth init failed:", err);
        // Clear corrupted data
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
        setUser(null);
        setRole(null);
        setIsAuthenticated(false);
      } finally {
        // 🔑 CRITICAL: Always set loading to false after init
        setAuthLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function - updates state and localStorage
  const login = (token, userData) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("authUser", JSON.stringify(userData));
    
    const normalizedRole =
      userData.role?.toLowerCase() ||
      userData.role_name?.toLowerCase() ||
      null;

    setUser(userData);
    setRole(normalizedRole);
    setIsAuthenticated(true);
    
    console.log("✅ User logged in:", { role: normalizedRole, userId: userData.u_id });
  };

  // Logout function - clears state and localStorage
  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
    
    console.log("✅ User logged out");
  };

  const value = {
    user,
    role,
    isAuthenticated,
    authLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * useAuth Hook
 * Access auth state from any component
 * Must be used within AuthProvider
 */
const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  
  return context;
};

export default useAuth;
