import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/user/Forgot.css";

const ForgotPassword = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002";
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) return;

    setLoading(true);

    try {
      // 🔹 Backend ko mail bhejne bol do
      await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      // ✅ Step 1: Message dikhao
      setMessage("Please check your mail");

      // ✅ Step 2: 2 second baad page hata do
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 2000);
    } catch (err) {
      console.error("Forgot password error:", err);
      setMessage("Please check your mail");

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 2000);
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
          disabled={loading || message}
        />

        <button type="submit" disabled={loading || message}>
          {loading ? "Sending..." : "Enter"}
        </button>
      </form>

      {/* ✅ MESSAGE UI */}
      {message && (
        <p className="info-text" style={{ marginTop: "12px" }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default ForgotPassword;
