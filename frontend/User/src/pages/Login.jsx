import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/user/Login.css";
import { RxCross1 } from "react-icons/rx";
import { FcGoogle } from "react-icons/fc";
import DigiLockerLogo from "../assets/digilocker.png";

const Login = ({ onClose, onSwitchToSignup }) => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002";
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and password required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("authUser", JSON.stringify(data.user));

      if (onClose) onClose();
      navigate("/");
    } catch {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (onClose) onClose();
    navigate("/forgot-password");
  };

  // 🔥 GOOGLE OAUTH
  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/api/auth/google`;
  };

  // 🔥 DIGILOCKER OAUTH
  const handleDigiLockerLogin = () => {
    window.location.href = `${API_URL}/api/auth/digilocker`;
  };

  return (
    <div className="modal-overlay">
      <div className="auth-card">
        <button className="close-btn" onClick={onClose}>
          <RxCross1 size={20} />
        </button>

        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Sign in to your account</p>

        <form onSubmit={handleLogin} className="auth-form">
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            className="forgot-link"
            onClick={handleForgotPassword}
          >
            Forgot password?
          </button>

          {error && <div className="error-banner">{error}</div>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <div className="social-buttons">
          <button className="social-btn" onClick={handleGoogleLogin}>
            <FcGoogle size={20} />
            Continue with Google
          </button>

          <button className="social-btn" onClick={handleDigiLockerLogin}>
            <img
              src={DigiLockerLogo}
              className="social-icon"
              alt="DigiLocker"
            />
            Continue with DigiLocker
          </button>
        </div>

        <div className="auth-footer">
          <span>Don’t have an account?</span>
          <button onClick={onSwitchToSignup}>Sign Up</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
