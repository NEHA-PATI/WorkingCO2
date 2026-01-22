import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaHome,
  FaGlobe,
} from "react-icons/fa";
import "../styles/user/profile.css";

export default function ProfileSetup() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+91",
    phone: "",
    dob: "",
    addresses: [
      { street: "", apt: "", city: "", state: "", zip: "", country: "" },
    ],
  });

  const handleChange = (e, index, isAddress = false) => {
    if (isAddress) {
      const updatedAddresses = [...formData.addresses];
      updatedAddresses[index][e.target.name] = e.target.value;
      setFormData({ ...formData, addresses: updatedAddresses });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const nextStep = () => {
    const { firstName, lastName, email, phone, dob } = formData;
    if (firstName && lastName && email && phone && dob) {
      setStep(2);
    } else {
      alert("Please fill in all personal information fields before continuing.");
    }
  };

  const prevStep = () => setStep(1);

  const addAnotherAddress = () => {
    setFormData({
      ...formData,
      addresses: [
        ...formData.addresses,
        { street: "", apt: "", city: "", state: "", zip: "", country: "" },
      ],
    });
  };

  return (
    <div className="profile-container">
      {/* Step Indicator */}
      <div className="step-indicator">
        <div className={`circle ${step === 1 ? "active" : ""}`}>1</div>
        <div className="line"></div>
        <div className={`circle ${step === 2 ? "active" : ""}`}>2</div>
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="form-card">
          <FaUser className="form-icon-big" />
          <h2>Personal Information</h2>
          <p>Please provide your personal details to continue</p>

          <div className="form-row">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>

          <div className="form-row icon-input">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* ✅ PHONE WITH COUNTRY CODE */}
          <div className="phone-group">
            <FaPhone className="input-icon phone-icon" />

            <select
              name="countryCode"
              value={formData.countryCode}
              onChange={handleChange}
              className="country-code"
            >
              <option value="+91">🇮🇳 +91</option>
              <option value="+1">🇺🇸 +1</option>
              <option value="+44">🇬🇧 +44</option>
              <option value="+61">🇦🇺 +61</option>
              <option value="+81">🇯🇵 +81</option>
            </select>

            <input
              type="tel"
              name="phone"
              placeholder="Mobile Number"
              value={formData.phone}
              onChange={handleChange}
              className="phone-input"
            />
          </div>

          <div className="form-row icon-input">
            <FaCalendarAlt className="input-icon" />
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
            />
          </div>

          <button className="btn" onClick={nextStep}>
            Continue to Address
          </button>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="form-card">
          <FaHome className="form-icon-big" />
          <h2>Address Information</h2>
          <p>Complete your profile with address details</p>

          {formData.addresses.map((address, index) => (
            <div key={index} className="address-block">
              <input
                type="text"
                name="street"
                placeholder="Street Address"
                value={address.street}
                onChange={(e) => handleChange(e, index, true)}
              />
              <input
                type="text"
                name="apt"
                placeholder="Apartment/Suite (Optional)"
                value={address.apt}
                onChange={(e) => handleChange(e, index, true)}
              />

              <div className="form-row">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={address.city}
                  onChange={(e) => handleChange(e, index, true)}
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State/Province"
                  value={address.state}
                  onChange={(e) => handleChange(e, index, true)}
                />
              </div>

              <div className="form-row">
                <input
                  type="text"
                  name="zip"
                  placeholder="ZIP/Postal Code"
                  value={address.zip}
                  onChange={(e) => handleChange(e, index, true)}
                />
                <div className="form-row icon-input">
                  <FaGlobe className="input-icon" />
                  <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={address.country}
                    onChange={(e) => handleChange(e, index, true)}
                  />
                </div>
              </div>
            </div>
          ))}

          <button className="btn-secondary small-btn" onClick={addAnotherAddress}>
            + Add Another Address
          </button>

          <div className="form-actions">
            <button className="btn-secondary small-btn" onClick={prevStep}>
              Back to Profile
            </button>
            <button
              className="btn small-btn"
              onClick={() => alert("Profile Setup Complete!")}
            >
              Complete Setup
            </button>
          </div>

          <p className="info-text">
            Your information is secure and will not be shared
          </p>
        </div>
      )}
    </div>
  );
}
