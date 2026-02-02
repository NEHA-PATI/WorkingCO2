import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAuth from "../auth/useAuth";

const OAuthSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const hasLoggedIn = useRef(false); // 🔥 IMPORTANT GUARD

  useEffect(() => {
    if (hasLoggedIn.current) return; // 🚫 stop loop
    if (isAuthenticated) {
      navigate("/user/dashboard", { replace: true });
      return;
    }

    const token = params.get("token");
    if (!token) {
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
        role: payload.role || "user", // 🔥 SAFE
      };

      hasLoggedIn.current = true;

      login({ token, user });

      navigate("/user/dashboard", { replace: true });
    } catch (err) {
      console.error("OAuth decode error", err);
      navigate("/", { replace: true });
    }
  }, [login, navigate, params, isAuthenticated]);

  return <p>Signing you in…</p>;
};

export default OAuthSuccess;
