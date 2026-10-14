import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MarketplaceLanding from "../components/MarketplaceLanding";
import MarketplaceAuthModal from "../components/MarketplaceAuthModal";

const MARKETPLACE_SESSION_KEY = "marketplace1_auth_session_v1";

function readSession() {
  try {
    const raw = localStorage.getItem(MARKETPLACE_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch (_error) {
    return null;
  }
}

function writeSession(value) {
  try {
    localStorage.setItem(MARKETPLACE_SESSION_KEY, JSON.stringify(value));
  } catch (_error) {
    // ignore
  }
}

function clearSession() {
  try {
    localStorage.removeItem(MARKETPLACE_SESSION_KEY);
  } catch (_error) {
    // ignore
  }
}

function resolveMarketplaceRoot(pathname) {
  return pathname.startsWith("/marketplace1") ? "/marketplace1" : "/marketplace";
}

function resolveAuthView(pathname, rootPath) {
  const relative = pathname.slice(rootPath.length) || "";
  if (relative === "/login") return "login";
  if (relative === "/logout") return "logout";
  if (!relative.startsWith("/signup")) return null;

  const segment = relative.replace("/signup", "").replace(/^\//, "");
  if (!segment) return "use-platform";
  if (segment === "type-user") return "type-user";
  if (segment === "account") return "account";
  if (segment === "organization") return "organization";
  if (segment === "verify") return "verify";
  if (segment === "success") return "success";
  return "use-platform";
}

export default function MarketplacePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [authSession, setAuthSession] = useState(() => readSession());

  const rootPath = useMemo(
    () => resolveMarketplaceRoot(location.pathname),
    [location.pathname],
  );
  const authView = useMemo(
    () => resolveAuthView(location.pathname, rootPath),
    [location.pathname, rootPath],
  );

  useEffect(() => {
    if (authView !== "logout") return;
    clearSession();
    setAuthSession(null);
    navigate(rootPath, { replace: true });
  }, [authView, navigate, rootPath]);

  const navigateWithinMarketplace = (suffix = "") => {
    const normalizedSuffix = suffix.startsWith("/") ? suffix : `/${suffix}`;
    navigate(`${rootPath}${normalizedSuffix === "/" ? "" : normalizedSuffix}`);
  };

  const closeModal = () => navigate(rootPath, { replace: true });

  const handleLogin = (sessionPayload) => {
    const nextSession = {
      ...sessionPayload,
      isAuthenticated: true,
      updatedAt: new Date().toISOString(),
    };
    writeSession(nextSession);
    setAuthSession(nextSession);
    navigate(rootPath, { replace: true });
  };

  const handleSignupComplete = (sessionPayload) => {
    const nextSession = {
      ...sessionPayload,
      isAuthenticated: true,
      updatedAt: new Date().toISOString(),
    };
    writeSession(nextSession);
    setAuthSession(nextSession);
    navigate(rootPath, { replace: true });
  };

  return (
    <>
      <MarketplaceLanding
        rootPath={rootPath}
        authSession={authSession}
        onOpenLogin={() => navigateWithinMarketplace("/login")}
        onOpenSignup={() => navigateWithinMarketplace("/signup")}
        onLogout={() => navigateWithinMarketplace("/logout")}
      />
      <MarketplaceAuthModal
        open={Boolean(authView && authView !== "logout")}
        view={authView}
        onClose={closeModal}
        onNavigate={navigateWithinMarketplace}
        onLogin={handleLogin}
        onSignupComplete={handleSignupComplete}
      />
    </>
  );
}
