'use client';

import { useState, useEffect } from 'react';
import "../styles/user/JoinOrganisation.css";

// Full country + states JSON ko ideally alag file se import karna chahiye.
// Abhi ke liye example ke taur pe structure dikhaya hai.
const countriesWithStates = [
  {
    name: "India",
    code: "IN",
    states: [
      "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
      "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
      "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
      "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
      "Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu and Kashmir",
      "Ladakh","Puducherry","Chandigarh","Andaman and Nicobar Islands",
      "Dadra and Nagar Haveli and Daman and Diu","Lakshadweep"
    ]
  },
  {
    name: "United States",
    code: "US",
    states: [
      "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
      "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
      "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
      "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada",
      "New Hampshire","New Jersey","New Mexico","New York","North Carolina",
      "North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island",
      "South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont",
      "Virginia","Washington","West Virginia","Wisconsin","Wyoming"
    ]
  },
  // ... yahan baaki sare countries ke entries aayenge (same structure)
];

// Full country+phone code list (all countries)
const phoneCountryCodes = [
  { name: "Afghanistan", dial_code: "+93", code: "AF" },
  { name: "Albania", dial_code: "+355", code: "AL" },
  { name: "Algeria", dial_code: "+213", code: "DZ" },
  { name: "Andorra", dial_code: "+376", code: "AD" },
  { name: "Angola", dial_code: "+244", code: "AO" },
  // ... baaki sab countries (same JSON structure)
  { name: "India", dial_code: "+91", code: "IN" },
  { name: "United States", dial_code: "+1", code: "US" },
  { name: "Canada", dial_code: "+1", code: "CA" },
  { name: "United Kingdom", dial_code: "+44", code: "GB" },
];

