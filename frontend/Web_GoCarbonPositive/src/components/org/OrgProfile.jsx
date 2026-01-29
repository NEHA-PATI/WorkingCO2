import React, { useState, useMemo, useEffect } from "react";
import { ChevronDown, MapPin, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Country, State } from "country-state-city";
import "../../styles/user/UserProfile.css";

const UserProfile = () => {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(true);

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    countryCode: "+91",      // display dial code
    phoneCountryIso: "IN",   // phone dropdown selection
    phone: "",
    dob: "",
  });

  const [addresses, setAddresses] = useState([
    {
      id: "1",
      type: "home",
      typeSpecify: "",
      address: "",
      countryCode: "",   // ISO country code
      countryName: "",
      pincode: "",
      stateCode: "",
      stateName: "",
      city: "",
    },
  ]);

  const [showAddNewAddress, setShowAddNewAddress] = useState(false);

  // All countries for dropdowns
  const allCountries = useMemo(() => Country.getAllCountries(), []);

  const getStatesForCountry = (countryCode) =>
    State.getStatesOfCountry(countryCode) || [];

  const getDialCodeForIso = (iso) => {
    const c = allCountries.find((c) => c.isoCode === iso);
    return c ? `+${c.phonecode}` : formData.countryCode;
  };

  // Sync phone dropdown <-> dial code
  useEffect(() => {
    if (!formData.phoneCountryIso) return;
    const dial = getDialCodeForIso(formData.phoneCountryIso);
    setFormData((prev) => ({
      ...prev,
      countryCode: dial,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.phoneCountryIso, allCountries]);

  // Optionally sync with primary address country
  useEffect(() => {
    const addr = addresses[0];
    if (!addr.countryCode) return;
    const c = allCountries.find((c) => c.isoCode === addr.countryCode);
    if (!c) return;
    setFormData((prev) => ({
      ...prev,
      phoneCountryIso: addr.countryCode,
      countryCode: `+${c.phonecode}`,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addresses, allCountries]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (id, field, value) => {
    setAddresses((prev) =>
      prev.map((addr) => (addr.id === id ? { ...addr, [field]: value } : addr))
    );
  };

  const handlePincodeChange = (id, pincode) => {
    handleAddressChange(id, "pincode", pincode);
  };

  const handleCountrySelect = (id, isoCode) => {
    const countryObj = allCountries.find((c) => c.isoCode === isoCode);
    setAddresses((prev) =>
      prev.map((addr) =>
        addr.id === id
          ? {
              ...addr,
              countryCode: isoCode,
              countryName: countryObj?.name || "",
              stateCode: "",
              stateName: "",
              city: "",
            }
          : addr
      )
    );
  };

  const handleStateSelect = (id, stateIso) => {
    const addr = addresses.find((a) => a.id === id);
    if (!addr || !addr.countryCode) {
      handleAddressChange(id, "stateCode", stateIso);
      return;
    }
    const states = getStatesForCountry(addr.countryCode);
    const stateObj = states.find((s) => s.isoCode === stateIso);
    setAddresses((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              stateCode: stateIso,
              stateName: stateObj?.name || "",
              city: "",
            }
          : a
      )
    );
  };

  const handleAddNewAddress = () => {
    const newAddress = {
      id: Date.now().toString(),
      type: "office",
      typeSpecify: "",
      address: "",
      countryCode: "",
      countryName: "",
      pincode: "",
      stateCode: "",
      stateName: "",
      city: "",
    };
    setAddresses((prev) => [...prev, newAddress]);
    setShowAddNewAddress(false);
  };

  const handleRemoveAddress = (id) => {
    if (addresses.length > 1) {
      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    }
  };

  const primaryStates = useMemo(() => {
    if (!addresses[0].countryCode) return [];
    return getStatesForCountry(addresses[0].countryCode);
  }, [addresses]);

  const handleSaveChanges = () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      alert("Please fill first name, last name and email.");
      return;
    }
    if (!addresses[0].address || !addresses[0].countryCode) {
      alert("Please fill your primary address and country.");
      return;
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  return (
    <div className="up-wrapper">
      {/* Left Side - Scrollable area */}
      <div className="up-left-container">
        <div className="up-content-area">
          <div className="up-header">
            <h1 className="up-title">Your Profile</h1>
            <p className="up-subtitle">
              Update your personal details and address information
            </p>
          </div>

          {isEditing ? (
            <>
              {/* Personal Information Section */}
              <section className="up-section">
                <h2 className="up-section-title">
                  <span className="up-section-number">1</span>
                  Personal Information
                </h2>

                <div className="up-grid-two">
                  <div>
                    <label className="up-label">
                      First Name <span className="up-required">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="up-input"
                    />
                  </div>
                  <div>
                    <label className="up-label">Middle Name</label>
                    <input
                      type="text"
                      name="middleName"
                      placeholder="David"
                      value={formData.middleName}
                      onChange={handleInputChange}
                      className="up-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="up-label">
                    Last Name <span className="up-required">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Smith"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="up-input"
                  />
                </div>
              </section>

              {/* Contact Information Section */}
              <section className="up-section">
                <h2 className="up-section-title">
                  <span className="up-section-number">2</span>
                  Contact Information
                </h2>

                <div className="up-form-group">
                  <label className="up-label">
                    Email <span className="up-required">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="up-input"
                  />
                </div>

                <div className="up-form-group">
                  <label className="up-label">
                    Phone Number <span className="up-required">*</span>
                  </label>
                  <div className="up-phone-input-wrapper">
                    {/* Country code dropdown for phone */}
                    <select
                      name="phoneCountryIso"
                      value={formData.phoneCountryIso}
                      onChange={(e) => {
                        const iso = e.target.value;
                        const c = allCountries.find(
                          (c) => c.isoCode === iso
                        );
                        setFormData((prev) => ({
                          ...prev,
                          phoneCountryIso: iso,
                          countryCode: c
                            ? `+${c.phonecode}`
                            : prev.countryCode,
                        }));
                      }}
                      className="up-country-code-select"
                    >
                      {allCountries.map((c) => (
                        <option key={c.isoCode} value={c.isoCode}>
                          +{c.phonecode} ({c.name})
                        </option>
                      ))}
                    </select>

                    <input
                      type="tel"
                      name="phone"
                      placeholder="9876543210"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="up-input up-phone-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="up-label">
                    Date of Birth <span className="up-required">*</span>
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="up-input"
                  />
                </div>
              </section>

              {/* Address Information Section */}
              <section className="up-section">
                <h2 className="up-section-title">
                  <span className="up-section-number">3</span>
                  Address Information
                </h2>

                {/* Primary Address */}
                <AddressBlock
                  address={addresses[0]}
                  countries={allCountries}
                  states={primaryStates}
                  onAddressChange={handleAddressChange}
                  onPincodeChange={handlePincodeChange}
                  onCountrySelect={handleCountrySelect}
                  onStateSelect={handleStateSelect}
                  isPrimary={true}
                />

                {/* Additional Addresses */}
                {addresses.slice(1).map((address, index) => {
                  const statesForThis = getStatesForCountry(
                    address.countryCode
                  );
                  return (
                    <div key={address.id} className="up-additional-address">
                      <div className="up-address-header">
                        <h3 className="up-address-title">
                          Address {index + 2}
                        </h3>
                        <button
                          type="button"
                          onClick={() => handleRemoveAddress(address.id)}
                          className="up-remove-btn"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <AddressBlock
                        address={address}
                        countries={allCountries}
                        states={statesForThis}
                        onAddressChange={handleAddressChange}
                        onPincodeChange={handlePincodeChange}
                        onCountrySelect={handleCountrySelect}
                        onStateSelect={handleStateSelect}
                        isPrimary={false}
                      />
                    </div>
                  );
                })}

                {/* Add Another Address Button */}
                {!showAddNewAddress && (
                  <button
                    type="button"
                    onClick={() => setShowAddNewAddress(true)}
                    className="up-add-address-btn"
                  >
                    <Plus className="w-5 h-5" />
                    Add Another Address
                  </button>
                )}

                {showAddNewAddress && (
                  <button
                    type="button"
                    onClick={handleAddNewAddress}
                    className="up-confirm-add-btn"
                  >
                    <Plus className="w-5 h-5" />
                    Confirm Add Address
                  </button>
                )}
              </section>

              {/* Submit Button */}
              <div className="up-button-group">
                <button
                  type="button"
                  className="up-save-btn"
                  onClick={handleSaveChanges}
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  className="up-cancel-btn"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            // Summary card when not editing
            <div className="up-summary-card">
              <h2 className="up-summary-title">Profile Summary</h2>

              <div className="up-summary-section">
                <h3 className="up-summary-section-title">Personal</h3>
                <p>
                  <strong>Name: </strong>
                  {formData.firstName}{" "}
                  {formData.middleName && `${formData.middleName} `}{" "}
                  {formData.lastName}
                </p>
                <p>
                  <strong>Email: </strong>
                  {formData.email}
                </p>
                <p>
                  <strong>Phone: </strong>
                  {formData.countryCode} {formData.phone}
                </p>
                <p>
                  <strong>Date of Birth: </strong>
                  {formData.dob}
                </p>
              </div>

              <div className="up-summary-section">
                <h3 className="up-summary-section-title">Addresses</h3>
                {addresses.map((addr, idx) => (
                  <div key={addr.id} className="up-summary-address">
                    <p className="up-summary-address-title">
                      {idx === 0 ? "Primary Address" : `Address ${idx + 1}`}
                    </p>
                    <p>{addr.address}</p>
                    <p>
                      {addr.city && `${addr.city}, `}
                      {addr.stateName && `${addr.stateName}, `}
                      {addr.countryName}
                    </p>
                    {addr.pincode && <p>Pin Code: {addr.pincode}</p>}
                    {addr.type && <p>Type: {addr.type}</p>}
                  </div>
                ))}
              </div>

              <div className="up-button-group up-summary-buttons">
                <button
                  type="button"
                  className="up-save-btn"
                  onClick={handleEditProfile}
                >
                  Edit Profile
                </button>
                <button
                  type="button"
                  className="up-cancel-btn"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Sticky, not overlapping footer */}
      <div className="up-right-container">
        <div className="up-right-content">
          <div className="up-icon-wrapper">
            <div className="up-icon-circle">
              <MapPin className="w-12 h-12" strokeWidth={1.5} />
            </div>
            <div className="up-checkmark">✓</div>
          </div>

          <h2 className="up-right-title">Where You Belong</h2>
          <p className="up-right-subtitle">
            Your address is the foundation of your presence. Keep it accurate
            and let opportunities find you.
          </p>

          <div className="up-features-box">
            <div className="up-features-list">
              <div className="up-feature-item">
                <div className="up-feature-dot" />
                <p className="up-feature-text">
                  Manage multiple locations with ease
                </p>
              </div>
              <div className="up-feature-item">
                <div className="up-feature-dot" />
                <p className="up-feature-text">
                  Flexible address types for every need
                </p>
              </div>
              <div className="up-feature-item">
                <div className="up-feature-dot" />
                <p className="up-feature-text">
                  Global reach with local precision
                </p>
              </div>
            </div>
          </div>

          <div className="up-footer-text">
            <p>
              Complete information ensures smooth operations and reliable
              connections
            </p>
          </div>
        </div>

        <div className="up-decoration up-decoration-bottom" />
        <div className="up-decoration up-decoration-top" />
      </div>
    </div>
  );
};

function AddressBlock({
  address,
  countries,
  states,
  onAddressChange,
  onPincodeChange,
  onCountrySelect,
  onStateSelect,
  isPrimary,
}) {
  return (
    <div className="up-address-block">
      {isPrimary && (
        <div>
          <label className="up-label">
            Address Type <span className="up-required">*</span>
          </label>
          <div className="up-select-wrapper">
            <select
              value={address.type}
              onChange={(e) =>
                onAddressChange(address.id, "type", e.target.value)
              }
              className="up-select"
            >
              <option value="home">Home</option>
              <option value="office">Office</option>
              <option value="other">Other</option>
            </select>
            <ChevronDown className="up-select-icon" />
          </div>

          {address.type === "other" && (
            <input
              type="text"
              placeholder="Please specify"
              value={address.typeSpecify}
              onChange={(e) =>
                onAddressChange(address.id, "typeSpecify", e.target.value)
              }
              className="up-input up-input-specify"
            />
          )}
        </div>
      )}

      <div>
        <label className="up-label">
          Address <span className="up-required">*</span>
        </label>
        <textarea
          placeholder="Apartment name, lane, plot number, etc."
          value={address.address}
          onChange={(e) =>
            onAddressChange(address.id, "address", e.target.value)
          }
          className="up-textarea"
        />
      </div>

      <div>
        <label className="up-label">
          Country <span className="up-required">*</span>
        </label>
        <div className="up-select-wrapper">
          <select
            value={address.countryCode}
            onChange={(e) => onCountrySelect(address.id, e.target.value)}
            className="up-select"
          >
            <option value="">Select Country</option>
            {countries.map((c) => (
              <option key={c.isoCode} value={c.isoCode}>
                {c.name}
              </option>
            ))}
          </select>
          <ChevronDown className="up-select-icon" />
        </div>
      </div>

      <div>
        <label className="up-label">
          Pin Code <span className="up-required">*</span>
        </label>
        <input
          type="text"
          placeholder="Enter pin code"
          value={address.pincode}
          onChange={(e) => onPincodeChange(address.id, e.target.value)}
          className="up-input"
        />
      </div>

      {states.length > 0 && (
        <div>
          <label className="up-label">
            State <span className="up-required">*</span>
          </label>
          <div className="up-select-wrapper">
            <select
              value={address.stateCode}
              onChange={(e) => onStateSelect(address.id, e.target.value)}
              className="up-select"
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </option>
              ))}
            </select>
            <ChevronDown className="up-select-icon" />
          </div>
        </div>
      )}

      <div>
        <label className="up-label">
          City <span className="up-required">*</span>
        </label>
        <input
          type="text"
          placeholder="Enter city"
          value={address.city}
          onChange={(e) =>
            onAddressChange(address.id, "city", e.target.value)
          }
          className="up-input"
        />
      </div>
    </div>
  );
}

export default UserProfile;
