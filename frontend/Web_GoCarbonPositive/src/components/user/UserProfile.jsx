import React, { useState, useMemo, useEffect } from "react";
import { ChevronDown, MapPin, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Country, State } from "country-state-city";
import "../../styles/user/UserProfile.css";
import { fireToast } from "../../services/user/toastService.js";

const UserProfile = () => {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(true);
const [loading, setLoading] = useState(true);

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
      id: null,
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
  const addr = addresses?.[0];
  if (!addr || !addr.countryCode) return;

  const c = allCountries.find((c) => c.isoCode === addr.countryCode);
  if (!c) return;

  setFormData((prev) => ({
    ...prev,
    phoneCountryIso: addr.countryCode,
    countryCode: `+${c.phonecode}`,
  }));
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
    type: "work", // ✅ MUST match DB constraint
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
  if (!addresses?.length || !addresses[0]?.countryCode) return [];
  return getStatesForCountry(addresses[0].countryCode);
}, [addresses]);


const handleSaveChanges = () => {
  if (!formData.firstName || !formData.lastName || !formData.email) {
    fireToast("PROFILE.REQUIRED", "warning");
    return;
  }

  if (!addresses[0].address || !addresses[0].countryCode) {
    fireToast("PROFILE.ADDRESS_REQUIRED", "warning");
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


 const handleSubmit = async () => {
  const storedUserRaw = localStorage.getItem("authUser");
  const storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : null;
  const u_id = storedUser?.u_id ?? null;

  if (!u_id) {
    fireToast("API.UNAUTHORIZED", "error");
    return;
  }

  const payload = {
    profile: {
      first_name: formData.firstName,
      middle_name: formData.middleName,
      last_name: formData.lastName,
      mobile_number: formData.phone,
      dob: formData.dob,
    },
   addresses: addresses.map((addr, index) => ({
  address_id: addr.id || null,
  address_type: addr.type.toUpperCase(),
  address_line: addr.address,
  country: addr.countryName,
  country_code: addr.countryCode,   // ✅ ISO
  state: addr.stateName,             // ✅
  city: addr.city,                   // ✅
  pincode: addr.pincode,
  is_default: index === 0,
}))
,
  };

  try {
    const res = await fetch(
      "http://localhost:5006/api/profiles/complete",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": u_id,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      fireToast("PROFILE.SAVE_FAILED", "error");
      return;
    }

    fireToast("PROFILE.SAVE_SUCCESS", "success");
    setIsEditing(false);

  } catch (err) {
    fireToast("API.NETWORK", "error");
  }
};


useEffect(() => {
  const fetchProfile = async () => {
    const storedUserRaw = localStorage.getItem("authUser");
const storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : null;
const u_id = storedUser?.u_id ?? null;

console.log("🔍 UserProfile localStorage snapshot:", {
  authUser: localStorage.getItem("authUser"),
  user: localStorage.getItem("user"),
  userId: localStorage.getItem("userId"),
});


    if (!u_id) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:5006/api/profiles/complete",
        {
          headers: { "x-user-id": u_id },
        }
      );

      if (!res.ok) {
        // ❗ profile nahi mila → form
        setIsEditing(true);
        return;
      }

      const data = await res.json();

      if (data?.profile) {
        setFormData({
  firstName: data.profile.first_name,
  middleName: data.profile.middle_name || "",
  lastName: data.profile.last_name,
  email: data.profile.email || "",
  phone: data.profile.mobile_number || "",
  dob: data.profile.dob ? data.profile.dob.slice(0, 10) : "",
  countryCode: "+91",
  phoneCountryIso: "IN",
});

        if (data.addresses && data.addresses.length > 0) {
  setAddresses(
    data.addresses.map((a) => ({
      id: a.address_id,
      type: a.address_type.toLowerCase(),
      address: a.address_line,
      countryName: a.country,
      countryCode: a.country_code,
      stateName: a.state,
      stateCode: "",
      city: a.city,
      pincode: a.pincode,
    }))
  );
} else {
  // 🔥 VERY IMPORTANT fallback for new user
  setAddresses([
    {
      id: null,
      type: "home",
      typeSpecify: "",
      address: "",
      countryCode: "",
      countryName: "",
      pincode: "",
      stateCode: "",
      stateName: "",
      city: "",
    },
  ]);
}



        setIsEditing(false); // 🔥 CARD SHOW
      } else {
        setIsEditing(true);
      }
    } catch (err) {
  console.error("Fetch profile failed", err);
  fireToast("PROFILE.FETCH_FAILED", "error");
  setIsEditing(true);
}
finally {
      setLoading(false); // 🔥 VERY IMPORTANT
    }
  };

  fetchProfile();
}, []);

