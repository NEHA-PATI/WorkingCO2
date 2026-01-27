
import React from "react"
import { useState, useMemo } from 'react';
import { ChevronDown, MapPin, Plus, X } from 'lucide-react';
import '../../styles/user/UserProfile.css';

// Country data structure
const countries = [
    { code: 'US', name: 'United States' },
    { code: 'IN', name: 'India' },
    { code: 'CA', name: 'Canada' },
    { code: 'UK', name: 'United Kingdom' },
    { code: 'AU', name: 'Australia' },
];

const statesByCuntry = {
    'United States': [
        { name: 'California', cities: ['Los Angeles', 'San Francisco', 'San Diego'] },
        { name: 'Texas', cities: ['Houston', 'Dallas', 'Austin'] },
        { name: 'New York', cities: ['New York City', 'Buffalo', 'Rochester'] },
        { name: 'Florida', cities: ['Miami', 'Orlando', 'Tampa'] },
    ],
    'India': [
        { name: 'Maharashtra', cities: ['Mumbai', 'Pune', 'Nagpur'] },
        { name: 'Karnataka', cities: ['Bangalore', 'Mysore', 'Belgaum'] },
        { name: 'Tamil Nadu', cities: ['Chennai', 'Coimbatore', 'Madurai'] },
        { name: 'Delhi', cities: ['New Delhi', 'Old Delhi'] },
    ],
    'Canada': [
        { name: 'Ontario', cities: ['Toronto', 'Ottawa', 'Hamilton'] },
        { name: 'British Columbia', cities: ['Vancouver', 'Victoria', 'Kelowna'] },
        { name: 'Quebec', cities: ['Montreal', 'Quebec City', 'Laval'] },
    ],
    'United Kingdom': [
        { name: 'England', cities: ['London', 'Manchester', 'Birmingham'] },
        { name: 'Scotland', cities: ['Edinburgh', 'Glasgow'] },
        { name: 'Wales', cities: ['Cardiff', 'Swansea'] },
    ],
    'Australia': [
        { name: 'New South Wales', cities: ['Sydney', 'Newcastle', 'Wollongong'] },
        { name: 'Victoria', cities: ['Melbourne', 'Geelong'] },
        { name: 'Queensland', cities: ['Brisbane', 'Gold Coast'] },
    ],
};

