import { useState, useEffect } from "react";
import { RxCross1 } from "react-icons/rx";
import { FaGoogle, FaLinkedin, FaGithub } from "react-icons/fa";
import useAuth from "../auth/useAuth";
import { useNavigate } from "react-router-dom";
import LoadingPopup from "../components/user/LoadingPopup";
import { fireToast } from "../services/user/toastService.js";


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
  const [otpDigits, setOtpDigits] = useState(Array(6).fill(""));
  const [otpTimer, setOtpTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  // eslint-disable-next-line no-unused-vars
const { login } = useAuth();

  const navigate = useNavigate();

  const handleClose = () => {
    if (onClose) {
      onClose(); // works when Signup is used as modal
    } else {
      navigate("/"); // works when Signup is opened as a page
    }
  };

  const handleSwitchToLogin = () => {
    if (onSwitchToLogin) {
      onSwitchToLogin(); // modal usage
    } else {
      navigate("/login"); // page usage
    }
  };

  const [tempToken, setTempToken] = useState("");

  // Responsive breakpoint check
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    if (!showOTP) return;

    setOtpTimer(30);
    setCanResend(false);

    const interval = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showOTP]);

  // Handle responsive resize
  useState(() => {
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
      zIndex: 999,
      padding: isMobile ? "0" : "20px",
    },
    modal: {
      background: "#fff",
      width: isMobile ? "100%" : "480px",
      maxWidth: "92vw",
      maxHeight: isMobile ? "95vh" : "85vh",
      overflowY: "auto",
      borderRadius: isMobile ? "20px 20px 0 0" : "12px",
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
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
      padding: isMobile ? "32px 20px 24px" : "32px 36px 36px",
    },
    header: {
      marginBottom: isMobile ? "12px" : "8px",
    },
    title: {
      fontSize: isMobile ? "24px" : "30px",
      fontWeight: "700",
      background: "linear-gradient(135deg, #16a34a, #22c55e)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      margin: "0 0 4px 0",
      lineHeight: "1.2",
    },
    subtitle: {
      fontSize: isMobile ? "22px" : "28px",
      fontWeight: "300",
      color: "#000",
      margin: "0 0 12px 0",
      lineHeight: "1.2",
    },
    description: {
      fontSize: isMobile ? "13px" : "14px",
      color: "#666",
      marginBottom: isMobile ? "16px" : "20px",
      lineHeight: "1.5",
    },
    formContainer: {
      display: "flex",
      flexDirection: "column",
      gap: isMobile ? "14px" : "16px",
    },
    input: {
      width: "100%",
      padding: isMobile ? "10px 12px" : "12px 14px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      fontSize: isMobile ? "14px" : "14.5px",
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
      fontSize: isMobile ? "13px" : "15px",
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
      padding: isMobile ? "12px" : "12px",
      border: "none",
      borderRadius: "8px",
      fontSize: isMobile ? "15px" : "16px",
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
      background: "linear-gradient(135deg, #16a34a, #22c55e)",
      cursor: "not-allowed",
      opacity: 0.7,
    },
    divider: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
      margin: isMobile ? "14px 0" : "18px 0",
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
      padding: isMobile ? "10px" : "11px",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      fontSize: isMobile ? "14px" : "14px",
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
      fontSize: isMobile ? "24px" : "28px",
      fontWeight: "700",
      marginBottom: "12px",
    },
    otpDescription: {
      fontSize: isMobile ? "14px" : "16px",
      color: "#666",
      marginBottom: "24px",
    },
    otpInput: {
      textAlign: "center",
      fontSize: isMobile ? "20px" : "24px",
      letterSpacing: isMobile ? "6px" : "8px",
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
        formData.password,
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

  if (!validateForm()) return;

  setLoading(true);
  setError({});

  try {
    const response = await fetch(`${API_URL}/api/v1/auth/register`, {
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
        fireToast("REGISTER.TOO_MANY", "error");
      } else {
        fireToast("REGISTER.FAILED", "error");
      }
      return;
    }

    // ✅ SUCCESS CASE
    setTempEmail(formData.email.toLowerCase().trim());
    setTempToken(data.data?.tempToken);
    setShowOTP(true);

    fireToast("REGISTER.OTP_SENT", "success");

  } catch (err) {
    console.error("Signup Error:", err);
    fireToast("API.NETWORK", "error");

  } finally {
    setLoading(false);
  }
};


  const handleVerifyOtp = async () => {
    if (!otp.trim() || otp.trim().length !== 6) {
      fireToast("OTP.INVALID", "error");

      return;
    }

    setLoading(true);
    setError({});

    try {
      const response = await fetch(`${API_URL}/api/v1/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          otp: otp.trim(),
          tempToken, // 🔥 ONLY THESE TWO
        }),
      });


      if (!response.ok) {
       fireToast("OTP.FAILED", "error");

        return;
      }

      fireToast("OTP.VERIFIED", "success");


      // 👉 User ko login page pe bhejo (BEST PRACTICE)
      if (onClose) onClose();
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("OTP Verification Error:", err);
      fireToast("OTP.FAILED", "error");

    } finally {
      setLoading(false);
    }
  };

  const handleOtpDigitChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otpDigits];
    newOtp[index] = value;
    setOtpDigits(newOtp);
    setOtp(newOtp.join(""));

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }

    if (error.general) setError({});
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError({});

    try {
      const response = await fetch(`${API_URL}/api/v1/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tempToken, // 🔥 ONLY THIS
        }),
      });

      const data = await response.json();

      if (!response.ok) {
       fireToast("OTP.RESEND_FAILED", "error");

        return;
      }

      // 🔥 VERY IMPORTANT — replace old token
      setTempToken(data.data?.tempToken);

      fireToast("OTP.RESENT", "success");

    } catch (err) {
      console.error("Resend OTP Error:", err);
      fireToast("OTP.RESEND_FAILED", "error");

    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    window.location.href = `${API_URL}/api/v1/auth/oauth/google/login`;
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
      <div style={styles.overlay} onClick={!loading ? handleClose : undefined}>
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
            {!showOTP ? (
              <>
                <div style={styles.header}>
                  <h1 style={styles.title}>Join us</h1>
                  <h2 style={styles.subtitle}>
                    Create a Carbon Positive account
                  </h2>
                </div>
                <p style={styles.description}>Be a part of our community</p>

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
                        if (!error.fullName)
                          e.target.style.borderColor = "#d1d5db";
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
                        if (!error.email)
                          e.target.style.borderColor = "#d1d5db";
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
                        if (!error.password)
                          e.target.style.borderColor = "#d1d5db";
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
                          fireToast("TERMS.OPENED", "info");
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
                          fireToast("PRIVACY.OPENED", "info");
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
                  <a style={styles.footerLink} onClick={handleSwitchToLogin}>
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

                {/* <div style={styles.infoBox}>
                  <p style={styles.infoText}>
                    ℹ️ After verification, your account will be active and you
                    can login.
                  </p>
                </div> */}

                {/* <input
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
                /> */}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  {otpDigits.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      disabled={loading}
                      onChange={(e) =>
                        handleOtpDigitChange(index, e.target.value)
                      }
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      style={{
                        width: "44px",
                        height: "52px",
                        textAlign: "center",
                        fontSize: "20px",
                        fontWeight: "600",
                        borderRadius: "8px",
                        border: error.general
                          ? "1px solid #dc2626"
                          : "1px solid #d1d5db",
                      }}
                    />
                  ))}
                </div>

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
                  {!canResend ? (
                    <p style={{ color: "#999", fontSize: "14px" }}>
                      Resend OTP in {otpTimer}s
                    </p>
                  ) : (
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
                    >
                      Resend OTP
                    </button>
                  )}
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