if (loading) {
  return <div style={{ padding: 40 }}>Loading profile...</div>;
}

  return (
    <div className="pf-wrapper">
      {/* Left Side - Scrollable area */}
      <div className="pf-left-container">
        <div className="pf-content-area">
          <div className="pf-header">
            <h1 className="pf-title">Your Profile</h1>
            <p className="pf-subtitle">
              Update your personal details and address information
            </p>
          </div>

          {isEditing ? (
            <>
              {/* Personal Information Section */}
              <section className="pf-section">
                <h2 className="pf-section-title">
                  <span className="pf-section-number">1</span>
                  Personal Information
                </h2>

                <div className="pf-grid-two">
                  <div>
                    <label className="pf-label">
                      First Name <span className="pf-required">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="pf-input"
                    />
                  </div>
                  <div>
                    <label className="pf-label">Middle Name</label>
                    <input
                      type="text"
                      name="middleName"
                      placeholder="David"
                      value={formData.middleName}
                      onChange={handleInputChange}
                      className="pf-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="pf-label">
                    Last Name <span className="pf-required">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Smith"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="pf-input"
                  />
                </div>
              </section>

              {/* Contact Information Section */}
              <section className="pf-section">
                <h2 className="pf-section-title">
                  <span className="pf-section-number">2</span>
                  Contact Information
                </h2>

               

                <div className="pf-form-group">
                  <label className="pf-label">
                    Phone Number <span className="pf-required">*</span>
                  </label>
                  <div className="pf-phone-input-wrapper">
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
                      className="pf-country-code-select"
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
                      className="pf-input pf-phone-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="pf-label">
                    Date of Birth <span className="pf-required">*</span>
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="pf-input"
                  />
                </div>
              </section>

              {/* Address Information Section */}
              <section className="pf-section">
                <h2 className="pf-section-title">
                  <span className="pf-section-number">3</span>
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
                    <div key={address.id} className="pf-additional-address">
                      <div className="pf-address-header">
                        <h3 className="pf-address-title">
                          Address {index + 2}
                        </h3>
                        <button
                          type="button"
                          onClick={() => handleRemoveAddress(address.id)}
                          className="pf-remove-btn"
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
                    className="pf-add-address-btn"
                  >
                    <Plus className="w-5 h-5" />
                    Add Another Address
                  </button>
                )}

                {showAddNewAddress && (
                  <button
                    type="button"
                    onClick={handleAddNewAddress}
                    className="pf-confirm-add-btn"
                  >
                    <Plus className="w-5 h-5" />
                    Confirm Add Address
                  </button>
                )}
              </section>

              {/* Submit Button */}
              <div className="pf-button-group">
                 <button className="pf-save-btn" onClick={handleSubmit}>
                  Save Changes
                </button>
                <button
                  type="button"
                  className="pf-cancel-btn"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            // Summary card when not editing
            <div className="pf-summary-card">
              <h2 className="pf-summary-title">Profile Summary</h2>

              <div className="pf-summary-section">
                <h3 className="pf-summary-section-title">Personal</h3>
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

              <div className="pf-summary-section">
                <h3 className="pf-summary-section-title">Addresses</h3>
                {addresses.map((addr, idx) => (
                  <div key={addr.id} className="pf-summary-address">
                    <p className="pf-summary-address-title">
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

              <div className="pf-button-group pf-summary-buttons">
                <button
                  type="button"
                  className="pf-save-btn"
                  onClick={handleEditProfile}
                >
                  Edit Profile
                </button>
                <button
                  type="button"
                  className="pf-cancel-btn"
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
      <div className="pf-right-container">
        <div className="pf-right-content">
          <div className="pf-icon-wrapper">
            <div className="pf-icon-circle">
              <MapPin className="w-12 h-12" strokeWidth={1.5} />
            </div>
            <div className="pf-checkmark">✓</div>
          </div>

          <h2 className="pf-right-title">Where You Belong</h2>
          <p className="pf-right-subtitle">
            Your address is the foundation of your presence. Keep it accurate
            and let opportunities find you.
          </p>

          <div className="pf-features-box">
            <div className="pf-features-list">
              <div className="pf-feature-item">
                <div className="pf-feature-dot" />
                <p className="pf-feature-text">
                  Manage multiple locations with ease
                </p>
              </div>
              <div className="pf-feature-item">
                <div className="pf-feature-dot" />
                <p className="pf-feature-text">
                  Flexible address types for every need
                </p>
              </div>
              <div className="pf-feature-item">
                <div className="pf-feature-dot" />
                <p className="pf-feature-text">
                  Global reach with local precision
                </p>
              </div>
            </div>
          </div>

          <div className="pf-footer-text">
            <p>
              Complete information ensures smooth operations and reliable
              connections
            </p>
          </div>
        </div>

        <div className="pf-decoration pf-decoration-bottom" />
        <div className="pf-decoration pf-decoration-top" />
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
    <div className="pf-address-block">
      <div>
  <label className="pf-label">
    Address Type <span className="pf-required">*</span>
  </label>
  <div className="pf-select-wrapper">
    <select
      value={address.type}
      onChange={(e) =>
        onAddressChange(address.id, "type", e.target.value)
      }
      className="pf-select"
    >
      <option value="home">Home</option>
      <option value="work">Work</option>
      <option value="other">Other</option>
    </select>
    <ChevronDown className="pf-select-icon" />
  </div>

  {address.type === "other" && (
    <input
      type="text"
      placeholder="Please specify"
      value={address.typeSpecify}
      onChange={(e) =>
        onAddressChange(address.id, "typeSpecify", e.target.value)
      }
      className="pf-input pf-input-specify"
    />
  )}
</div>


      <div>
        <label className="pf-label">
          Address <span className="pf-required">*</span>
        </label>
        <textarea
          placeholder="Apartment name, lane, plot number, etc."
          value={address.address}
          onChange={(e) =>
            onAddressChange(address.id, "address", e.target.value)
          }
          className="pf-textarea"
        />
      </div>

      <div>
        <label className="pf-label">
          Country <span className="pf-required">*</span>
        </label>
        <div className="pf-select-wrapper">
          <select
            value={address.countryCode}
            onChange={(e) => onCountrySelect(address.id, e.target.value)}
            className="pf-select"
          >
            <option value="">Select Country</option>
            {countries.map((c) => (
              <option key={c.isoCode} value={c.isoCode}>
                {c.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pf-select-icon" />
        </div>
      </div>

      <div>
        <label className="pf-label">
          Pin Code <span className="pf-required">*</span>
        </label>
        <input
          type="text"
          placeholder="Enter pin code"
          value={address.pincode}
          onChange={(e) => onPincodeChange(address.id, e.target.value)}
          className="pf-input"
        />
      </div>

      {states.length > 0 && (
        <div>
          <label className="pf-label">
            State <span className="pf-required">*</span>
          </label>
          <div className="pf-select-wrapper">
            <select
              value={address.stateCode}
              onChange={(e) => onStateSelect(address.id, e.target.value)}
              className="pf-select"
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pf-select-icon" />
          </div>
        </div>
      )}

      <div>
        <label className="pf-label">
          City <span className="pf-required">*</span>
        </label>
        <input
          type="text"
          placeholder="Enter city"
          value={address.city}
          onChange={(e) =>
            onAddressChange(address.id, "city", e.target.value)
          }
          className="pf-input"
        />
      </div>
    </div>
  );
}

export default UserProfile;

