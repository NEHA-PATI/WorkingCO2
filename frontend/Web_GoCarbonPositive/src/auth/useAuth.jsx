import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

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

        const normalizedRole =
          parsedUser.role?.toLowerCase() ||
          parsedUser.role_name?.toLowerCase() ||
          null;

        setUser(parsedUser);
        setRole(normalizedRole);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setRole(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
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

    const normalizedRole =
      user.role?.toLowerCase() ||
      user.role_name?.toLowerCase() ||
      null;

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
