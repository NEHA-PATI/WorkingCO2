import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import useAuth from "@contexts/AuthContext";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import LoadingPopup from "@shared/components/LoadingPopup";
import { fireToast } from "@shared/utils/toastService";
import { ENV } from "@config/env";

const Login = ({ onClose, onSwitchToSignup }) => {
  const API_URL = import.meta.env.VITE_AUTH_API || "http://localhost:5002";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Responsive breakpoint
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleClose = () => {
    if (onClose) {
      onClose(); // works when Login is used as a modal
    } else {
      navigate("/"); // works when Login is opened as a page
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // Inline Styles
  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.5)",
      backdropFilter: "blur(4px)",
      display: "flex",
      alignItems: isMobile ? "flex-end" : "center",
      justifyContent: "center",
      zIndex: 2000,
      padding: isMobile ? "0" : "20px",
    },
    modal: {
      background: "#fff",
      width: isMobile ? "100%" : "460px",
      maxWidth: isMobile ? "92vh" : "90vw",
      maxHeight: isMobile ? "90vh" : "90vh",
      overflowY: "auto",
      borderRadius: isMobile ? "20px 20px 0 0" : "14px",
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.25)",
      position: "relative",
      animation: isMobile ? "slideUpMobile 0.3s ease-out" : "none",
    },
    closeBtn: {
      position: "absolute",
      top: isMobile ? "16px" : "24px",
      right: isMobile ? "16px" : "24px",
      background: "transparent",
      border: "none",
      color: "#666",
      cursor: "pointer",
      width: "32px",
      height: "32px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s ease",
      zIndex: 10,
    },
    content: {
      padding: isMobile ? "40px 20px 28px" : "36px 32px 32px",
    },
    header: {
      marginBottom: isMobile ? "12px" : "16px",
    },
    title: {
      fontSize: isMobile ? "24px" : "30px",
      fontWeight: "700",
      background: "linear-gradient(135deg, #16a34a, #22c55e)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      margin: "0 0 2px 0",
      lineHeight: "1.2",
    },
    subtitle: {
      fontSize: isMobile ? "18px" : "22px",
      fontWeight: "400",
      color: "#111",
      margin: "0 0 10px 0",
      lineHeight: "1.2",
    },
    description: {
      fontSize: isMobile ? "14px" : "14px",
      color: "#666",
      marginBottom: isMobile ? "18px" : "20px",
      lineHeight: "1.5",
    },
    formContainer: {
      display: "flex",
      flexDirection: "column",
      gap: isMobile ? "14px" : "16px",
    },
    input: {
      width: "100%",
      padding: isMobile ? "14px 16px" : "16px 18px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      fontSize: isMobile ? "15px" : "16px",
      fontFamily: "inherit",
      transition: "all 0.2s ease",
      backgroundColor: "#fff",
      boxSizing: "border-box",
    },
    inputError: {
      borderColor: "#dc2626",
      backgroundColor: "#fef2f2",
    },
    errorText: {
      color: "#dc2626",
      fontSize: "14px",
      marginTop: "6px",
      display: "block",
    },
    rememberRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: "4px",
      marginBottom: "4px",
    },
    checkboxContainer: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    checkbox: {
      width: "18px",
      height: "18px",
      cursor: "pointer",
    },
    checkboxLabel: {
      fontSize: isMobile ? "13px" : "14px",
      color: "#666",
      cursor: "pointer",
    },
    forgotLink: {
      fontSize: isMobile ? "13px" : "14px",
      color: "#5469d4",
      textDecoration: "none",
      cursor: "pointer",
      fontWeight: "500",
    },
    button: {
      width: "100%",
      padding: isMobile ? "14px" : "16px",
      border: "none",
      borderRadius: "8px",
      fontSize: isMobile ? "15px" : "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      marginTop: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
    },
    primaryButton: {
      background: "linear-gradient(135deg, #16a34a, #22c55e)",
      color: "#fff",
    },
    primaryButtonDisabled: {
      background: "#e5e3ef",
      cursor: "not-allowed",
      opacity: 0.7,
    },
    divider: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
      margin: isMobile ? "20px 0" : "28px 0",
    },
    dividerLine: {
      flex: 1,
      height: "1px",
      background: "#e0e0e0",
    },
    dividerText: {
      color: "#999",
      fontSize: "14px",
    },
    socialButton: {
      width: "100%",
      padding: isMobile ? "12px" : "14px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      fontSize: isMobile ? "14px" : "16px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: isMobile ? "8px" : "12px",
      background: "#fff",
      marginBottom: isMobile ? "10px" : "12px",
    },
    socialRow: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
      gap: isMobile ? "10px" : "12px",
      marginTop: isMobile ? "10px" : "12px",
    },
    footer: {
      textAlign: "center",
      marginTop: isMobile ? "24px" : "32px",
      fontSize: isMobile ? "14px" : "16px",
      color: "#666",
    },
    footerLink: {
      color: "#5469d4",
      textDecoration: "none",
      cursor: "pointer",
      fontWeight: "500",
    },
    spinner: {
      width: "16px",
      height: "16px",
      border: "2px solid rgba(255, 255, 255, 0.3)",
      borderTopColor: "white",
      borderRadius: "50%",
      animation: "spin 0.8s linear infinite",
      display: "inline-block",
    },
    errorBanner: {
      background: "#fef2f2",
      border: "1px solid #fecaca",
      borderRadius: "8px",
      padding: "12px 16px",
      marginTop: "8px",
      marginBottom: "8px",
    },
    passwordField: {
      position: "relative",
      width: "100%",
    },
    passwordToggle: {
      position: "absolute",
      right: "12px",
      top: "50%",
      transform: "translateY(-50%)",
      background: "transparent",
      border: "none",
      padding: "4px",
      cursor: "pointer",
      color: "#6b7280",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    if (errors.general) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.general;
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        fireToast("AUTH.LOGIN_ERROR", "error");
        return;
      }

      if (!data.data?.user || !data.data?.token) {
        fireToast("AUTH.LOGIN_ERROR", "error");
        return;
      }

      if (!data.data.user.verified) {
        fireToast("AUTH.NOT_VERIFIED", "warning");
        return;
      }

      if (data.data.user.status !== "active") {
        fireToast("AUTH.INACTIVE", "error");
        return;
      }

      // ✅ SINGLE SOURCE OF TRUTH
      // ✅ SINGLE SOURCE OF TRUTH
      login({
        token: data.data.token,
        user: data.data.user,
      });
      fireToast("AUTH.LOGIN_SUCCESS");

      const role =
        data.user.role?.toLowerCase() || data.user.role_name?.toLowerCase();

      if (role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (role === "organization") {
        navigate("/org/dashboard", { replace: true });
      } else {
        navigate("/user/dashboard", { replace: true });
      }

      // close modal AFTER navigation
      setTimeout(() => {
        onClose?.();
      }, 0);

      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      fireToast("AUTH.LOGIN_ERROR", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    if (provider === "Google") {
      window.location.href = `${API_URL}/api/v1/auth/oauth/google/login`;
    }
  };

  const handleForgotPassword = () => {
    if (navigate) {
      navigate("/forgot-password");
    } else {
      window.location.href = "/forgot-password";
    }
  };

  return (
    <>
      <LoadingPopup isVisible={loading} />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes slideUpMobile {
          from {
            transform: translateY(100%);
            opacity: 0.8;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
      <div style={styles.overlay} onClick={handleClose}>
        <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
          <button
            style={styles.closeBtn}
            onClick={handleClose}
            disabled={loading}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#f5f5f5";
              e.currentTarget.style.transform = "rotate(90deg)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.transform = "rotate(0deg)";
            }}
          >
            <RxCross1 size={20} />
          </button>

          <div style={styles.content}>
            <div style={styles.header}>
              <h1 style={styles.title}>Welcome back!</h1>
              <h2 style={styles.subtitle}>Login to your account</h2>
            </div>
            <p style={styles.description}>
              It's nice to see you again. Ready to start?
            </p>

            <div style={styles.formContainer}>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Your username or email"
                  value={formData.email}
                  onChange={handleChange}
                  style={{
                    ...styles.input,
                    ...(errors.email ? styles.inputError : {}),
                  }}
                  disabled={loading}
                  autoComplete="email"
                  onFocus={(e) => {
                    e.target.style.borderColor = "#5469d4";
                  }}
                  onBlur={(e) => {
                    if (!errors.email) e.target.style.borderColor = "#d1d5db";
                  }}
                />
                {errors.email && (
                  <span style={styles.errorText}>{errors.email}</span>
                )}
              </div>

              <div style={styles.passwordField}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Your password"
                  value={formData.password}
                  onChange={handleChange}
                  style={{
                    ...styles.input,
                    ...(errors.password ? styles.inputError : {}),
                    paddingRight: "44px",
                  }}
                  disabled={loading}
                  autoComplete="current-password"
                  onFocus={(e) => {
                    e.target.style.borderColor = "#5469d4";
                  }}
                  onBlur={(e) => {
                    if (!errors.password)
                      e.target.style.borderColor = "#d1d5db";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  style={styles.passwordToggle}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                  disabled={loading}
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
                {errors.password && (
                  <span style={styles.errorText}>{errors.password}</span>
                )}
              </div>

              {errors.general && (
                <div style={styles.errorBanner}>
                  <span style={styles.errorText}>{errors.general}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                style={{
                  ...styles.button,
                  ...styles.primaryButton,
                  ...(loading ? styles.primaryButtonDisabled : {}),
                }}
                disabled={loading}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background =
                      "linear-gradient(135deg, #15803d, #16a34a)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background =
                      "linear-gradient(135deg, #16a34a, #22c55e)";
                  }
                }}
              >
                {loading ? (
                  <>
                    <span style={styles.spinner}></span>
                    Signing In...
                  </>
                ) : (
                  "Log In"
                )}
              </button>

              <div style={styles.rememberRow}>
                <div style={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    style={styles.checkbox}
                    disabled={loading}
                  />
                  <label style={styles.checkboxLabel}>Remember me</label>
                </div>
                <a
                  style={styles.forgotLink}
                  onClick={handleForgotPassword}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.textDecoration = "underline";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.textDecoration = "none";
                  }}
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <div style={styles.divider}>
              <div style={styles.dividerLine}></div>
              <span style={styles.dividerText}>or</span>
              <div style={styles.dividerLine}></div>
            </div>

            <button
              style={styles.socialButton}
              onClick={() => handleSocialLogin("Google")}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#9ca3af";
                e.currentTarget.style.backgroundColor = "#f9fafb";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#d1d5db";
                e.currentTarget.style.backgroundColor = "#fff";
              }}
            >
              <FaGoogle size={20} color="#4285F4" />
              Continue with Google
            </button>

            <div style={styles.socialRow}></div>

            <div style={styles.footer}>
              Don't have an account?{" "}
              <a
                style={styles.footerLink}
                onClick={onSwitchToSignup}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = "underline";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = "none";
                }}
              >
                Sign up
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
