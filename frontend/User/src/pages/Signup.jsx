import { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { FaGoogle, FaLinkedin, FaGithub } from "react-icons/fa";

const Signup = ({ onClose, onSwitchToLogin }) => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    agreeToTerms: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [tempEmail, setTempEmail] = useState("");

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
      alignItems: "center",
      justifyContent: "center",
      zIndex: 999,
    },
    modal: {
      background: "#fff",
      width: "600px",
      maxWidth: "90vw",
      maxHeight: "90vh",
      overflowY: "auto",
      borderRadius: "12px",
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
      position: "relative",
    },
    closeBtn: {
      position: "absolute",
      top: "24px",
      right: "24px",
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
    },
    content: {
      padding: "48px 56px 56px",
    },
    header: {
      marginBottom: "8px",
    },
    title: {
      fontSize: "42px",
      fontWeight: "700",
      color: "#000",
      margin: "0 0 4px 0",
      lineHeight: "1.2",
    },
    subtitle: {
      fontSize: "42px",
      fontWeight: "300",
      color: "#000",
      margin: "0 0 16px 0",
      lineHeight: "1.2",
    },
    description: {
      fontSize: "16px",
      color: "#666",
      marginBottom: "32px",
    },
    formContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },
    input: {
      width: "100%",
      padding: "16px 18px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      fontSize: "16px",
      fontFamily: "inherit",
      transition: "all 0.2s ease",
      backgroundColor: "#fff",
      boxSizing: "border-box",
    },
    inputError: {
      borderColor: "#dc2626",
      backgroundColor: "#fef2f2",
    },
    checkboxContainer: {
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
      marginTop: "4px",
    },
    checkbox: {
      width: "20px",
      height: "20px",
      marginTop: "2px",
      cursor: "pointer",
      flexShrink: 0,
    },
    checkboxLabel: {
      fontSize: "15px",
      color: "#666",
      lineHeight: "1.5",
    },
    link: {
      color: "#5469d4",
      textDecoration: "none",
      cursor: "pointer",
    },
    button: {
      width: "100%",
      padding: "16px",
      border: "none",
      borderRadius: "8px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      marginTop: "8px",
    },
    primaryButton: {
      background: "#b8b4d0",
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
      margin: "28px 0",
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
      padding: "14px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      fontSize: "16px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "12px",
      background: "#fff",
      marginBottom: "12px",
    },
    socialRow: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "12px",
      marginTop: "12px",
    },
    footer: {
      textAlign: "center",
      marginTop: "32px",
      fontSize: "16px",
      color: "#666",
    },
    footerLink: {
      color: "#5469d4",
      textDecoration: "none",
      cursor: "pointer",
      fontWeight: "500",
    },
    errorText: {
      color: "#dc2626",
      fontSize: "14px",
      marginTop: "6px",
      display: "block",
    },
    spinner: {
      width: "16px",
      height: "16px",
      border: "2px solid rgba(255, 255, 255, 0.3)",
      borderTopColor: "white",
      borderRadius: "50%",
      animation: "spin 0.8s linear infinite",
      display: "inline-block",
      marginRight: "8px",
    },
    otpContainer: {
      textAlign: "center",
    },
    otpTitle: {
      fontSize: "28px",
      fontWeight: "700",
      marginBottom: "12px",
    },
    otpDescription: {
      fontSize: "16px",
      color: "#666",
      marginBottom: "24px",
    },
    otpInput: {
      textAlign: "center",
      fontSize: "24px",
      letterSpacing: "8px",
      fontWeight: "600",
    },
    infoBox: {
      background: "linear-gradient(135deg, #e3f2fd 0%, #e1f5fe 100%)",
      borderLeft: "4px solid #0288d1",
      padding: "16px",
      margin: "24px 0",
      borderRadius: "8px",
    },
    infoText: {
      margin: 0,
      fontSize: "14px",
      color: "#01579b",
      lineHeight: "1.6",
    },
    resendSection: {
      marginTop: "24px",
      paddingTop: "24px",
      borderTop: "2px solid #f0f0f0",
    },
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (error[name] || error.general) {
      setError({});
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

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

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the Terms of Service";
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

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
          username: formData.fullName.trim(),
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setError({
            general: "Too many signup attempts. Please try again later.",
          });
        } else {
          setError({ general: data.message || data.error || "Signup failed" });
        }
        return;
      }

      setTempEmail(formData.email.toLowerCase().trim());
      setShowOTP(true);
      setError({
        success: "OTP sent! Check your email.",
      });
    } catch (err) {
      console.error("Signup Error:", err);
      setError({
        general: "Cannot connect to server. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim() || otp.trim().length !== 6) {
      setError({ general: "Please enter a valid 6-digit OTP" });
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

      if (!response.ok) {
        setError({ general: data.message || "OTP verification failed" });
        return;
      }

      localStorage.setItem("authUser", JSON.stringify(data.user));
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }

      if (onClose) onClose();

      alert(
        "✅ Email verified successfully!\n\nYour account is now active.\nPlease login to continue."
      );

      if (onSwitchToLogin) {
        onSwitchToLogin();
      }
    } catch (err) {
      console.error("OTP Verification Error:", err);
      setError({ general: "OTP verification failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 6) {
      setOtp(value);
      if (error.general) {
        setError({});
      }
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError({});

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.fullName.trim(),
          email: tempEmail,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError({ general: data.message || "Failed to resend OTP" });
        return;
      }

      setError({ success: "OTP resent successfully! Check your email." });
    } catch (err) {
      setError({ general: "Failed to resend OTP. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    alert(`${provider} login - Integration pending`);
  };

  return (
    <>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div style={styles.overlay} onClick={onClose}>
        <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
          <button
            style={styles.closeBtn}
            onClick={onClose}
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
            {!showOTP ? (
              <>
                <div style={styles.header}>
                  <h1 style={styles.title}>Join us</h1>
                  <h2 style={styles.subtitle}>Create a Carbon Positive account</h2>
                </div>
                <p style={styles.description}>
                  Be a part of our community
                </p>

                <div style={styles.formContainer}>
                  <div>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name"
                      value={formData.fullName}
                      onChange={handleChange}
                      style={{
                        ...styles.input,
                        ...(error.fullName ? styles.inputError : {}),
                      }}
                      disabled={loading}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#5469d4";
                      }}
                      onBlur={(e) => {
                        if (!error.fullName) e.target.style.borderColor = "#d1d5db";
                      }}
                    />
                    {error.fullName && (
                      <span style={styles.errorText}>{error.fullName}</span>
                    )}
                  </div>

                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      style={{
                        ...styles.input,
                        ...(error.email ? styles.inputError : {}),
                      }}
                      disabled={loading}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#5469d4";
                      }}
                      onBlur={(e) => {
                        if (!error.email) e.target.style.borderColor = "#d1d5db";
                      }}
                    />
                    {error.email && (
                      <span style={styles.errorText}>{error.email}</span>
                    )}
                  </div>

                  <div>
                    <input
                      type="password"
                      name="password"
                      placeholder="Your password"
                      value={formData.password}
                      onChange={handleChange}
                      style={{
                        ...styles.input,
                        ...(error.password ? styles.inputError : {}),
                      }}
                      disabled={loading}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#5469d4";
                      }}
                      onBlur={(e) => {
                        if (!error.password) e.target.style.borderColor = "#d1d5db";
                      }}
                    />
                    {error.password && (
                      <span style={styles.errorText}>{error.password}</span>
                    )}
                  </div>

                  <div style={styles.checkboxContainer}>
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      style={styles.checkbox}
                      disabled={loading}
                    />
                    <label style={styles.checkboxLabel}>
                      I agree to Carbon Positive's{" "}
                      <a
                        href="#"
                        style={styles.link}
                        onClick={(e) => {
                          e.preventDefault();
                          alert("Terms of Service");
                        }}
                      >
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a
                        href="#"
                        style={styles.link}
                        onClick={(e) => {
                          e.preventDefault();
                          alert("Privacy Policy");
                        }}
                      >
                        Privacy Policy
                      </a>
                      .
                    </label>
                  </div>

                  {error.agreeToTerms && (
                    <span style={styles.errorText}>{error.agreeToTerms}</span>
                  )}

                  {error.general && (
                    <div style={{ ...styles.errorText, marginTop: "8px" }}>
                      {error.general}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleSignup}
                    style={{
                      ...styles.button,
                      ...styles.primaryButton,
                      ...(loading ? styles.primaryButtonDisabled : {}),
                    }}
                    disabled={loading}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.currentTarget.style.background = "#a8a3c7";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!loading) {
                        e.currentTarget.style.background = "#b8b4d0";
                      }
                    }}
                  >
                    {loading ? (
                      <>
                        <span style={styles.spinner}></span>
                        Sending OTP...
                      </>
                    ) : (
                      "Sign up"
                    )}
                  </button>
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

                <div style={styles.socialRow}>
                  {/* <button
                    style={styles.socialButton}
                    onClick={() => handleSocialLogin("LinkedIn")}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#9ca3af";
                      e.currentTarget.style.backgroundColor = "#f9fafb";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#d1d5db";
                      e.currentTarget.style.backgroundColor = "#fff";
                    }}
                  >
                    <FaLinkedin size={20} color="#0A66C2" />
                    LinkedIn
                  </button> */}
                  {/* <button
                    style={styles.socialButton}
                    onClick={() => handleSocialLogin("GitHub")}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#9ca3af";
                      e.currentTarget.style.backgroundColor = "#f9fafb";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#d1d5db";
                      e.currentTarget.style.backgroundColor = "#fff";
                    }}
                  >
                    <FaGithub size={20} color="#000" />
                    GitHub
                  </button> */}
                </div>

                <div style={styles.footer}>
                  Already have an account?{" "}
                  <a
                    style={styles.footerLink}
                    onClick={onSwitchToLogin}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.textDecoration = "underline";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.textDecoration = "none";
                    }}
                  >
                    Log in
                  </a>
                </div>
              </>
            ) : (
              <div style={styles.otpContainer}>
                <h3 style={styles.otpTitle}>Verify your Email</h3>
                <p style={styles.otpDescription}>
                  Enter the 6-digit OTP sent to <b>{tempEmail}</b>
                </p>

                <div style={styles.infoBox}>
                  <p style={styles.infoText}>
                    ℹ️ After verification, your account will be active and you
                    can login.
                  </p>
                </div>

                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={handleOtpChange}
                  style={{
                    ...styles.input,
                    ...styles.otpInput,
                    ...(error.general ? styles.inputError : {}),
                  }}
                  disabled={loading}
                  maxLength={6}
                  autoFocus
                />

                {error.general && (
                  <p style={{ ...styles.errorText, marginTop: "12px" }}>
                    {error.general}
                  </p>
                )}
                {error.success && (
                  <p
                    style={{
                      color: "#16a34a",
                      fontSize: "14px",
                      marginTop: "12px",
                    }}
                  >
                    {error.success}
                  </p>
                )}

                <button
                  onClick={handleVerifyOtp}
                  style={{
                    ...styles.button,
                    ...styles.primaryButton,
                    ...(loading || otp.length !== 6
                      ? styles.primaryButtonDisabled
                      : {}),
                    marginTop: "24px",
                  }}
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? (
                    <>
                      <span style={styles.spinner}></span>
                      Verifying...
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </button>

                <div style={styles.resendSection}>
                  <p style={{ fontSize: "14px", color: "#666", margin: "0 0 8px 0" }}>
                    Didn't receive the code?
                  </p>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      color: "#5469d4",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "15px",
                    }}
                    onClick={handleResendOtp}
                    disabled={loading}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.textDecoration = "underline";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.textDecoration = "none";
                    }}
                  >
                    Resend OTP
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;