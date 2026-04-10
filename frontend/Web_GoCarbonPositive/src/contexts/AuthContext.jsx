import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const normalizeAppRole = (user) => {
  const rawRole =
    user?.context ??
    user?.app_role ??
    user?.global_role ??
    user?.org_role ??
    user?.role ??
    user?.role_name ??
    user?.account_role_name ??
    "";
  const role = String(rawRole || "").trim().toLowerCase();

  if (role) {
    if (["admin", "platform_admin", "super_admin", "superadmin"].includes(role)) {
      return "admin";
    }

    if (
      role === "organization" ||
      role === "organisation" ||
      role === "org" ||
      role === "org_admin" ||
      role === "org_member" ||
      role.startsWith("org_")
    ) {
      return "organization";
    }

    if (role === "marketplace_only" || role === "user") {
      return "user";
    }
  }

  return null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // 🔁 Restore session
  useEffect(() => {
    try {
      const token = localStorage.getItem("authToken");
      const storedUser = localStorage.getItem("authUser");

      if (token && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const normalizedRole = normalizeAppRole(parsedUser);

        setUser(parsedUser);
        setRole(normalizedRole);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setRole(null);
        setIsAuthenticated(false);
      }
    } catch {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      setUser(null);
      setRole(null);
      setIsAuthenticated(false);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // ✅ NEW: OBJECT-BASED LOGIN (🔥 IMPORTANT)
  const login = ({ token, user }) => {
    if (!token || !user) {
      console.error("❌ Invalid login payload", { token, user });
      return;
    }

    localStorage.setItem("authToken", token);
    localStorage.setItem("authUser", JSON.stringify(user));
    const normalizedRole = normalizeAppRole(user);

    setUser(user);
    setRole(normalizedRole);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, role, isAuthenticated, authLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

export default useAuth;