const dropdownArrowSvg = `data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231a5a3a' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e`;

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    organizationName: '',
    organizationType: '',
    organizationTypeOther: '',
    spocName: '',
    spocDesignation: '',
    phoneCode: '+91',
    phoneNumber: '',
    email: '',
    country: '',
    state: '',
    city: ''
  });

  
  const [emailVerified, setEmailVerified] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  // NEW: success message state (2 sec ke liye dikhana)
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (showOTP && timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
    if (timer === 0 && showOTP) {
      setCanResend(true);
    }
  }, [showOTP, timer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Country change hone pe state reset kar de
    if (name === 'country') {
      setFormData(prev => ({
        ...prev,
        country: value,
        state: '' // reset state
      }));
      if (errors.country) {
        setErrors(prev => ({ ...prev, country: '' }));
      }
      if (errors.state) {
        setErrors(prev => ({ ...prev, state: '' }));
      }
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(0, 1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleVerifyEmail = () => {
    if (!formData.email) {
      setErrors(prev => ({ ...prev, email: 'Email is required' }));
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email' }));
      return;
    }
    setShowOTP(true);
    setOtpError('');
    setOtpSuccess(false);
    setTimer(30);
    setCanResend(false);
  };

  const handleResendOtp = () => {
    setOtp(['', '', '', '', '', '']);
    setTimer(30);
    setCanResend(false);
    setOtpError('');
    setOtpSuccess(false);
  };

  const handleSubmitOtp = () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setOtpError('Please enter all 6 digits');
      return;
    }
    if (otpValue === '123456') {
      setOtpSuccess(true);
      setOtpError('');
      setTimeout(() => {
        setEmailVerified(true);
        setShowOTP(false);
      }, 1500);
    } else {
      setOtpError('Invalid OTP. Please try again.');
      setOtp(['', '', '', '', '', '']);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.organizationName.trim()) newErrors.organizationName = 'Organization name is required';
    if (!formData.organizationType) newErrors.organizationType = 'Organization type is required';
    if (formData.organizationType === 'others' && !formData.organizationTypeOther.trim()) {
      newErrors.organizationTypeOther = 'Please specify organization type';
    }
    if (!formData.spocName.trim()) newErrors.spocName = 'SPOC name is required';
    if (!formData.spocDesignation.trim()) newErrors.spocDesignation = 'Designation is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!emailVerified) newErrors.email = 'Email verification required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', formData);
      
      // NEW: 2 sec toast + page close / redirect
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        // agar yeh page modal hai to close logic yahan daalo,
        // abhi ke liye home pe redirect:
        window.location.href = '/';
      }, 2000);
    }
  };

  // success step ko remove karke, sirf toast + redirect use kar rahe hain
  // isliye step === 'success' wala block hata diya gaya.

  // selected country ka states list
  const selectedCountryObj = countriesWithStates.find(
    c => c.name === formData.country
  );
  const statesForSelectedCountry = selectedCountryObj ? selectedCountryObj.states : [];

  return (
    <div className="register-container">
      {/* Global Toast */}
      {showToast && (
        <div className="toast-overlay">
          <div className="toast-box">
            Registration form submitted successfully
          </div>
        </div>
      )}

      {/* Header */}
      <div className="register-header">
        <div className="header-content">
          <div>
            <h1 className="header-title">Join as Organization</h1>
            <p className="header-subtitle">Begin your verified carbon-positive journey</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-grid">
          {/* Left Panel - Form */}
          <div className="left-panel">
            <form onSubmit={handleSubmit} className="form-container">
              {/* Organization Name */}
              <div className="form-group">
                <label className="form-label">Organization Name</label>
                <input
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleInputChange}
                  placeholder="Enter organization name"
                  className={`form-input ${errors.organizationName ? 'input-error' : ''}`}
                />
                {errors.organizationName && <p className="error-text">⚠ {errors.organizationName}</p>}
              </div>

              {/* Organization Type */}
              <div className="form-group">
                <label className="form-label">Type of Organization</label>
                <select
                  name="organizationType"
                  value={formData.organizationType}
                  onChange={handleInputChange}
                  className={`form-select ${errors.organizationType ? 'input-error' : ''}`}
                  style={{ backgroundImage: `url("${dropdownArrowSvg}")` }}
                >
                  <option value="">Select organization type</option>
                  <option value="startup">Startup</option>
                  <option value="ngo">NGO</option>
                  <option value="government">Government</option>
                  <option value="educational">Educational</option>
                  <option value="cooperative">Cooperative</option>
                  <option value="mnc">MNC</option>
                  <option value="others">Others</option>
                </select>
                {errors.organizationType && <p className="error-text">⚠ {errors.organizationType}</p>}
              </div>

              {/* Conditional: Other Type */}
              {formData.organizationType === 'others' && (
                <div className="form-group conditional-group">
                  <label className="form-label">Specify Organization Type</label>
                  <input
                    type="text"
                    name="organizationTypeOther"
                    value={formData.organizationTypeOther}
                    onChange={handleInputChange}
                    placeholder="Please specify"
                    className={`form-input ${errors.organizationTypeOther ? 'input-error' : ''}`}
                  />
                  {errors.organizationTypeOther && <p className="error-text">⚠ {errors.organizationTypeOther}</p>}
                </div>
              )}

              {/* SPOC Name */}
              <div className="form-group">
                <label className="form-label">SPOC Person Name</label>
                <input
                  type="text"
                  name="spocName"
                  value={formData.spocName}
                  onChange={handleInputChange}
                  placeholder="Enter single point of contact name"
                  className={`form-input ${errors.spocName ? 'input-error' : ''}`}
                />
                {errors.spocName && <p className="error-text">⚠ {errors.spocName}</p>}
              </div>

              {/* SPOC Designation */}
              <div className="form-group">
                <label className="form-label">SPOC Designation</label>
                <input
                  type="text"
                  name="spocDesignation"
                  value={formData.spocDesignation}
                  onChange={handleInputChange}
                  placeholder="e.g., Manager, Director, Coordinator"
                  className={`form-input ${errors.spocDesignation ? 'input-error' : ''}`}
                />
                {errors.spocDesignation && <p className="error-text">⚠ {errors.spocDesignation}</p>}
              </div>

              {/* Phone Number */}
              <div className="form-group">
                <label className="form-label">SPOC Phone Number</label>
                <div className="phone-group">
                  <select
                    name="phoneCode"
                    value={formData.phoneCode}
                    onChange={handleInputChange}
                    className="form-select country-code-select"
                    style={{ backgroundImage: `url("${dropdownArrowSvg}")` }}
                  >
                    {phoneCountryCodes.map(cc => (
                      <option key={cc.code + cc.dial_code} value={cc.dial_code}>
                        {cc.name} ({cc.dial_code})
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="Phone number"
                    className={`form-input phone-input ${errors.phoneNumber ? 'input-error' : ''}`}
                  />
                </div>
                {errors.phoneNumber && <p className="error-text">⚠ {errors.phoneNumber}</p>}
              </div>

              {/* Email with Verification */}
              <div className="form-group">
                <label className="form-label">SPOC Email</label>
                <div className="email-group">
                  <div className="email-input-wrapper">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={emailVerified}
                      placeholder="Enter email address"
                      className={`form-input ${errors.email && !emailVerified ? 'input-error' : ''} ${emailVerified ? 'verified' : ''}`}
                    />
                    {emailVerified && <span className="verified-icon">✓</span>}
                  </div>
                  <button
                    type="button"
                    onClick={handleVerifyEmail}
                    disabled={emailVerified || !formData.email}
                    className={`verify-button ${emailVerified ? 'verified' : ''}`}
                  >
                    {emailVerified ? 'Verified' : 'Verify'}
                  </button>
                </div>
                {errors.email && !emailVerified && <p className="error-text">⚠ {errors.email}</p>}
              </div>

              {/* OTP Section */}
              {showOTP && (
                <div className="otp-container">
                  <h3 className="otp-title">Enter OTP</h3>
                  <p className="otp-subtitle">A 6-digit code has been sent to your email</p>

                  <div className="otp-grid">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        className={`otp-input ${otpError ? 'otp-error' : ''}`}
                      />
                    ))}
                  </div>

                  {otpSuccess && <p className="otp-success">✓ OTP Verified Successfully!</p>}
                  {otpError && <p className="otp-error-text">⚠ {otpError}</p>}

                  <div className="otp-button-group">
                    <button
                      type="button"
                      onClick={handleSubmitOtp}
                      disabled={otpSuccess}
                      className={`otp-submit-button ${otpSuccess ? 'verified' : ''}`}
                    >
                      {otpSuccess ? 'Verified' : 'Submit OTP'}
                    </button>
                  </div>

                  <div className="otp-resend">
                    {canResend ? (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="resend-button"
                      >
                        Resend OTP
                      </button>
                    ) : (
                      <p className="resend-timer">Resend OTP in {timer}s</p>
                    )}
                  </div>
                </div>
              )}

              {/* Country */}
              <div className="form-group">
                <label className="form-label">Country</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className={`form-select ${errors.country ? 'input-error' : ''}`}
                  style={{ backgroundImage: `url("${dropdownArrowSvg}")` }}
                >
                  <option value="">Select country</option>
                  {countriesWithStates
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map(country => (
                      <option key={country.code} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                </select>
                {errors.country && <p className="error-text">⚠ {errors.country}</p>}
              </div>

              {/* State */}
              <div className="form-group">
                <label className="form-label">State/Province</label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  disabled={!formData.country}
                  className={`form-select ${errors.state ? 'input-error' : ''} ${!formData.country ? 'disabled' : ''}`}
                  style={{ backgroundImage: !formData.country ? 'none' : `url("${dropdownArrowSvg}")` }}
                >
                  <option value="">Select state/province</option>
                  {statesForSelectedCountry.map(state => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                {errors.state && <p className="error-text">⚠ {errors.state}</p>}
              </div>

              {/* City */}
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Enter city name"
                  className={`form-input ${errors.city ? 'input-error' : ''}`}
                />
                {errors.city && <p className="error-text">⚠ {errors.city}</p>}
              </div>

              {/* Submit Button */}
              <button type="submit" className="submit-button">
                Submit
              </button>
            </form>
          </div>

          {/* Right Panel - Content */}
          <div className="right-panel">
            <div className="right-content">
              <h2 className="right-title">Go Carbon Positive</h2>
              <p className="right-description">
                Join thousands of organizations making a positive environmental impact while growing your business sustainably.
              </p>

              <div className="benefits-grid">
                <div className="benefit-card">
                  <div className="benefit-icon">♻️</div>
                  <h3 className="benefit-title">Carbon Neutral Operations</h3>
                  <p className="benefit-text">Achieve complete carbon neutrality with our integrated sustainability solutions.</p>
                </div>

                <div className="benefit-card">
                  <div className="benefit-icon">🌱</div>
                  <h3 className="benefit-title">Sustainable Growth</h3>
                  <p className="benefit-text">Build your business while protecting our planet for future generations.</p>
                </div>

                <div className="benefit-card">
                  <div className="benefit-icon">🌍</div>
                  <h3 className="benefit-title">Global Community</h3>
                  <p className="benefit-text">Connect with organizations worldwide committed to environmental responsibility.</p>
                </div>
              </div>

              <div className="stats-card">
                <p className="stat">✓ Over 500+ organizations registered</p>
                <p className="stat">✓ 10M+ tonnes of CO₂ offset</p>
                <p className="stat">✓ 25+ countries represented</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
