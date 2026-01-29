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
    if (!email || loading) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        `http://localhost:5002/api/auth/password/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Too many requests");
      }

      setMessage("Please check your mail");

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 2000);
    } catch (err) {
      console.error("Forgot password error:", err.message);
      setMessage(err.message || "Too many requests. Try later.");
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

      {message && (
        <p className="info-text" style={{ marginTop: "12px" }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default ForgotPassword;
