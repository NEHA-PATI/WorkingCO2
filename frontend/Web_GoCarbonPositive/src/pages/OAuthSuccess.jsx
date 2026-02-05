import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAuth from "../auth/useAuth";
import { fireToast } from "../services/user/toastService.js";

const OAuthSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const hasLoggedIn = useRef(false);

  useEffect(() => {
    if (hasLoggedIn.current) return;

    if (isAuthenticated) {
      navigate("/user/dashboard", { replace: true });
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
        role: payload.role || "user",
      };

      hasLoggedIn.current = true;

      login({ token, user });

      fireToast("OAUTH.SUCCESS", "success");

      navigate("/user/dashboard", { replace: true });

    } catch (err) {
      console.error("OAuth decode error", err);

      fireToast("OAUTH.INVALID", "error");

      navigate("/", { replace: true });
    }
  }, [login, navigate, params, isAuthenticated]);

  return <p>Signing you in…</p>;
};

export default OAuthSuccess;
