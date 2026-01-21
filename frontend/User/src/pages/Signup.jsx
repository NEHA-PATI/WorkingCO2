import { useState } from "react";
import "../styles/user/Signup.css";
import { RxCross1 } from "react-icons/rx";

const Signup = ({ onClose, onSwitchToLogin }) => {
  // ✅ Use environment variable for API URL
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002";

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [tempEmail, setTempEmail] = useState("");

  // const navigate = useNavigate();

  // ✅ Enhanced input change handler with validation clearing
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear errors when user types
    if (error[name] || error.general) {
      setError({});
    }
  };

  // ✅ Client-side validation
  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.trim().length < 2) {
      newErrors.username = "Username must be at least 2 characters";
    } else if (formData.username.trim().length > 50) {
      newErrors.username = "Username must be less than 50 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Password validation (matching backend requirements)
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        formData.password
      )
    ) {
      newErrors.password =
        "Password must include uppercase, lowercase, number, and special character";
    }

    // Role validation
    // if (!formData.role) {
    //   newErrors.role = "Please select a role";
    // }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Step 1: Signup - send OTP
  const handleSignup = async (e) => {
    e.preventDefault();

    // Validate form first
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError({});

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username.trim(),
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();

      // ✅ Handle different error status codes
      if (!response.ok) {
        if (response.status === 429) {
          setError({
            general: "Too many signup attempts. Please try again later.",
          });
        } else if (response.status === 400) {
          setError({
            general:
              data.message || "Signup failed. Please check your details.",
          });
        } else if (response.status === 500) {
          setError({ general: "Server error. Please try again later." });
        } else {
          setError({ general: data.message || data.error || "Signup failed" });
        }
        return;
      }

      // ✅ Success - show OTP screen
      setTempEmail(formData.email.toLowerCase().trim());
      setShowOTP(true);
      setError({
        success: "OTP sent! After verification, your account will be active.",
      });
    } catch (err) {
      console.error("❌ Signup Error:", err);

      // ✅ Better error messages based on error type
      if (err.name === "TypeError" && err.message.includes("fetch")) {
        setError({
          general: "Cannot connect to server. Please check your connection.",
        });
      } else if (err.name === "SyntaxError") {
        setError({
          general: "Invalid response from server. Please try again.",
        });
      } else {
        setError({
          general: "An unexpected error occurred. Please try again later.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Step 2: Verify OTP with status handling
  const handleVerifyOtp = async () => {
    // Validate OTP
    if (!otp.trim()) {
      setError({ general: "Please enter the OTP" });
      return;
    }

    if (otp.trim().length !== 6 || !/^\d+$/.test(otp.trim())) {
      setError({ general: "OTP must be 6 digits" });
      return;
    }

    setLoading(true);
    setError({});

    try {
      const response = await fetch(`${API_URL}/api/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: tempEmail,
          otp: otp.trim(),
        }),
      });

      const data = await response.json();

      // ✅ Handle different error status codes
      if (!response.ok) {
        if (response.status === 400) {
          setError({ general: data.message || "Invalid or expired OTP" });
        } else if (response.status === 404) {
          setError({ general: "User not found. Please sign up again." });
        } else if (response.status === 500) {
          setError({ general: "Server error. Please try again later." });
        } else {
          setError({ general: data.message || "OTP verification failed" });
        }
        return;
      }

      // ✅ Validate response data
      if (!data.user) {
        setError({ general: "Verification failed. Missing user data." });
        return;
      }

      // ✅ Save user info to localStorage
      localStorage.setItem("authUser", JSON.stringify(data.user));
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }

      // Token will be generated after login, not after verification
      // Close modal if callback provided
      if (onClose) onClose();

      // ✅ Show success message and redirect to login
      // OLD: alert(
      //   "✅ Email verified successfully!\n\n" +
      //   "Your account is pending admin approval.\n" +
      //   "You can login, but will have limited access until approved.\n\n" +
      //   "Please login to continue."
      // );
      alert(
        "✅ Email verified successfully!\n\n" +
        "Your account is now active.\n" +
        "Please login to continue."
      );

      // Switch to login modal

      if (onSwitchToLogin) {
        onSwitchToLogin();
      } else {
        // eslint-disable-next-line no-undef
        navigate("/");
      }
    } catch (err) {
      console.error("❌ OTP Verification Error:", err);

      // ✅ Better error messages
      if (err.name === "TypeError" && err.message.includes("fetch")) {
        setError({
          general: "Cannot connect to server. Please check your connection.",
        });
      } else {
        setError({ general: "OTP verification failed. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle OTP input with auto-submit on 6 digits
  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Only digits
    if (value.length <= 6) {
      setOtp(value);
      if (error.general) {
        setError({});
      }
    }
  };

  // ✅ Resend OTP functionality
  const handleResendOtp = async () => {
    setLoading(true);
    setError({});

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username.trim(),
          email: tempEmail,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError({ general: data.message || "Failed to resend OTP" });
        return;
      }

      setError({ success: "OTP resent successfully! Check your email." });
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError({ general: "Failed to resend OTP. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal signup-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{showOTP ? "Verify Email" : "Create Account"}</h2>
          <button
            className="close-btn"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            type="button"
            aria-label="Close signup form"
            disabled={loading}
          >
            <RxCross1 size={24} />
          </button>
        </div>

        {!showOTP ? (
          // ✅ Signup Form
          <form onSubmit={handleSignup} className="signup-form" noValidate>
            {/* Username */}
            <div className="form-group">
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className={`input ${error.username ? "error" : ""}`}
                disabled={loading}
                autoComplete="username"
                required
              />
              {error.username && (
                <span className="error-text" role="alert">
                  {error.username}
                </span>
              )}
            </div>

            {/* Email */}
            <div className="form-group">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className={`input ${error.email ? "error" : ""}`}
                disabled={loading}
                autoComplete="email"
                required
              />
              {error.email && (
                <span className="error-text" role="alert">
                  {error.email}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="form-group">
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password (min 8 chars, uppercase, lowercase, number, special)"
                value={formData.password}
                onChange={handleChange}
                className={`input ${error.password ? "error" : ""}`}
                disabled={loading}
                autoComplete="new-password"
                required
              />
              {error.password && (
                <span className="error-text" role="alert">
                  {error.password}
                </span>
              )}
            </div>

            {/* Role
            <div className="form-group">
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`input ${error.role ? "error" : ""}`}
                disabled={loading}
                required
              >
                <option value="" disabled>
                  Select role
                </option>
                <option value="user">Private User</option>
                <option value="organization">Organization</option>
              </select>
              {error.role && (
                <span className="error-text" role="alert">
                  {error.role}
                </span>
              )}
            </div> */}

            {/* General Error */}
            {error.general && (
              <div className="error-banner" role="alert">
                <p className="error-text">{error.general}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" aria-hidden="true"></span>
                  Sending OTP...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>
        ) : (
          // ✅ OTP Verification Form
          <div className="otp-form">
            <h3>Verify your Email</h3>
            <p>
              Enter the 6-digit OTP sent to <b>{tempEmail}</b>
            </p>

            {/* ✅ Info about account activation */}
            {/* OLD: <div className="info-box">
              <p className="info-text">
                ℹ️ After verification, you can login but your account will be pending admin approval.
              </p>
            </div> */}
            <div className="info-box">
              <p className="info-text">
                ℹ️ After verification, your account will be active and you can
                login.
              </p>
            </div>

            <div className="form-group">
              <input
                type="text"
                id="otp"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={handleOtpChange}
                className={`input otp-input ${error.general ? "error" : ""}`}
                disabled={loading}
                maxLength={6}
                pattern="\d{6}"
                autoComplete="one-time-code"
                autoFocus
              />
            </div>

            {/* Error or Success Message */}
            {error.general && (
              <p className="error-text" role="alert">
                {error.general}
              </p>
            )}
            {error.success && (
              <p className="success-text" role="status">
                {error.success}
              </p>
            )}

            {/* Verify Button */}
            <button
              onClick={handleVerifyOtp}
              className="btn-primary"
              disabled={loading || otp.length !== 6}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" aria-hidden="true"></span>
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </button>

            {/* Resend OTP */}
            <div className="resend-section">
              <p>Didn't receive the code?</p>
              <button
                type="button"
                className="link-btn"
                onClick={handleResendOtp}
                disabled={loading}
              >
                Resend OTP
              </button>
            </div>
          </div>
        )}


        {/* Footer - Login Link */}
        {!showOTP && (
          <div className="modal-footer">
            <p>
              Already have an account?{" "}
              <button
                className="link-btn"
                onClick={onSwitchToLogin}
                type="button"
                disabled={loading}
              >
                Log In
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
