import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/user/Login.css";
import { RxCross1 } from "react-icons/rx";

const Login = ({ onLogin, onClose, onSwitchToSignup }) => {
  // ✅ Use environment variable for API URL
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Clear general error too
    if (errors.general) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.general;
        return newErrors;
      });
    }
  };

  // ✅ Enhanced validation
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Handle form submit with status checking
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form first
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();
      console.log("🟢 Login API Response:", data);

      // ✅ Handle different error status codes
      if (!response.ok) {
        if (response.status === 429) {
          setErrors({
            general:
              "Account locked due to multiple failed attempts. Try again later.",
          });
        } else if (response.status === 403) {
          // ✅ Handle pending, rejected, suspended status from backend
          setErrors({ general: data.message || "Access denied" });
        } else if (response.status === 400) {
          setErrors({ general: data.message || "Invalid email or password" });
        } else if (response.status === 500) {
          setErrors({ general: "Server error. Please try again later." });
        } else {
          setErrors({
            general: data.message || "Login failed. Please try again.",
          });
        }
        return;
      }

      // ✅ Validate response data
      if (!data.user || !data.token) {
        setErrors({ general: "Login failed. Missing token or user data." });
        return;
      }

      // ✅ Check if user is verified
      if (!data.user.verified) {
        setErrors({ general: "Please verify your email first." });
        return;
      }

      // ✅ Save data to localStorage using standard keys
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("authUser", JSON.stringify(data.user));

      // ✅ Call onLogin callback with user data
      if (onLogin) onLogin(data.user);
      if (onClose) onClose();

      // ✅ Redirect based on user status
      const status = data.user.status;
      // const role = data.user.role_name?.toUpperCase();

      // Check status first
      // OLD: if (status === 'pending') {
      //   navigate("/pending-approval");
      //   return;
      // }

      if (status !== "active") {
        setErrors({
          general: `Account status: ${status}. Please contact support.`,
        });
        // Clear only auth data, not all localStorage
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
        return;
      }

      // ✅ If active, redirect based on role
      const role = data.user.role_name?.toUpperCase() || data.user.role?.toUpperCase();

      switch (role) {
        case "USER":
          navigate("/user/dashboard", { replace: true });
          break;
        case "ORGANIZATION":
          navigate("/org/dashboard", { replace: true });
          break;
        case "ADMIN":
          navigate("/admin/dashboard", { replace: true });
          break;
        default:
          console.warn("Unknown role:", role);
          navigate("/", { replace: true });
      }
    } catch (err) {
      console.error("❌ Login Error:", err);

      // ✅ Better error messages based on error type
      if (err.name === "TypeError" && err.message.includes("fetch")) {
        setErrors({
          general: "Cannot connect to server. Please check your connection.",
        });
      } else if (err.name === "SyntaxError") {
        setErrors({
          general: "Invalid response from server. Please try again.",
        });
      } else {
        setErrors({
          general: "An unexpected error occurred. Please try again later.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Render UI
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="auth-card" onClick={(e) => e.stopPropagation()}>
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your account</p>
          {onClose && (
            <button
              className="close-btn"
              onClick={onClose}
              type="button"
              aria-label="Close login form"
            >
              <RxCross1 size={24} />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "error" : ""}
              placeholder="Enter your email"
              disabled={loading}
              autoComplete="email"
              required
            />
            {errors.email && (
              <span className="error-message" role="alert">
                {errors.email}
              </span>
            )}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "error" : ""}
              placeholder="Enter your password"
              disabled={loading}
              autoComplete="current-password"
              required
            />
            {errors.password && (
              <span className="error-message" role="alert">
                {errors.password}
              </span>
            )}
          </div>

          {/* General Error Message */}
          {errors.general && (
            <div className="error-banner" role="alert">
              <p className="error-message center">{errors.general}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <span className="spinner" aria-hidden="true"></span>
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <button
              className="link-btn"
              onClick={onSwitchToSignup}
              type="button"
              disabled={loading}
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
