import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/user/Forgot.css";
import { fireToast } from "../services/user/toastService.js";

const ResetPassword = () => {
  const { token } = useParams();   // 👈 ye missing tha!
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002";
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ❌ password mismatch
    if (!password || password !== confirm) {
      fireToast("RESET.MISMATCH", "error");
      return;
    }

    try {   // ✅ TRY START

      const res = await fetch(`${API_URL}/api/v1/auth/password/reset/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: password }),
      });

      if (!res.ok) {
        fireToast("RESET.INVALID", "error");
        return;
      }

      // ✅ success
      fireToast("RESET.SUCCESS", "success");

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1200);

    // eslint-disable-next-line no-unused-vars
    } catch (err) {   // ✅ ab catch valid hai
      fireToast("API.NETWORK", "error");
    }
  };

  return (
    <div className="auth-page">
      <h2>Create New Password</h2>

      <form onSubmit={handleSubmit}>
        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Create new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
        </div>

        <div className="password-field">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowConfirm((s) => !s)}
            aria-label={showConfirm ? "Hide password" : "Show password"}
            title={showConfirm ? "Hide password" : "Show password"}
          >
            {showConfirm ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
        </div>

        <button type="submit">Enter</button>
      </form>
    </div>
  );
};

export default ResetPassword;
