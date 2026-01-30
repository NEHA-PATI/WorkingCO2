import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import {
  FaBuilding,
  FaUniversity,
  FaCity,
  FaCheckCircle,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../styles/org/OrgProfile.css";

const OrgProfile = () => {
  const navigate = useNavigate();

  const [orgType, setOrgType] = useState("industry");
  const [idType, setIdType] = useState("PAN");
  const [idNumber, setIdNumber] = useState("");
  const [isIdVerified, setIsIdVerified] = useState(false);
  const [showIdOtp, setShowIdOtp] = useState(false);
  const [idOtp, setIdOtp] = useState("");
  const [idOtpTimer, setIdOtpTimer] = useState(0);

  const [dob, setDob] = useState("");
  const [orgName, setOrgName] = useState("");
  const [websiteProtocol, setWebsiteProtocol] = useState("https");
  const [websiteUrl, setWebsiteUrl] = useState("");

  const [country] = useState("India");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [fullAddress, setFullAddress] = useState("");

  const [email, setEmail] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showEmailOtp, setShowEmailOtp] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [emailOtpTimer, setEmailOtpTimer] = useState(0);

  // NEW: show summary vs form
  const [isEditing, setIsEditing] = useState(true);

  // ID OTP Timer
  useEffect(() => {
    if (idOtpTimer > 0) {
      const timer = setTimeout(() => setIdOtpTimer(idOtpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [idOtpTimer]);

  // Email OTP Timer
  useEffect(() => {
    if (emailOtpTimer > 0) {
      const timer = setTimeout(
        () => setEmailOtpTimer(emailOtpTimer - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [emailOtpTimer]);

  const handleVerifyId = () => {
    if (idNumber.trim()) {
      setShowIdOtp(true);
      setIdOtpTimer(30);
    }
  };

  const handleVerifyIdOtp = () => {
    if (idOtp.length === 6) {
      setIsIdVerified(true);
      setShowIdOtp(false);
      setIdOtp("");
      alert("ID verified successfully!");
    }
  };

  const handleResendIdOtp = () => {
    if (idOtpTimer === 0) {
      setIdOtpTimer(30);
      setIdOtp("");
    }
  };

  const handleVerifyEmail = () => {
    if (email.trim()) {
      setShowEmailOtp(true);
      setEmailOtpTimer(30);
    }
  };

  const handleVerifyEmailOtp = () => {
    if (emailOtp.length === 6) {
      setIsEmailVerified(true);
      setShowEmailOtp(false);
      setEmailOtp("");
      alert("Email verified successfully!");
    }
  };

  const handleResendEmailOtp = () => {
    if (emailOtpTimer === 0) {
      setEmailOtpTimer(30);
      setEmailOtp("");
    }
  };

  const handleUpdateProfile = () => {
    if (
      !idNumber ||
      !orgName ||
      !email ||
      !state ||
      !city ||
      !pinCode ||
      !fullAddress
    ) {
      alert("Please fill all required fields");
      return;
    }
    if (!isIdVerified || !isEmailVerified) {
      alert("Please verify ID and Email");
      return;
    }
    // Show summary card instead of form
    setIsEditing(false);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  // Helper: label from orgType
  const orgTypeLabel =
    orgType === "industry"
      ? "Industry & Private Sector"
      : orgType === "central"
      ? "Central Government"
      : "State Government";

  return (
    <div className="orgp-page-root">
      <div className="orgp-profile-container">
        {/* Left Side - Form / Summary (Scrollable only this section) */}
        <div className="orgp-form-section">
          {isEditing ? (
            <form className="orgp-form">
              {/* Organization Type */}
              <div className="orgp-form-group">
                <label className="orgp-form-label">
                  What's the type of your organization?
                </label>
                <div className="orgp-org-type-selector">
                  <button
                    type="button"
                    className={`orgp-org-type-btn ${
                      orgType === "industry" ? "orgp-active" : ""
                    }`}
                    onClick={() => setOrgType("industry")}
                  >
                    <FaBuilding className="orgp-org-icon" />
                    Industry & Private Sector
                  </button>
                  <button
                    type="button"
                    className={`orgp-org-type-btn ${
                      orgType === "central" ? "orgp-active" : ""
                    }`}
                    onClick={() => setOrgType("central")}
                  >
                    <FaUniversity className="orgp-org-icon" />
                    Central Government
                  </button>
                  <button
                    type="button"
                    className={`orgp-org-type-btn ${
                      orgType === "state" ? "orgp-active" : ""
                    }`}
                    onClick={() => setOrgType("state")}
                  >
                    <FaCity className="orgp-org-icon" />
                    State Government
                  </button>
                </div>
              </div>

              {/* Select ID */}
              <div className="orgp-form-group">
                <label className="orgp-form-label">Select ID*</label>
                <div className="orgp-select-wrapper">
                  <select
                    value={idType}
                    onChange={(e) => setIdType(e.target.value)}
                    className="orgp-form-select"
                  >
                    <option value="PAN">PAN</option>
                    <option value="TAN">TAN</option>
                    <option value="GSTIN">GSTIN</option>
                  </select>
                  <ChevronDown className="orgp-select-icon" size={18} />
                </div>
              </div>

              {/* ID Number */}
              <div className="orgp-form-group">
                <label className="orgp-form-label">{idType}*</label>
                <div className="orgp-input-with-button">
                  <input
                    type="text"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    placeholder={`Enter ${idType}`}
                    className="orgp-form-input"
                    disabled={isIdVerified}
                  />
                  <button
                    type="button"
                    onClick={handleVerifyId}
                    disabled={isIdVerified || !idNumber}
                    className={`orgp-verify-btn ${
                      isIdVerified ? "orgp-verified" : ""
                    }`}
                  >
                    {isIdVerified ? "✓ Verified" : "Verify"}
                  </button>
                </div>
              </div>

              {/* ID OTP Section */}
              {showIdOtp && (
                <div className="orgp-otp-section">
                  <label className="orgp-form-label">
                    Enter 6-digit OTP*
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={idOtp}
                    onChange={(e) =>
                      setIdOtp(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="000000"
                    className="orgp-form-input orgp-otp-input"
                  />
                  <div className="orgp-otp-actions">
                    <button
                      type="button"
                      onClick={handleVerifyIdOtp}
                      disabled={idOtp.length !== 6}
                      className="orgp-verify-btn"
                    >
                      Verify OTP
                    </button>
                    <button
                      type="button"
                      onClick={handleResendIdOtp}
                      disabled={idOtpTimer > 0}
                      className="orgp-resend-btn"
                    >
                      {idOtpTimer > 0
                        ? `Resend in ${idOtpTimer}s`
                        : "Resend OTP"}
                    </button>
                  </div>
                </div>
              )}

              {/* Date of Incorporation */}
              <div className="orgp-form-group">
                <label className="orgp-form-label">
                  Date of Incorporation (DOI)*
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="orgp-form-input"
                />
              </div>

              {/* Organization Name */}
              <div className="orgp-form-group">
                <label className="orgp-form-label">Organization Name*</label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="Enter organization name"
                  className="orgp-form-input"
                />
              </div>

              {/* Website URL */}
              <div className="orgp-form-group">
                <label className="orgp-form-label">
                  Organization Website URL*
                </label>
                <div className="orgp-website-input">
                  <div className="orgp-select-wrapper">
                    <select
                      value={websiteProtocol}
                      onChange={(e) => setWebsiteProtocol(e.target.value)}
                      className="orgp-form-select"
                    >
                      <option value="http">http</option>
                      <option value="https">https</option>
                      <option value="ssh">ssh</option>
                    </select>
                    <ChevronDown className="orgp-select-icon" size={18} />
                  </div>
                  <input
                    type="text"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="www.example.com"
                    className="orgp-form-input"
                  />
                </div>
              </div>

              {/* Address Section */}
              <div className="orgp-form-group">
                <label className="orgp-form-label">Address*</label>

                <div className="orgp-address-grid">
                  <div>
                    <label className="orgp-form-label orgp-small">
                      Country
                    </label>
                    <input
                      type="text"
                      value={country}
                      readOnly
                      className="orgp-form-input"
                    />
                  </div>
                  <div>
                    <label className="orgp-form-label orgp-small">
                      State*
                    </label>
                    <div className="orgp-select-wrapper">
                      <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="orgp-form-select"
                      >
                        <option value="">Select State</option>
                        <option value="Odisha">Odisha</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                      </select>
                      <ChevronDown className="orgp-select-icon" size={18} />
                    </div>
                  </div>
                </div>

                <div className="orgp-address-grid">
                  <div>
                    <label className="orgp-form-label orgp-small">
                      City*
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Enter city"
                      className="orgp-form-input"
                    />
                  </div>
                  <div>
                    <label className="orgp-form-label orgp-small">
                      Pin Code*
                    </label>
                    <input
                      type="text"
                      value={pinCode}
                      onChange={(e) =>
                        setPinCode(
                          e.target.value.replace(/\D/g, "").slice(0, 6)
                        )
                      }
                      placeholder="000000"
                      className="orgp-form-input"
                    />
                  </div>
                </div>

                <div className="orgp-full-address-block">
                  <label className="orgp-form-label orgp-small">
                    Full Address*
                  </label>
                  <textarea
                    value={fullAddress}
                    onChange={(e) => setFullAddress(e.target.value)}
                    placeholder="Enter full address"
                    className="orgp-form-input orgp-textarea"
                    rows={3}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="orgp-form-group">
                <label className="orgp-form-label">
                  Official Domain's Email*
                </label>
                <div className="orgp-input-with-button">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter official email"
                    className="orgp-form-input"
                    disabled={isEmailVerified}
                  />
                  <button
                    type="button"
                    onClick={handleVerifyEmail}
                    disabled={isEmailVerified || !email}
                    className={`orgp-verify-btn ${
                      isEmailVerified ? "orgp-verified" : ""
                    }`}
                  >
                    {isEmailVerified ? "✓ Verified" : "Verify Email"}
                  </button>
                </div>
                <p className="orgp-help-text">
                  Please enter your official organization email address.
                </p>
              </div>

              {/* Email OTP Section */}
              {showEmailOtp && (
                <div className="orgp-otp-section">
                  <label className="orgp-form-label">
                    Enter 6-digit OTP*
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={emailOtp}
                    onChange={(e) =>
                      setEmailOtp(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="000000"
                    className="orgp-form-input orgp-otp-input"
                  />
                  <div className="orgp-otp-actions">
                    <button
                      type="button"
                      onClick={handleVerifyEmailOtp}
                      disabled={emailOtp.length !== 6}
                      className="orgp-verify-btn"
                    >
                      Verify OTP
                    </button>
                    <button
                      type="button"
                      onClick={handleResendEmailOtp}
                      disabled={emailOtpTimer > 0}
                      className="orgp-resend-btn"
                    >
                      {emailOtpTimer > 0
                        ? `Resend in ${emailOtpTimer}s`
                        : "Resend OTP"}
                    </button>
                  </div>
                </div>
              )}

              {/* Update / Cancel Buttons */}
              <div className="orgp-button-group">
                <button
                  type="button"
                  onClick={handleUpdateProfile}
                  className="orgp-update-btn"
                >
                  Update Profile
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="orgp-cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            // Summary card after update
            <div className="orgp-summary-card">
              <div className="orgp-summary-header">
                <div className="orgp-summary-badge">Organization Profile</div>
                <h2 className="orgp-summary-title">{orgName}</h2>
                <p className="orgp-summary-subtitle">{orgTypeLabel}</p>
              </div>

              <div className="orgp-summary-section">
                <h3 className="orgp-summary-section-title">Registration</h3>
                <p>
                  <span className="orgp-summary-label">ID Type</span>
                  <span className="orgp-summary-value">
                    {idType} {isIdVerified && "• Verified"}
                  </span>
                </p>
                <p>
                  <span className="orgp-summary-label">ID Number</span>
                  <span className="orgp-summary-value">{idNumber}</span>
                </p>
                <p>
                  <span className="orgp-summary-label">DOI</span>
                  <span className="orgp-summary-value">{dob}</span>
                </p>
              </div>

              <div className="orgp-summary-section">
                <h3 className="orgp-summary-section-title">Contact</h3>
                <p>
                  <span className="orgp-summary-label">Website</span>
                  <span className="orgp-summary-value">
                    {websiteProtocol}://{websiteUrl}
                  </span>
                </p>
                <p>
                  <span className="orgp-summary-label">Email</span>
                  <span className="orgp-summary-value">
                    {email} {isEmailVerified && "• Verified"}
                  </span>
                </p>
              </div>

              <div className="orgp-summary-section">
                <h3 className="orgp-summary-section-title">Address</h3>
                <div className="orgp-summary-address">
                  <p className="orgp-summary-address-line">{fullAddress}</p>
                  <p className="orgp-summary-address-line">
                    {city}, {state}, {country} - {pinCode}
                  </p>
                </div>
              </div>

              <div className="orgp-summary-buttons">
                <button
                  type="button"
                  className="orgp-edit-btn"
                  onClick={handleEditProfile}
                >
                  Edit Profile
                </button>
                <button
                  type="button"
                  className="orgp-cancel-btn"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Tagline (Fixed / Non-scrollable) */}
        <div className="orgp-tagline-section">
          <div className="orgp-tagline-content">
            <FaMapMarkerAlt className="orgp-tagline-icon" />
            <h2>Complete Your Profile</h2>
            <p>
              To complete the process, please provide all the required
              information about your organization. This helps serve you better
              and ensure secure transactions.
            </p>
            <div className="orgp-tagline-features">
              <div className="orgp-feature">
                <FaCheckCircle className="orgp-feature-icon" />
                <span>Secure & Verified</span>
              </div>
              <div className="orgp-feature">
                <FaCheckCircle className="orgp-feature-icon" />
                <span>Professional Setup</span>
              </div>
              <div className="orgp-feature">
                <FaCheckCircle className="orgp-feature-icon" />
                <span>Address Validated</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OrgProfile;
