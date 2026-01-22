import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAuth from "../auth/useAuth";

const OAuthSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = params.get("token");

    if (!token) {
      navigate("/", { replace: true });
      return;
    }

    // Decode JWT safely
    const payload = JSON.parse(atob(token.split(".")[1]));

    const user = {
      id: payload.id,
      u_id: payload.u_id,
      email: payload.email,
      status: payload.status,
      role: "user", // OAuth users = user
    };

    // ✅ CORRECT CALL
    login(token, user);

    navigate("/user/dashboard", { replace: true });
  }, []);

  return <p>Signing you in…</p>;
};

export default OAuthSuccess;