const UserProfile = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        countryCode: '+1',
        phone: '',
        dob: '',
    });

    const [addresses, setAddresses] = useState([
        {
            id: '1',
            type: 'home',
            typeSpecify: '',
            address: '',
            country: '',
            pincode: '',
            state: '',
            city: '',
        },
    ]);

    const [showAddNewAddress, setShowAddNewAddress] = useState(false);

    const countryCodes = [
        { code: '+1', country: 'US' },
        { code: '+44', country: 'UK' },
        { code: '+91', country: 'IN' },
        { code: '+61', country: 'AU' },
        { code: '+1', country: 'CA' },
    ];

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
        handleAddressChange(id, 'pincode', pincode);
    };

    const handleAddNewAddress = () => {
        const newAddress = {
            id: Date.now().toString(),
            type: 'office',
            typeSpecify: '',
            address: '',
            country: '',
            pincode: '',
            state: '',
            city: '',
        };
        setAddresses((prev) => [...prev, newAddress]);
        setShowAddNewAddress(false);
    };

    const handleRemoveAddress = (id) => {
        if (addresses.length > 1) {
            setAddresses((prev) => prev.filter((addr) => addr.id !== id));
        }
    };

    const filteredStates = useMemo(() => {
        return addresses.length > 0 && addresses[0].country
            ? statesByCuntry[addresses[0].country] || []
            : [];
    }, [addresses]);

    const filteredCities = useMemo(() => {
        if (addresses.length > 0 && addresses[0].state) {
            const stateData = filteredStates.find((s) => s.name === addresses[0].state);
            return stateData?.cities || [];
        }
        return [];
    }, [addresses, filteredStates]);

    return (
        <div className="pf-wrapper">
            {/* Left Side - Scrollable Form */}
            <div className="pf-left-container">
                <div className="pf-content-area">
                    <div className="pf-header">
                        <h1 className="pf-title">Your Profile</h1>
                        <p className="pf-subtitle">Update your organization details and address information</p>
                    </div>

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
                                <label className="pf-label">
                                    Middle Name
                                </label>
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
                                Email <span className="pf-required">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="pf-input"
                            />
                        </div>

                        <div className="pf-form-group">
                            <label className="pf-label">
                                Phone Number <span className="pf-required">*</span>
                            </label>
                            <div className="pf-phone-input-wrapper">
                                <select
                                    value={formData.countryCode}
                                    onChange={handleInputChange}
                                    name="countryCode"
                                    className="pf-country-code-select"
                                >
                                    {countryCodes.map((c) => (
                                        <option key={c.code} value={c.code}>
                                            {c.code}
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
                            index={0}
                            countries={countries}
                            filteredStates={filteredStates}
                            filteredCities={filteredCities}
                            onAddressChange={handleAddressChange}
                            onPincodeChange={handlePincodeChange}
                            isPrimary={true}
                        />

                        {/* Additional Addresses */}
                        {addresses.slice(1).map((address, index) => (
                            <div key={address.id} className="pf-additional-address">
                                <div className="pf-address-header">
                                    <h3 className="pf-address-title">Address {index + 2}</h3>
                                    <button
                                        onClick={() => handleRemoveAddress(address.id)}
                                        className="pf-remove-btn"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <AddressBlock
                                    address={address}
                                    index={index + 1}
                                    countries={countries}
                                    filteredStates={statesByCuntry[address.country] || []}
                                    filteredCities={
                                        statesByCuntry[address.country]?.find((s) => s.name === address.state)
                                            ?.cities || []
                                    }
                                    onAddressChange={handleAddressChange}
                                    onPincodeChange={handlePincodeChange}
                                    isPrimary={false}
                                />
                            </div>
                        ))}

                        {/* Add Another Address Button */}
                        {!showAddNewAddress && (
                            <button
                                onClick={() => setShowAddNewAddress(true)}
                                className="pf-add-address-btn"
                            >
                                <Plus className="w-5 h-5" />
                                Add Another Address
                            </button>
                        )}

                        {showAddNewAddress && (
                            <button
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
                        <button className="pf-save-btn">
                            Save Changes
                        </button>
                        <button className="pf-cancel-btn">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Side - Fixed Design Section */}
            <div className="pf-right-container">
                <div className="pf-right-content">
                    <div className="pf-icon-wrapper">
                        <div className="pf-icon-circle">
                            <MapPin className="w-12 h-12" strokeWidth={1.5} />
                        </div>
                        <div className="pf-checkmark">
                            ✓
                        </div>
                    </div>

                    <h2 className="pf-right-title">Where You Belong</h2>
                    <p className="pf-right-subtitle">
                        Your address is the foundation of your presence. Keep it accurate and let opportunities find you.
                    </p>

                    <div className="pf-features-box">
                        <div className="pf-features-list">
                            <div className="pf-feature-item">
                                <div className="pf-feature-dot" />
                                <p className="pf-feature-text">Manage multiple locations with ease</p>
                            </div>
                            <div className="pf-feature-item">
                                <div className="pf-feature-dot" />
                                <p className="pf-feature-text">Flexible address types for every need</p>
                            </div>
                            <div className="pf-feature-item">
                                <div className="pf-feature-dot" />
                                <p className="pf-feature-text">Global reach with local precision</p>
                            </div>
                        </div>
                    </div>

                    <div className="pf-footer-text">
                        <p>Complete information ensures smooth operations and reliable connections</p>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="pf-decoration pf-decoration-bottom" />
                <div className="pf-decoration pf-decoration-top" />
            </div>
        </div>
    );
}

function AddressBlock({
    address,
    index,
    countries,
    filteredStates,
    filteredCities,
    onAddressChange,
    onPincodeChange,
    isPrimary,
}) {
    return (
        <div className="pf-address-block">
            {isPrimary && (
                <div>
                    <label className="pf-label">
                        Address Type <span className="pf-required">*</span>
                    </label>
                    <div className="pf-select-wrapper">
                        <select
                            value={address.type}
                            onChange={(e) => onAddressChange(address.id, 'type', e.target.value)}
                            className="pf-select"
                        >
                            <option value="home">Home</option>
                            <option value="office">Office</option>
                            <option value="other">Other</option>
                        </select>
                        <ChevronDown className="pf-select-icon" />
                    </div>

                    {address.type === 'other' && (
                        <input
                            type="text"
                            placeholder="Please specify"
                            value={address.typeSpecify}
                            onChange={(e) => onAddressChange(address.id, 'typeSpecify', e.target.value)}
                            className="pf-input pf-input-specify"
                        />
                    )}
                </div>
            )}

            <div>
                <label className="pf-label">
                    Address <span className="pf-required">*</span>
                </label>
                <textarea
                    placeholder="Apartment name, lane, plot number, etc."
                    value={address.address}
                    onChange={(e) => onAddressChange(address.id, 'address', e.target.value)}
                    className="pf-textarea"
                />
            </div>

            <div>
                <label className="pf-label">
                    Country <span className="pf-required">*</span>
                </label>
                <div className="pf-select-wrapper">
                    <select
                        value={address.country}
                        onChange={(e) => onAddressChange(address.id, 'country', e.target.value)}
                        className="pf-select"
                    >
                        <option value="">Select Country</option>
                        {countries.map((c) => (
                            <option key={c.code} value={c.name}>
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

            {filteredStates.length > 0 && (
                <div>
                    <label className="pf-label">
                        State <span className="pf-required">*</span>
                    </label>
                    <div className="pf-select-wrapper">
                        <select
                            value={address.state}
                            onChange={(e) => onAddressChange(address.id, 'state', e.target.value)}
                            className="pf-select"
                        >
                            <option value="">Select State</option>
                            {filteredStates.map((state) => (
                                <option key={state.name} value={state.name}>
                                    {state.name}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="pf-select-icon" />
                    </div>
                </div>
            )}

            {filteredCities.length > 0 && (
                <div>
                    <label className="pf-label">
                        City <span className="pf-required">*</span>
                    </label>
                    <div className="pf-select-wrapper">
                        <select
                            value={address.city}
                            onChange={(e) => onAddressChange(address.id, 'city', e.target.value)}
                            className="pf-select"
                        >
                            <option value="">Select City</option>
                            {filteredCities.map((city) => (
                                <option key={city} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="pf-select-icon" />
                    </div>
                </div>
            )}
        </div>
    );
}
export default UserProfile;