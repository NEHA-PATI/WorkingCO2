import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAuth from "@contexts/AuthContext";
import { fireToast } from "@shared/utils/toastService";

const normalizeAppRole = (user) => {
  const rawRole =
    user?.context ??
    user?.app_role ??
    user?.global_role ??
    user?.org_role ??
    user?.role ??
    user?.role_name ??
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

  return "user";
};

const OAuthSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { login, isAuthenticated, role: currentRole } = useAuth();

  const hasLoggedIn = useRef(false);

  useEffect(() => {
    if (hasLoggedIn.current) return;

    if (isAuthenticated) {
      navigate(
        currentRole === "admin"
          ? "/admin/dashboard"
          : currentRole === "organization"
            ? "/org/dashboard"
            : "/user/dashboard",
        { replace: true }
      );
      return;
    }

    const token = params.get("token");

    if (!token) {
      fireToast("OAUTH.NO_TOKEN", "error");
      navigate("/", { replace: true });
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      const user = {
        id: payload.id,
        u_id: payload.u_id,
        email: payload.email,
        status: payload.status,
        role: payload.role,
        context: payload.context || normalizeAppRole(payload),
        app_role: payload.app_role || normalizeAppRole(payload),
        global_role: payload.global_role,
        org_role: payload.org_role,
      };

      hasLoggedIn.current = true;

      login({ token, user });

      fireToast("OAUTH.SUCCESS", "success");

      navigate(
        user.context === "admin"
          ? "/admin/dashboard"
          : user.context === "organization"
            ? "/org/dashboard"
            : "/user/dashboard",
        { replace: true }
      );
    } catch (err) {
      console.error("OAuth decode error", err);
      
      fireToast("OAUTH.INVALID", "error");
      
      navigate("/", { replace: true });
    }
  }, [currentRole, login, navigate, params, isAuthenticated]);

  return <p>Signing you in…</p>;
};

export default OAuthSuccess;
