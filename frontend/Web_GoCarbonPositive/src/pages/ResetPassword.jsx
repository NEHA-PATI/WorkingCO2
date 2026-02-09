import React, { useState } from "react";
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
        <input
          type="password"
          placeholder="Create new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        <button type="submit">Enter</button>
      </form>
    </div>
  );
};

export default ResetPassword;
