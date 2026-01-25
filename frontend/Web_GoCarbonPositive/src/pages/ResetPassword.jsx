import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/user/Forgot.css";

const ResetPassword = () => {
  const { token } = useParams();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002";
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || password !== confirm) return;

    await fetch(`${API_URL}/api/auth/reset-password/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setSuccess(true);

    // 🔥 1 second success message
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 1000);
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

      {success && (
        <p className="success-text">
          New password created successfully
        </p>
      )}
    </div>
  );
};

export default ResetPassword;
