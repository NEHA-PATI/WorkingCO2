// PopupForms.js - React component file with all three popup forms
import React, { useState } from 'react';
import "@features/org/styles/popupforms.css";
import { assetAPI } from "@features/org/services/assetApi";
import { MdElectricCar, MdSolarPower } from "react-icons/md";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { GiPowder } from "react-icons/gi";
import AddPlantationModal from "@features/org/components/AddPlantationModal";
const PopupForms = ({
  activeEVPopup,
  setActiveEVPopup,
  activeSolarPopup,
  setActiveSolarPopup,
  activePlantationPopup,
  setActivePlantationPopup,
  activeCapturePopup,
  setActiveCapturePopup,
  handleSaveEV,
  handleSavePlantation,
  handleSaveSolar,
  handleSaveCapture,
  setEvCount,
  setSolarCount // ✅ Add this line!
}) => {

  // State for managing popups

  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const [solarPanelData, setSolarPanelData] = useState({
    Installed_Capacity: '',
    Installation_Date: '',
    Energy_Generation_Value: '',
    Energy_Generation: '',
    Grid_Emission_Factor: '',
    Inverter_Type: '',
    Panel_Efficiency: ''
  });



    const [evData, setEVData] = useState({
    vehicleCategory: "",
    subCategory: "",
    powertrainType: "",
    manufacturer: "",
    model: "",
    purchaseYear: "",
    isFleet: "No",
    averageDistancePerDay: "",
    workingDaysPerYear: "",
    numberOfVehicles: "",
    averageDistancePerVehiclePerYear: "",
    fuelType: "",
    fuelEfficiency: "",
    totalFuelConsumedPerYear: "",
    batteryCapacity: "",
    energyConsumedPerMonth: "",
    chargingType: "",
    gridEmissionFactor: "",
    vehicleWeight: "",
    engineCapacity: "",
    motorPower: "",
    chargingTime: "",
  });
  const [evTouched, setEVTouched] = useState({});
  const [captureData, setCaptureData] = useState({
    industryType: "",
    totalEmission: "",
    captureTechnology: "",
    captureEfficiency: "",
  });
  const [captureTouched, setCaptureTouched] = useState({
    industryType: false,
    totalEmission: false,
    captureTechnology: false,
    captureEfficiency: false,
  });

  // Toast notification handler
  const showToast = (message, type = 'success') => {
    console.log('🔔 Showing toast:', message, type);
    setToast({ show: true, message, type });
    setTimeout(() => {
      console.log('🔔 Hiding toast');
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  const validateCaptureField = (name, value) => {
    if (name === "industryType") {
      if (!value) return "Industry Type is required";
      return "";
    }

    if (name === "totalEmission") {
      if (value === "") return "Total Emission is required";
      if (Number(value) <= 0) return "Total Emission must be greater than 0";
      return "";
    }

    if (name === "captureTechnology") {
      if (!value) return "Capture Technology is required";
      return "";
    }

    if (name === "captureEfficiency") {
      if (value === "") return "Capture Efficiency is required";
      const numericValue = Number(value);
      if (numericValue < 0 || numericValue > 100) return "Capture Efficiency must be between 0 and 100";
      return "";
    }

    return "";
  };

  const captureErrors = {
    industryType: validateCaptureField("industryType", captureData.industryType),
    totalEmission: validateCaptureField("totalEmission", captureData.totalEmission),
    captureTechnology: validateCaptureField("captureTechnology", captureData.captureTechnology),
    captureEfficiency: validateCaptureField("captureEfficiency", captureData.captureEfficiency),
  };

  const hasCaptureErrors = Object.values(captureErrors).some(Boolean);

  const handleCaptureChange = (name, value) => {
    setCaptureData((prev) => ({ ...prev, [name]: value }));
    setCaptureTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleCaptureBlur = (name) => {
    setCaptureTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleCaptureSubmit = async (e) => {
    e.preventDefault();

    setCaptureTouched({
      industryType: true,
      totalEmission: true,
      captureTechnology: true,
      captureEfficiency: true,
    });

    if (hasCaptureErrors) {
      showToast("Please fix validation errors before submitting.", "error");
      return;
    }

    const authUserRaw = localStorage.getItem("authUser");
    const authUser = authUserRaw ? JSON.parse(authUserRaw) : null;
    const orgId =
      authUser?.org_id ||
      authUser?.u_id ||
      localStorage.getItem("orgId") ||
      localStorage.getItem("userId");

    if (!orgId) {
      showToast("Organization ID not found. Please login again.", "error");
      return;
    }

    const payload = {
      c_uid: crypto.randomUUID(),
      org_id: orgId,
      industry_type: captureData.industryType,
      total_emission_tonnes_per_year: Number(captureData.totalEmission),
      capture_technology: captureData.captureTechnology,
      capture_efficiency_percent: Number(captureData.captureEfficiency),
    };

    try {
      const result = await assetAPI.createCarbonCapture(payload);
      if (result?.success) {
        handleSaveCapture?.(result.data);
        showToast("Carbon Capture details saved successfully.", "success");
        setCaptureData({
          industryType: "",
          totalEmission: "",
          captureTechnology: "",
          captureEfficiency: "",
        });
        setCaptureTouched({
          industryType: false,
          totalEmission: false,
          captureTechnology: false,
          captureEfficiency: false,
        });
        setActiveCapturePopup(false);
      } else {
        showToast(result?.message || "Failed to save Carbon Capture asset.", "error");
      }
    } catch (error) {
      showToast(error?.message || "Server error while saving Carbon Capture asset.", "error");
    }
  };
  const handlePlantationSubmit = async (payload) => {
    const authUserRaw = localStorage.getItem("authUser");
    const authUser = authUserRaw ? JSON.parse(authUserRaw) : null;
    const orgId =
      authUser?.org_id ||
      authUser?.u_id ||
      localStorage.getItem("orgId") ||
      localStorage.getItem("userId");

    if (!orgId) {
      showToast("Organization ID not found. Please login again.", "error");
      return;
    }

    const step1 = payload?.step1 || {};
    const step2 = payload?.step2 || {};
    const points = payload?.points || [];

    const apiPayload = {
      org_id: orgId,
      plantation_name: String(step1.name || "").trim(),
      plantation_date: step1.date,
      total_area: Number(step1.area),
      area_unit: step1.areaUnit,
      manager_name: String(step1.managerName || "").trim(),
      manager_contact: String(step1.managerContact || "").trim(),
      trees_planted: Number(step2.treesCount),
      species_name: String(step2.speciesName || "").trim(),
      plant_age_years: Number(step2.plantAge),
      points: points.map((pt) => ({ lat: Number(pt.lat), lng: Number(pt.lng) })),
    };

    try {
      const result = await assetAPI.createPlantation(apiPayload);
      if (result?.success) {
        handleSavePlantation?.(result.data);
        showToast("Plantation details added successfully", "success");
        setActivePlantationPopup(false);
        return true;
      } else {
        showToast(result?.message || "Failed to save plantation", "error");
        return false;
      }
    } catch (error) {
      showToast(error?.message || "Server error while saving plantation", "error");
      return false;
    }
  };

  const handleSolarSubmit = async (e) => {
    e.preventDefault();

    // Get user ID from localStorage
    const U_ID = localStorage.getItem("userId");
    if (!U_ID) {
      showToast("User ID not found. Please log in first.", "error");
      return;
    }

    const payload = {
      SUID: crypto.randomUUID(),
      U_ID,
      Installed_Capacity: solarPanelData.Installed_Capacity,
      Installation_Date: solarPanelData.Installation_Date,
      Energy_Generation_Value: Number(solarPanelData.Energy_Generation_Value),

      Grid_Emission_Factor: Number(solarPanelData.Grid_Emission_Factor),
      Inverter_Type: solarPanelData.Inverter_Type,

    };

    console.log('Submitting Solar Panel Payload:', payload);

    // ✅ Quick client-side validation
    const missingFields = Object.entries(payload).filter(([_, val]) =>
      val === undefined || val === null || val === '' || (typeof val === 'string' && val.trim() === '')
    );

    if (missingFields.length > 0) {
      showToast(`Missing fields: ${missingFields.map(f => f[0]).join(', ')}`, 'error');
      return;
    }

    try {
      const result = await assetAPI.createSolar(payload);

      if (result.status === 'success') {
        const { data: savedSolar, solarCount } = result;
        setSolarCount(solarCount);
        showToast(`Solar Panel saved! Total: ${solarCount}`, 'success');
        // Let AddAsset.jsx handle the popup closing and navigation
        handleSaveSolar(savedSolar);
      } else {
        showToast('Failed: ' + (result.message || 'Unknown error'), 'error');
      }
    } catch (err) {
      showToast('Server error: ' + err.message, 'error');
    }
  };

  const handleEVSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "vehicleCategory",
      "subCategory",
      "powertrainType",
      "manufacturer",
      "model",
      "purchaseYear",
      "fuelType",
      "fuelEfficiency",
      "totalFuelConsumedPerYear",
      "batteryCapacity",
      "energyConsumedPerMonth",
      "chargingType",
      "gridEmissionFactor",
    ];

    if (evData.isFleet === "Yes") {
      requiredFields.push("numberOfVehicles", "averageDistancePerVehiclePerYear");
    } else {
      requiredFields.push("averageDistancePerDay", "workingDaysPerYear");
    }

    const nextTouched = {};
    requiredFields.forEach((key) => {
      nextTouched[key] = true;
    });
    setEVTouched(nextTouched);

    const hasMissing = requiredFields.some((key) => {
      const value = evData[key];
      return value === "" || value === null || value === undefined;
    });

    if (hasMissing) {
      showToast("Please fill all required EV fields.", "error");
      return;
    }

    const authUserRaw = localStorage.getItem("authUser");
    const authUser = authUserRaw ? JSON.parse(authUserRaw) : null;
    const orgId =
      authUser?.org_id ||
      authUser?.u_id ||
      localStorage.getItem("orgId") ||
      localStorage.getItem("userId");

    if (!orgId) {
      showToast("Organization ID not found. Please login again.", "error");
      return;
    }

    const payload = {
      org_id: orgId,
      vehicleCategory: evData.vehicleCategory,
      subCategory: evData.subCategory,
      powertrainType: evData.powertrainType,
      manufacturer: evData.manufacturer,
      model: evData.model,
      purchaseYear: evData.purchaseYear,
      isFleet: evData.isFleet,
      averageDistancePerDay: evData.averageDistancePerDay,
      workingDaysPerYear: evData.workingDaysPerYear,
      numberOfVehicles: evData.numberOfVehicles,
      averageDistancePerVehiclePerYear: evData.averageDistancePerVehiclePerYear,
      fuelType: evData.fuelType,
      fuelEfficiency: evData.fuelEfficiency,
      totalFuelConsumedPerYear: evData.totalFuelConsumedPerYear,
      batteryCapacity: evData.batteryCapacity,
      energyConsumedPerMonth: evData.energyConsumedPerMonth,
      chargingType: evData.chargingType,
      gridEmissionFactor: evData.gridEmissionFactor,
      vehicleWeight: evData.vehicleWeight,
      engineCapacity: evData.engineCapacity,
      motorPower: evData.motorPower,
      chargingTime: evData.chargingTime,
    };

    try {
      const result = await assetAPI.createFleet(payload);
      if (result?.success) {
        showToast("Fleet details saved successfully.", "success");
        setActiveEVPopup(false);
      } else {
        showToast(result?.message || "Failed to save fleet details.", "error");
      }
    } catch (error) {
      showToast(error?.message || "Server error while saving fleet details.", "error");
    }
  };

  return (
    <div>
            {/* EV Popup */}
      {activeEVPopup && (
      <div className={`popup-overlay ${activeEVPopup ? 'active' : ''}`} onClick={() => setActiveEVPopup(false)}>
        <div className={`popup ${activeEVPopup ? 'active' : ''}`} onClick={e => e.stopPropagation()}>
          <div className="popup-header">
            <h2>
              <MdElectricCar size={30} color="#2563eb" />
              EV Emissions Input Form
            </h2>
            <button className="popup-close" onClick={() => setActiveEVPopup(false)}>X</button>
          </div>

          <form onSubmit={handleEVSubmit} className="ev-form-ui">
            <div className="ev-section-title">1. Basic Information</div>
            <div className="form-row">
              <div className="form-group">
                <label>Vehicle Category *</label>
                <select
                  className={`form-control ${evTouched.vehicleCategory && !evData.vehicleCategory ? 'form-control-error' : ''}`}
                  value={evData.vehicleCategory}
                  onChange={(e) => setEVData({ ...evData, vehicleCategory: e.target.value })}
                >
                  <option value="">-- Select Vehicle Category --</option>
                  <option value="Two-Wheeler">Two-Wheeler</option>
                  <option value="Three-Wheeler">Three-Wheeler</option>
                  <option value="Passenger Car">Passenger Car</option>
                  <option value="Commercial Vehicle">Commercial Vehicle</option>
                  <option value="Industrial Vehicle">Industrial Vehicle</option>
                </select>
                {evTouched.vehicleCategory && !evData.vehicleCategory && <p className="form-error-text">Vehicle Category is required</p>}
              </div>
              <div className="form-group">
                <label>Sub Category *</label>
                <select
                  className={`form-control ${evTouched.subCategory && !evData.subCategory ? 'form-control-error' : ''}`}
                  value={evData.subCategory}
                  onChange={(e) => setEVData({ ...evData, subCategory: e.target.value })}
                >
                  <option value="">-- Select Sub Category --</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="MPV">MPV</option>
                  <option value="Truck">Truck</option>
                  <option value="Bus">Bus</option>
                  <option value="Van">Van</option>
                  <option value="Tractor">Tractor</option>
                  <option value="Forklift">Forklift</option>
                </select>
                {evTouched.subCategory && !evData.subCategory && <p className="form-error-text">Sub Category is required</p>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Powertrain Type *</label>
                <select
                  className={`form-control ${evTouched.powertrainType && !evData.powertrainType ? 'form-control-error' : ''}`}
                  value={evData.powertrainType}
                  onChange={(e) => setEVData({ ...evData, powertrainType: e.target.value })}
                >
                  <option value="">-- Select Powertrain Type --</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="CNG">CNG</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric (BEV)">Electric (BEV)</option>
                  <option value="Plug-in Hybrid (PHEV)">Plug-in Hybrid (PHEV)</option>
                </select>
                {evTouched.powertrainType && !evData.powertrainType && <p className="form-error-text">Powertrain Type is required</p>}
              </div>
              <div className="form-group">
                <label>Manufacturer *</label>
                <input
                  type="text"
                  className={`form-control ${evTouched.manufacturer && !evData.manufacturer ? 'form-control-error' : ''}`}
                  value={evData.manufacturer}
                  onChange={(e) => setEVData({ ...evData, manufacturer: e.target.value })}
                />
                {evTouched.manufacturer && !evData.manufacturer && <p className="form-error-text">Manufacturer is required</p>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Model *</label>
                <input
                  type="text"
                  className={`form-control ${evTouched.model && !evData.model ? 'form-control-error' : ''}`}
                  value={evData.model}
                  onChange={(e) => setEVData({ ...evData, model: e.target.value })}
                />
                {evTouched.model && !evData.model && <p className="form-error-text">Model is required</p>}
              </div>
              <div className="form-group">
                <label>Purchase Year *</label>
                <input
                  type="number"
                  min="1990"
                  max="2099"
                  className={`form-control ${evTouched.purchaseYear && !evData.purchaseYear ? 'form-control-error' : ''}`}
                  value={evData.purchaseYear}
                  onChange={(e) => setEVData({ ...evData, purchaseYear: e.target.value })}
                />
                {evTouched.purchaseYear && !evData.purchaseYear && <p className="form-error-text">Purchase Year is required</p>}
              </div>
            </div>

            <div className="ev-section-title">2. Usage Details</div>
            <div className="form-row form-row-single">
              <div className="form-group">
                <label>Is this a Fleet? *</label>
                <div className="ev-toggle-row">
                  <button
                    type="button"
                    className={`ev-toggle-btn ${evData.isFleet === 'No' ? 'active' : ''}`}
                    onClick={() => setEVData({ ...evData, isFleet: 'No' })}
                  >No</button>
                  <button
                    type="button"
                    className={`ev-toggle-btn ${evData.isFleet === 'Yes' ? 'active' : ''}`}
                    onClick={() => setEVData({ ...evData, isFleet: 'Yes' })}
                  >Yes</button>
                </div>
              </div>
            </div>

            {evData.isFleet === 'No' ? (
              <div className="form-row">
                <div className="form-group">
                  <label>Average Distance per Day (km) *</label>
                  <input
                    type="number"
                    min="0"
                    className={`form-control ${evTouched.averageDistancePerDay && !evData.averageDistancePerDay ? 'form-control-error' : ''}`}
                    value={evData.averageDistancePerDay}
                    onChange={(e) => setEVData({ ...evData, averageDistancePerDay: e.target.value })}
                  />
                  {evTouched.averageDistancePerDay && !evData.averageDistancePerDay && <p className="form-error-text">This field is required</p>}
                </div>
                <div className="form-group">
                  <label>Working Days per Year *</label>
                  <input
                    type="number"
                    min="0"
                    className={`form-control ${evTouched.workingDaysPerYear && !evData.workingDaysPerYear ? 'form-control-error' : ''}`}
                    value={evData.workingDaysPerYear}
                    onChange={(e) => setEVData({ ...evData, workingDaysPerYear: e.target.value })}
                  />
                  {evTouched.workingDaysPerYear && !evData.workingDaysPerYear && <p className="form-error-text">This field is required</p>}
                </div>
              </div>
            ) : (
              <div className="form-row">
                <div className="form-group">
                  <label>Number of Vehicles *</label>
                  <input
                    type="number"
                    min="1"
                    className={`form-control ${evTouched.numberOfVehicles && !evData.numberOfVehicles ? 'form-control-error' : ''}`}
                    value={evData.numberOfVehicles}
                    onChange={(e) => setEVData({ ...evData, numberOfVehicles: e.target.value })}
                  />
                  {evTouched.numberOfVehicles && !evData.numberOfVehicles && <p className="form-error-text">This field is required</p>}
                </div>
                <div className="form-group">
                  <label>Average Distance per Vehicle per Year (km) *</label>
                  <input
                    type="number"
                    min="0"
                    className={`form-control ${evTouched.averageDistancePerVehiclePerYear && !evData.averageDistancePerVehiclePerYear ? 'form-control-error' : ''}`}
                    value={evData.averageDistancePerVehiclePerYear}
                    onChange={(e) => setEVData({ ...evData, averageDistancePerVehiclePerYear: e.target.value })}
                  />
                  {evTouched.averageDistancePerVehiclePerYear && !evData.averageDistancePerVehiclePerYear && <p className="form-error-text">This field is required</p>}
                </div>
              </div>
            )}

            <div className="ev-section-title">3. Energy / Fuel Details</div>
            <div className="form-row">
              <div className="form-group">
                <label>Fuel Type *</label>
                <select
                  className={`form-control ${evTouched.fuelType && !evData.fuelType ? 'form-control-error' : ''}`}
                  value={evData.fuelType}
                  onChange={(e) => setEVData({ ...evData, fuelType: e.target.value })}
                >
                  <option value="">-- Select Fuel Type --</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="CNG">CNG</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
                {evTouched.fuelType && !evData.fuelType && <p className="form-error-text">Fuel Type is required</p>}
              </div>
              <div className="form-group">
                <label>Fuel Efficiency (km per liter) *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className={`form-control ${evTouched.fuelEfficiency && !evData.fuelEfficiency ? 'form-control-error' : ''}`}
                  value={evData.fuelEfficiency}
                  onChange={(e) => setEVData({ ...evData, fuelEfficiency: e.target.value })}
                />
                {evTouched.fuelEfficiency && !evData.fuelEfficiency && <p className="form-error-text">This field is required</p>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Total Fuel Consumed per Year (liters) *</label>
                <input
                  type="number"
                  min="0"
                  className={`form-control ${evTouched.totalFuelConsumedPerYear && !evData.totalFuelConsumedPerYear ? 'form-control-error' : ''}`}
                  value={evData.totalFuelConsumedPerYear}
                  onChange={(e) => setEVData({ ...evData, totalFuelConsumedPerYear: e.target.value })}
                />
                {evTouched.totalFuelConsumedPerYear && !evData.totalFuelConsumedPerYear && <p className="form-error-text">This field is required</p>}
              </div>
              <div className="form-group">
                <label>Battery Capacity (kWh) *</label>
                <input
                  type="number"
                  min="0"
                  className={`form-control ${evTouched.batteryCapacity && !evData.batteryCapacity ? 'form-control-error' : ''}`}
                  value={evData.batteryCapacity}
                  onChange={(e) => setEVData({ ...evData, batteryCapacity: e.target.value })}
                />
                {evTouched.batteryCapacity && !evData.batteryCapacity && <p className="form-error-text">This field is required</p>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Energy Consumed per Month (kWh) *</label>
                <input
                  type="number"
                  min="0"
                  className={`form-control ${evTouched.energyConsumedPerMonth && !evData.energyConsumedPerMonth ? 'form-control-error' : ''}`}
                  value={evData.energyConsumedPerMonth}
                  onChange={(e) => setEVData({ ...evData, energyConsumedPerMonth: e.target.value })}
                />
                {evTouched.energyConsumedPerMonth && !evData.energyConsumedPerMonth && <p className="form-error-text">This field is required</p>}
              </div>
              <div className="form-group">
                <label>Charging Type *</label>
                <select
                  className={`form-control ${evTouched.chargingType && !evData.chargingType ? 'form-control-error' : ''}`}
                  value={evData.chargingType}
                  onChange={(e) => setEVData({ ...evData, chargingType: e.target.value })}
                >
                  <option value="">-- Select Charging Type --</option>
                  <option value="Home">Home</option>
                  <option value="Depot">Depot</option>
                  <option value="Public">Public</option>
                </select>
                {evTouched.chargingType && !evData.chargingType && <p className="form-error-text">Charging Type is required</p>}
              </div>
            </div>

            <div className="form-row form-row-single">
              <div className="form-group">
                <label>Grid Emission Factor (kgCO2/kWh) *</label>
                <input
                  type="number"
                  min="0"
                  step="0.0001"
                  className={`form-control ${evTouched.gridEmissionFactor && !evData.gridEmissionFactor ? 'form-control-error' : ''}`}
                  value={evData.gridEmissionFactor}
                  onChange={(e) => setEVData({ ...evData, gridEmissionFactor: e.target.value })}
                />
                {evTouched.gridEmissionFactor && !evData.gridEmissionFactor && <p className="form-error-text">Grid Emission Factor is required</p>}
              </div>
            </div>

            <div className="ev-section-title">4. Additional Information (Optional)</div>
            <div className="form-row">
              <div className="form-group">
                <label>Vehicle Weight (kg)</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  value={evData.vehicleWeight}
                  onChange={(e) => setEVData({ ...evData, vehicleWeight: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Engine Capacity (cc)</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  value={evData.engineCapacity}
                  onChange={(e) => setEVData({ ...evData, engineCapacity: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Motor Power (kW)</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  value={evData.motorPower}
                  onChange={(e) => setEVData({ ...evData, motorPower: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Charging Time (hours)</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  className="form-control"
                  value={evData.chargingTime}
                  onChange={(e) => setEVData({ ...evData, chargingTime: e.target.value })}
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-primary btn-cancel" onClick={() => setActiveEVPopup(false)}>Cancel</button>
              <button type="submit" className="btn-primary btn-submit-ev">Save Details</button>
            </div>
          </form>
        </div>
      </div>
      )}
      {/* Plantation Popup */}
      {activePlantationPopup && (
      <AddPlantationModal
        onClose={() => setActivePlantationPopup(false)}
        onSubmit={handlePlantationSubmit}
      />
      )}


      {/* Solar Panel Popup */}
      {activeSolarPopup && (
      <div className={`popup-overlay ${activeSolarPopup ? 'active' : ''}`} onClick={() => setActiveSolarPopup(false)}>
        <div className={`popup ${activeSolarPopup ? 'active' : ''}`} onClick={e => e.stopPropagation()}>
          <div className="popup-header">
            <h2>
              <MdSolarPower size={28} color="#f59e0b" />
              Solar Panel Details
            </h2>
            <button className="popup-close" onClick={() => setActiveSolarPopup(false)}>X</button>
          </div>
          <form onSubmit={handleSolarSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="Installed_Capacity">Installed Capacity</label>
                <input
                  type="text"
                  id="Installed_Capacity"
                  className="form-control"
                  placeholder="e.g., 3kw"
                  value={solarPanelData.Installed_Capacity}
                  onChange={(e) => setSolarPanelData({ ...solarPanelData, Installed_Capacity: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="Installation_Date">Installation_Date</label>
                <input
                  type="date"
                  id="Installation_Date"
                  className="form-control"
                  placeholder="e.g., 3kw"
                  value={solarPanelData.Installation_Date}
                  onChange={(e) => setSolarPanelData({ ...solarPanelData, Installation_Date: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="Energy_Generation_Value">Energy Generation Value</label>
                <input
                  type="number"
                  id="Energy_Generation_Value"
                  className="form-control"
                  placeholder="e.g., 3kw"
                  value={solarPanelData.Energy_Generation_Value}
                  onChange={(e) =>
                    setSolarPanelData({
                      ...solarPanelData,
                      Energy_Generation_Value: e.target.value
                    })
                  }
                  required
                />
              </div>


            </div>
            <div className="form-row">

              <div className="form-group">
                <label htmlFor="Grid_Emission_Factor">Grid_Emission_Factor</label>
                <input
                  type="number"
                  id="Grid_Emission_Factor"
                  className="form-control"
                  placeholder="e.g., 30"
                  value={solarPanelData.Grid_Emission_Factor}
                  onChange={(e) => setSolarPanelData({ ...solarPanelData, Grid_Emission_Factor: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="Inverter_Type">Inverter_Type</label>
                <select
                  id="Inverter_Type"
                  className="form-control"
                  value={solarPanelData.Inverter_Type}
                  onChange={(e) => setSolarPanelData({ ...solarPanelData, Inverter_Type: e.target.value })}
                  required
                >
                  <option value="" disabled hidden>
                    -- Select Inverter Type --
                  </option>
                  <option value="string">String Inverter</option>
                  <option value="microinverter">Microinverter</option>
                  <option value="hybrid">Hybrid Inverter</option>
                  <option value="central">Central Inverter</option>
                </select>
              </div>
            </div>
            <div className="form-row">

            </div>
            <div className="form-row">


            </div>
            <div className="form-actions">
              <button type="button" className="btn-primary btn-cancel" onClick={() => setActiveSolarPopup(false)}>Cancel</button>
              <button type="submit" className="btn-primary btn-submit-tree">Save Details</button>
            </div>
          </form>
        </div>
      </div>
      )}

      {/* Carbon Capture Popup */}
      {activeCapturePopup && (
      <div className={`popup-overlay ${activeCapturePopup ? 'active' : ''}`} onClick={() => setActiveCapturePopup(false)}>
        <div className={`popup capture-popup ${activeCapturePopup ? 'active' : ''}`} onClick={e => e.stopPropagation()}>
          <div className="popup-header">
            <h2>
              <GiPowder size={26} color="#475569" />
              Carbon Capture Facility
            </h2>
            <button className="popup-close" onClick={() => setActiveCapturePopup(false)}>X</button>
          </div>

          <form onSubmit={handleCaptureSubmit}>
            <div className="capture-section-card">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="industryType">Industry Type *</label>
                  <select
                    id="industryType"
                    className={`form-control ${captureTouched.industryType && captureErrors.industryType ? "form-control-error" : ""}`}
                    value={captureData.industryType}
                    onChange={(e) => handleCaptureChange("industryType", e.target.value)}
                    onBlur={() => handleCaptureBlur("industryType")}
                    required
                  >
                    <option value="" disabled hidden>-- Select Industry Type --</option>
                    <option value="Cement">Cement</option>
                    <option value="Steel">Steel</option>
                    <option value="Power">Power</option>
                    <option value="Refinery">Refinery</option>
                    <option value="Chemical">Chemical</option>
                  </select>
                  {captureTouched.industryType && captureErrors.industryType && (
                    <p className="form-error-text">{captureErrors.industryType}</p>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="totalEmission">Total Emission (tonnes CO2/year) *</label>
                  <div className="unit-input-wrap">
                    <input
                      type="number"
                      id="totalEmission"
                      className={`form-control form-control-with-unit ${captureTouched.totalEmission && captureErrors.totalEmission ? "form-control-error" : ""}`}
                      placeholder="e.g., 250000"
                      min="0.01"
                      step="0.01"
                      value={captureData.totalEmission}
                      onChange={(e) => handleCaptureChange("totalEmission", e.target.value)}
                      onBlur={() => handleCaptureBlur("totalEmission")}
                      required
                    />
                    <span className="input-unit">tonnes</span>
                  </div>
                  {captureTouched.totalEmission && captureErrors.totalEmission && (
                    <p className="form-error-text">{captureErrors.totalEmission}</p>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="captureTechnology">Capture Technology *</label>
                  <select
                    id="captureTechnology"
                    className={`form-control ${captureTouched.captureTechnology && captureErrors.captureTechnology ? "form-control-error" : ""}`}
                    value={captureData.captureTechnology}
                    onChange={(e) => handleCaptureChange("captureTechnology", e.target.value)}
                    onBlur={() => handleCaptureBlur("captureTechnology")}
                    required
                  >
                    <option value="" disabled hidden>-- Select Capture Technology --</option>
                    <option value="Post-combustion">Post-combustion</option>
                    <option value="Pre-combustion">Pre-combustion</option>
                    <option value="Oxy-fuel">Oxy-fuel</option>
                    <option value="Direct Air Capture">Direct Air Capture</option>
                  </select>
                  {captureTouched.captureTechnology && captureErrors.captureTechnology && (
                    <p className="form-error-text">{captureErrors.captureTechnology}</p>
                  )}
                </div>
              </div>

              <div className="form-row form-row-single">
                <div className="form-group">
                  <label htmlFor="captureEfficiency">Capture Efficiency (%) *</label>
                  <div className="unit-input-wrap">
                    <input
                      type="number"
                      id="captureEfficiency"
                      className={`form-control form-control-with-unit ${captureTouched.captureEfficiency && captureErrors.captureEfficiency ? "form-control-error" : ""}`}
                      placeholder="0-100"
                      min="0"
                      max="100"
                      step="0.1"
                      value={captureData.captureEfficiency}
                      onChange={(e) => handleCaptureChange("captureEfficiency", e.target.value)}
                      onBlur={() => handleCaptureBlur("captureEfficiency")}
                      required
                    />
                    <span className="input-unit">%</span>
                  </div>
                  {captureTouched.captureEfficiency && captureErrors.captureEfficiency && (
                    <p className="form-error-text">{captureErrors.captureEfficiency}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-primary btn-cancel" onClick={() => setActiveCapturePopup(false)}>Cancel</button>
              <button type="submit" className="btn-primary btn-submit-capture">Save Details</button>
            </div>
          </form>
        </div>
      </div>
      )}



      {/* Toast Notification */}
      {toast.show && (
      <div className={`org-popup-toast show ${toast.type}`}>
        {toast.type === 'error' ? (
          <FaTimesCircle className="org-popup-toast-icon" size={24} color="#fecaca" />
        ) : (
          <FaCheckCircle className="org-popup-toast-icon" size={24} color="#bbf7d0" />
        )}
        <span className="org-popup-toast-message">{toast.message}</span>
      </div>
      )}
    </div>
  );
};
export default PopupForms;













