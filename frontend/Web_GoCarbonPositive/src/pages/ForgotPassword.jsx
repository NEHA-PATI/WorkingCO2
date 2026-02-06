import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/user/Forgot.css";
import { fireToast } from "../services/user/toastService.js";

const ForgotPassword = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002";
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      fireToast("FORGOT.EMPTY_EMAIL", "warning");
      return;
    }

    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch(
        `${API_URL}/api/auth/password/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      await res.json();

      if (!res.ok) {
        fireToast("FORGOT.FAILED", "error");
        return;
      }

      fireToast("FORGOT.LINK_SENT", "success");

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 2000);

    } catch (err) {
      console.error("Forgot password error:", err.message);
      fireToast("API.NETWORK", "error");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <h2>Forgot Password</h2>
      <p>Enter your email address</p>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Enter"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
