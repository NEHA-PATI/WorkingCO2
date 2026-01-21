'use client';

import { useState, useEffect, useRef } from 'react';
import { Country, State } from 'country-state-city';
import "../styles/user/JoinOrganisation.css";

const dropdownArrowSvg =
  `data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231a5a3a' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e`;

function useOutsideClick(ref, handler) {
  useEffect(() => {
    const listener = (e) => {
      if (!ref.current || ref.current.contains(e.target)) return;
      handler();
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

function CustomDropdown({ label, placeholder, options, value, onChange, error, disabled }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useOutsideClick(containerRef, () => setOpen(false));

  const selected = options.find(opt => opt.value === value);

  const handleSelect = (opt) => {
    if (disabled) return;
    onChange(opt.value);
    setOpen(false);
  };

  return (
    <div className="join-org-form-group">
      {label && <label className="join-org-form-label">{label}</label>}
      <div
        ref={containerRef}
        className={
          `join-org-custom-dropdown` +
          (disabled ? ' join-org-custom-dropdown-disabled' : '') +
          (error ? ' join-org-custom-dropdown-error' : '')
        }
      >
        <button
          type="button"
          className="join-org-custom-dropdown-trigger"
          onClick={() => !disabled && setOpen(o => !o)}
        >
          <span
            className={
              `join-org-custom-dropdown-text` +
              (!selected ? ' join-org-placeholder' : '')
            }
          >
            {selected ? selected.label : placeholder}
          </span>
          <span
            className="join-org-custom-dropdown-icon"
            style={{ backgroundImage: `url("${dropdownArrowSvg}")` }}
          />
        </button>

        {open && (
          <div className="join-org-custom-dropdown-menu">
            {options.length === 0 && (
              <div className="join-org-custom-dropdown-option join-org-custom-dropdown-option-disabled">
                No options
              </div>
            )}
            {options.map(opt => (
              <div
                key={opt.value}
                className={
                  `join-org-custom-dropdown-option` +
                  (opt.value === value ? ' join-org-selected' : '')
                }
                onClick={() => handleSelect(opt)}
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>
      {error && <p className="join-org-error-text">⚠ {error}</p>}
    </div>
  );
}

export default function JoinOrganisation() {
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
    countryName: '',
    state: '',
    stateName: '',
    city: ''
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  const [emailVerified, setEmailVerified] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);

    const india = allCountries.find(c => c.isoCode === 'IN');
    if (india) {
      setFormData(prev => ({
        ...prev,
        phoneCode: `+${india.phonecode}`
      }));
    }
  }, []);

  useEffect(() => {
    if (showOTP && timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
    if (timer === 0 && showOTP) {
      setCanResend(true);
    }
  }, [showOTP, timer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCountryChange = (isoCode) => {
    const selectedCountry = countries.find(c => c.isoCode === isoCode);

    setFormData(prev => ({
      ...prev,
      country: isoCode,
      countryName: selectedCountry?.name || '',
      state: '',
      stateName: '',
      phoneCode: selectedCountry ? `+${selectedCountry.phonecode}` : prev.phoneCode
    }));

    if (errors.country) setErrors(prev => ({ ...prev, country: '' }));
    if (errors.state) setErrors(prev => ({ ...prev, state: '' }));

    if (isoCode) {
      const countryStates = State.getStatesOfCountry(isoCode) || [];
      setStates(countryStates);
    } else {
      setStates([]);
    }
  };

  const handleStateChange = (stateCode) => {
    const selectedState = states.find(s => s.isoCode === stateCode);

    setFormData(prev => ({
      ...prev,
      state: stateCode,
      stateName: selectedState?.name || ''
    }));

    if (errors.state) setErrors(prev => ({ ...prev, state: '' }));
  };

  const handlePhoneCodeChange = (code) => {
    setFormData(prev => ({ ...prev, phoneCode: code }));
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
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        window.location.href = '/';
      }, 2000);
    }
  };

  const countryOptions = countries
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(c => ({ value: c.isoCode, label: c.name }));

  const stateOptions = states
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(s => ({ value: s.isoCode, label: s.name }));

  const phoneCodeOptions = countries
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(c => ({
      value: `+${c.phonecode}`,
      label: `${c.name} (+${c.phonecode})`
    }));

  const orgTypeOptions = [
    { value: '', label: 'Select organization type' },
    { value: 'startup', label: 'Startup' },
    { value: 'ngo', label: 'NGO' },
    { value: 'government', label: 'Government' },
    { value: 'educational', label: 'Educational' },
    { value: 'cooperative', label: 'Cooperative' },
    { value: 'mnc', label: 'MNC' },
    { value: 'others', label: 'Others' },
  ];

  return (
    <div className="join-org-root">
      {showToast && (
        <div className="join-org-toast-overlay">
          <div className="join-org-toast-box">
            Registration form submitted successfully
          </div>
        </div>
      )}

      <header className="join-org-header">
        <div className="join-org-header-content">
          <div>
            <h1 className="join-org-header-title">Join as Organization</h1>
            <p className="join-org-header-subtitle">Begin your verified carbon-positive journey</p>
          </div>
        </div>
      </header>

      <main className="join-org-main">
        <div className="join-org-main-content">
          <div className="join-org-content-grid">
            <div className="join-org-left-panel">
              <form onSubmit={handleSubmit} className="join-org-form-container">
                <div className="join-org-form-group">
                  <label className="join-org-form-label">Organization Name</label>
                  <input
                    type="text"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleChange}
                    placeholder="Enter organization name"
                    className={
                      `join-org-form-input` +
                      (errors.organizationName ? ' join-org-input-error' : '')
                    }
                  />
                  {errors.organizationName && (
                    <p className="join-org-error-text">⚠ {errors.organizationName}</p>
                  )}
                </div>

                <CustomDropdown
                  label="Type of Organization"
                  placeholder="Select organization type"
                  options={orgTypeOptions.slice(1)}
                  value={formData.organizationType}
                  onChange={(val) => {
                    setFormData(prev => ({ ...prev, organizationType: val }));
                    setErrors(prev => ({ ...prev, organizationType: '' }));
                  }}
                  error={errors.organizationType}
                  disabled={false}
                />

                {formData.organizationType === 'others' && (
                  <div className="join-org-form-group join-org-conditional-group">
                    <label className="join-org-form-label">Specify Organization Type</label>
                    <input
                      type="text"
                      name="organizationTypeOther"
                      value={formData.organizationTypeOther}
                      onChange={handleChange}
                      placeholder="Please specify"
                      className={
                        `join-org-form-input` +
                        (errors.organizationTypeOther ? ' join-org-input-error' : '')
                      }
                    />
                    {errors.organizationTypeOther && (
                      <p className="join-org-error-text">⚠ {errors.organizationTypeOther}</p>
                    )}
                  </div>
                )}

                <div className="join-org-form-group">
                  <label className="join-org-form-label">SPOC Person Name</label>
                  <input
                    type="text"
                    name="spocName"
                    value={formData.spocName}
                    onChange={handleChange}
                    placeholder="Enter single point of contact name"
                    className={
                      `join-org-form-input` +
                      (errors.spocName ? ' join-org-input-error' : '')
                    }
                  />
                  {errors.spocName && (
                    <p className="join-org-error-text">⚠ {errors.spocName}</p>
                  )}
                </div>

                <div className="join-org-form-group">
                  <label className="join-org-form-label">SPOC Designation</label>
                  <input
                    type="text"
                    name="spocDesignation"
                    value={formData.spocDesignation}
                    onChange={handleChange}
                    placeholder="e.g., Manager, Director, Coordinator"
                    className={
                      `join-org-form-input` +
                      (errors.spocDesignation ? ' join-org-input-error' : '')
                    }
                  />
                  {errors.spocDesignation && (
                    <p className="join-org-error-text">⚠ {errors.spocDesignation}</p>
                  )}
                </div>

                <div className="join-org-form-group">
                  <label className="join-org-form-label">SPOC Phone Number</label>
                  <div className="join-org-phone-group">
                    <div className="join-org-phone-code-wrapper">
                      <CustomDropdown
                        label=""
                        placeholder="Select code"
                        options={phoneCodeOptions}
                        value={formData.phoneCode}
                        onChange={handlePhoneCodeChange}
                        error={null}
                        disabled={false}
                      />
                    </div>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="Phone number"
                      className={
                        `join-org-form-input join-org-phone-input` +
                        (errors.phoneNumber ? ' join-org-input-error' : '')
                      }
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="join-org-error-text">⚠ {errors.phoneNumber}</p>
                  )}
                </div>

                <div className="join-org-form-group">
                  <label className="join-org-form-label">SPOC Email</label>
                  <div className="join-org-email-group">
                    <div className="join-org-email-input-wrapper">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={emailVerified}
                        placeholder="Enter email address"
                        className={
                          `join-org-form-input` +
                          (errors.email && !emailVerified ? ' join-org-input-error' : '') +
                          (emailVerified ? ' join-org-verified' : '')
                        }
                      />
                      {emailVerified && <span className="join-org-verified-icon">✓</span>}
                    </div>
                    <button
                      type="button"
                      onClick={handleVerifyEmail}
                      disabled={emailVerified || !formData.email}
                      className={
                        `join-org-verify-button` +
                        (emailVerified ? ' join-org-verify-button-verified' : '')
                      }
                    >
                      {emailVerified ? 'Verified' : 'Verify'}
                    </button>
                  </div>
                  {errors.email && !emailVerified && (
                    <p className="join-org-error-text">⚠ {errors.email}</p>
                  )}
                </div>

                {showOTP && (
                  <div className="join-org-otp-container">
                    <h3 className="join-org-otp-title">Enter OTP</h3>
                    <p className="join-org-otp-subtitle">
                      A 6-digit code has been sent to your email
                    </p>

                    <div className="join-org-otp-grid">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          inputMode="numeric"
                          maxLength="1"
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          className={
                            `join-org-otp-input` +
                            (otpError ? ' join-org-otp-input-error' : '')
                          }
                        />
                      ))}
                    </div>

                    {otpSuccess && (
                      <p className="join-org-otp-success">✓ OTP Verified Successfully!</p>
                    )}
                    {otpError && (
                      <p className="join-org-otp-error-text">⚠ {otpError}</p>
                    )}

                    <div className="join-org-otp-button-group">
                      <button
                        type="button"
                        onClick={handleSubmitOtp}
                        disabled={otpSuccess}
                        className={
                          `join-org-otp-submit-button` +
                          (otpSuccess ? ' join-org-otp-submit-button-verified' : '')
                        }
                      >
                        {otpSuccess ? 'Verified' : 'Submit OTP'}
                      </button>
                    </div>

                    <div className="join-org-otp-resend">
                      {canResend ? (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          className="join-org-resend-button"
                        >
                          Resend OTP
                        </button>
                      ) : (
                        <p className="join-org-resend-timer">
                          Resend OTP in {timer}s
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <CustomDropdown
                  label="Country"
                  placeholder="Select country"
                  options={countryOptions}
                  value={formData.country}
                  onChange={handleCountryChange}
                  error={errors.country}
                  disabled={false}
                />

                <CustomDropdown
                  label="State/Province"
                  placeholder="Select state/province"
                  options={stateOptions}
                  value={formData.state}
                  onChange={handleStateChange}
                  error={errors.state}
                  disabled={!formData.country}
                />

                <div className="join-org-form-group">
                  <label className="join-org-form-label">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city name"
                    className={
                      `join-org-form-input` +
                      (errors.city ? ' join-org-input-error' : '')
                    }
                  />
                  {errors.city && (
                    <p className="join-org-error-text">⚠ {errors.city}</p>
                  )}
                </div>

                <button type="submit" className="join-org-submit-button">
                  Submit
                </button>
              </form>
            </div>

            <div className="join-org-right-panel">
              <div className="join-org-right-content">
                <h2 className="join-org-right-title">Go Carbon Positive</h2>
                <p className="join-org-right-description">
                  Join thousands of organizations making a positive environmental impact
                  while growing your business sustainably.
                </p>

                <div className="join-org-benefits-grid">
                  <div className="join-org-benefit-card">
                    <div className="join-org-benefit-icon">♻️</div>
                    <h3 className="join-org-benefit-title">Carbon Neutral Operations</h3>
                    <p className="join-org-benefit-text">
                      Achieve complete carbon neutrality with our integrated sustainability
                      solutions.
                    </p>
                  </div>

                  <div className="join-org-benefit-card">
                    <div className="join-org-benefit-icon">🌱</div>
                    <h3 className="join-org-benefit-title">Sustainable Growth</h3>
                    <p className="join-org-benefit-text">
                      Build your business while protecting our planet for future
                      generations.
                    </p>
                  </div>

                  <div className="join-org-benefit-card">
                    <div className="join-org-benefit-icon">🌍</div>
                    <h3 className="join-org-benefit-title">Global Community</h3>
                    <p className="join-org-benefit-text">
                      Connect with organizations worldwide committed to environmental
                      responsibility.
                    </p>
                  </div>
                </div>

                <div className="join-org-stats-card">
                  <p className="join-org-stat">✓ Over 500+ organizations registered</p>
                  <p className="join-org-stat">✓ 10M+ tonnes of CO₂ offset</p>
                  <p className="join-org-stat">✓ 25+ countries represented</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
