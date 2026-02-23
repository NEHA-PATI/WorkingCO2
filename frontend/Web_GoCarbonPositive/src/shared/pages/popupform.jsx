import React, { useState } from "react";
import evService from "@shared/utils/services/evService";
import solarService from "@shared/utils/services/solarService";
import treeService from "@shared/utils/services/treeService";
import { toast as toastify } from "react-toastify";
import "@shared/ui/styles/popupform.css";

const PopupForms = ({
  activeEVPopup,
  setActiveEVPopup,
  activeSolarPopup,
  setActiveSolarPopup,
  activeTreePopup,
  setActiveTreePopup,
  handleSaveEV,
  handleSaveTree,
  handleSaveSolar,
  setEvCount,
  setSolarCount,
}) => {
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  // State for forms
  const [evData, setEVData] = useState({
    manufacturer: "",
    model: "",
    year: "",
    batteryconsumed: "",
    range: "",
    EVCategory: "",
    chargingType: "",
    gridEmissionFactor: "",
    topSpeed: "",
    chargingTime: "",
    motorpower: "",
  });

  const [solarPanelData, setSolarPanelData] = useState({
    Installed_Capacity: "",
    Installation_Date: "",
    Energy_Generation_Value: "",
    Grid_Emission_Factor: "",
    Inverter_Type: "",
  });

  const [treeData, setTreeData] = useState({
    TreeName: "",
    BotanicalName: "",
    PlantingDate: "",
    Height: "",
    location: "",
    photos: [],
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  // ===== EV SUBMIT =====
  const handleEVSubmit = async (e) => {
    e.preventDefault();

    const storedUser = JSON.parse(localStorage.getItem("authUser"));
    const U_ID = storedUser?.u_id || "USR_SAMPLE_001";

    if (!U_ID) {
      showToast("User not logged in or invalid session", "error");
      return;
    }

    const payload = {
      U_ID,
      Category: evData.EVCategory,
      Manufacturers: evData.manufacturer,
      Model: evData.model,
      Purchase_Year: Number(evData.year),
      Energy_Consumed: Number(evData.batteryconsumed),
      Primary_Charging_Type: evData.chargingType,
      Range: Number(evData.range),
      Grid_Emission_Factor: Number(evData.gridEmissionFactor),
      Top_Speed: evData.topSpeed ? Number(evData.topSpeed) : null,
      Charging_Time: evData.chargingTime ? Number(evData.chargingTime) : null,
      Motor_Power: evData.motorpower || null,
    };

    console.log("Submitting EV Payload:", payload);

    try {
      const response = await evService.createEV(payload);

      if (response.status === "success") {
        showToast(`EV saved successfully!`, "success");
        toastify.success("EV added successfully!");

        if (typeof handleSaveEV === "function") {
          handleSaveEV(response.data);
        }

        if (typeof setEvCount === "function") {
          setEvCount(response.count || 1);
        }

        // Reset form
        setEVData({
          manufacturer: "",
          model: "",
          year: "",
          batteryconsumed: "",
          range: "",
          EVCategory: "",
          chargingType: "",
          gridEmissionFactor: "",
          topSpeed: "",
          chargingTime: "",
          motorpower: "",
        });

        setActiveEVPopup(false);
      } else {
        showToast("Failed to save EV", "error");
        toastify.error(response.message || "Failed to save EV");
      }
    } catch (error) {
      console.error("EV submit error:", error);
      showToast("Server error! " + (error.message || ""), "error");
      toastify.error("Failed to add EV: " + (error.message || "Unknown error"));
    }
  };

  // ===== SOLAR SUBMIT ===== ✅ FIXED
  const handleSolarSubmit = async (e) => {
    e.preventDefault();

    const storedUser = JSON.parse(localStorage.getItem("authUser"));
    const U_ID = storedUser?.u_id || "USR_SAMPLE_001";

    if (!U_ID) {
      showToast("User not logged in", "error");
      return;
    }

    // ✅ FIXED: Use correct backend field names
    const payload = {
      U_ID,
      Installed_Capacity: parseFloat(solarPanelData.Installed_Capacity),
      Installation_Date: solarPanelData.Installation_Date, // ✅ Send full date
      Energy_Generation_Value: parseFloat(
        solarPanelData.Energy_Generation_Value
      ),
      Grid_Emission_Factor: parseFloat(solarPanelData.Grid_Emission_Factor),
      Inverter_Type: solarPanelData.Inverter_Type,
    };

    console.log("Submitting Solar Panel Payload:", payload);

    // ✅ Validate required fields
    const missingFields = [];
    if (!payload.U_ID) missingFields.push("U_ID");
    if (!payload.Installed_Capacity || isNaN(payload.Installed_Capacity))
      missingFields.push("Installed_Capacity");
    if (!payload.Installation_Date) missingFields.push("Installation_Date");

    if (missingFields.length > 0) {
      showToast(
        `Missing required fields: ${missingFields.join(", ")}`,
        "error"
      );
      return;
    }

    try {
      const response = await solarService.createSolarPanel(payload);

      if (response.status === "success") {
        showToast(`Solar Panel saved successfully!`, "success");
        toastify.success("Solar panel added successfully!");

        if (typeof handleSaveSolar === "function") {
          handleSaveSolar(response.data);
        }

        if (typeof setSolarCount === "function") {
          setSolarCount(response.solarCount || 1);
        }

        // Reset form
        setSolarPanelData({
          Installed_Capacity: "",
          Installation_Date: "",
          Energy_Generation_Value: "",
          Grid_Emission_Factor: "",
          Inverter_Type: "",
        });

        setActiveSolarPopup(false);
      } else {
        showToast("Failed: " + (response.message || "Unknown error"), "error");
        toastify.error(response.message || "Failed to save solar panel");
      }
    } catch (error) {
      console.error("Solar submit error:", error);
      const errorMessage = error.message || error.error || "Unknown error";
      showToast("Server error: " + errorMessage, "error");
      toastify.error("Failed to add solar panel: " + errorMessage);
    }
  };

  // ===== TREE SUBMIT ===== ✅ FIXED
  const handleTreeSubmit = async (e) => {
    e.preventDefault();

    const storedUser = JSON.parse(localStorage.getItem("authUser"));
    const U_ID = storedUser?.u_id || "USR_SAMPLE_001";

    if (!U_ID) {
      showToast("User ID not found. Please login again.", "error");
      return;
    }

    try {
      // ✅ FIXED: Use correct backend field names
      const payload = {
        UID: U_ID, // ✅ Changed from U_ID
        TreeName: treeData.TreeName, // ✅ Correct
        BotanicalName: treeData.BotanicalName, // ✅ Correct
        PlantingDate: treeData.PlantingDate, // ✅ Send full date, not year
        Height: parseFloat(treeData.Height), // ✅ Keep as cm
        DBH: 10, // ✅ Default diameter
        Location: treeData.location, // ✅ Correct
        CreatedBy: U_ID, // ✅ Optional
        imageIds: [], // ✅ Optional array for images
      };

      console.log("Submitting Tree Payload:", payload);

      // ✅ Validate required fields
      const missingFields = [];
      if (!payload.UID) missingFields.push("UID");
      if (!payload.TreeName) missingFields.push("TreeName");
      if (!payload.PlantingDate) missingFields.push("PlantingDate");
      if (!payload.Height || isNaN(payload.Height))
        missingFields.push("Height");

      if (missingFields.length > 0) {
        showToast(
          `Missing required fields: ${missingFields.join(", ")}`,
          "error"
        );
        return;
      }

      const response = await treeService.createTree(payload);

      if (response.status === "success") {
        showToast("Tree data saved successfully!", "success");
        toastify.success("Tree planted successfully!");

        if (typeof handleSaveTree === "function") {
          handleSaveTree(response.data);
        }

        // Upload images if any
        if (
          treeData.photos &&
          treeData.photos.length > 0 &&
          response.data?.tid
        ) {
          const blob = dataURLtoBlob(treeData.photos[0]);
          const file = new File([blob], "tree-image.jpg", {
            type: "image/jpeg",
          });

          try {
            await treeService.uploadTreeImage(U_ID, response.data.tid, file);
            showToast("Tree image uploaded!", "success");
          } catch (imgError) {
            console.error("Image upload failed:", imgError);
          }
        }

        // Reset form
        setTreeData({
          TreeName: "",
          BotanicalName: "",
          PlantingDate: "",
          Height: "",
          location: "",
          photos: [],
        });

        setActiveTreePopup(false);
      } else {
        showToast(response.message || "Failed to save tree data.", "error");
        toastify.error(response.message || "Failed to save tree");
      }
    } catch (error) {
      console.error(error);
      showToast("Server error!", "error");
      toastify.error(
        "Failed to add tree: " + (error.message || "Unknown error")
      );
    }
  };

  // Helper function: dataURL to Blob
  function dataURLtoBlob(dataURL) {
    const byteString = atob(dataURL.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: "image/jpeg" });
  }

  const removePhoto = (index) => {
    setTreeData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  return (
    <div>
      {/* EV Popup */}
      <div
        className={`popup-overlay ${activeEVPopup ? "active" : ""}`}
        onClick={() => setActiveEVPopup(false)}
      >
        <div
          className={`popup ${activeEVPopup ? "active" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="popup-header">
            <h2>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#2196F3"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="9" width="20" height="10" rx="2" ry="2"></rect>
                <circle cx="7" cy="19" r="2"></circle>
                <circle cx="17" cy="19" r="2"></circle>
                <path d="M5 9V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4"></path>
                <path d="M15 13h2"></path>
                <path d="M7 13h2"></path>
              </svg>
              Electric Vehicle Details
            </h2>
            <button
              className="popup-close"
              onClick={() => setActiveEVPopup(false)}
            >
              ×
            </button>
          </div>
          <form onSubmit={handleEVSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="EVCategory">Vehicle Category</label>
                <select
                  id="EVCategory"
                  className="form-control"
                  value={evData.EVCategory}
                  onChange={(e) =>
                    setEVData({ ...evData, EVCategory: e.target.value })
                  }
                  required
                >
                  <option value="" disabled hidden>
                    -- Select Vehicle Category --
                  </option>
                  <option value="Two-Wheelers">Two-Wheelers</option>
                  <option value="Three-Wheeler">Three-Wheeler</option>
                  <option value="Hatchbacks">Hatchbacks</option>
                  <option value="Sedans">Sedans</option>
                  <option value="SUVs">SUVs</option>
                  <option value="MPVs">MPVs</option>
                  <option value="Buses">Buses</option>
                  <option value="Trucks">Trucks</option>
                  <option value="Vans">Vans</option>
                  <option value="Tractors">Tractors</option>
                  <option value="Forklifts">Forklifts</option>
                  <option value="NEVs">NEVs</option>
                  <option value="Golf Carts">Golf Carts</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="ev-manufacturer">Manufacturer</label>
                <input
                  type="text"
                  id="ev-manufacturer"
                  className="form-control"
                  placeholder="e.g., Tesla, Nissan, Chevrolet"
                  value={evData.manufacturer}
                  onChange={(e) =>
                    setEVData({ ...evData, manufacturer: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ev-model">Model</label>
                <input
                  type="text"
                  id="ev-model"
                  className="form-control"
                  placeholder="e.g., Model 3, Leaf, Bolt"
                  value={evData.model}
                  onChange={(e) =>
                    setEVData({ ...evData, model: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="ev-year">Purchase Year</label>
                <input
                  type="number"
                  id="ev-year"
                  className="form-control"
                  placeholder="e.g., 2022"
                  min="2000"
                  max="2030"
                  value={evData.year}
                  onChange={(e) =>
                    setEVData({ ...evData, year: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="energyConsumed">Energy consumed (kWh)</label>
                <input
                  type="number"
                  id="energyconsumed"
                  className="form-control"
                  placeholder="e.g., 75"
                  step="0.1"
                  min="1"
                  value={evData.batteryconsumed}
                  onChange={(e) =>
                    setEVData({ ...evData, batteryconsumed: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="chargingType">Primary Charging Type</label>
                <select
                  id="chargingType"
                  className="form-control"
                  value={evData.chargingType}
                  onChange={(e) =>
                    setEVData({ ...evData, chargingType: e.target.value })
                  }
                  required
                >
                  <option value="" disabled hidden>
                    -- Select Charging Type --
                  </option>
                  <option value="level1">Level 1 (120V)</option>
                  <option value="level2">Level 2 (240V)</option>
                  <option value="dcfast">DC Fast Charging</option>
                  <option value="tesla">Tesla Supercharger</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="range">Range (Km)</label>
                <input
                  type="number"
                  id="range"
                  className="form-control"
                  placeholder="e.g., 300"
                  min="1"
                  value={evData.range}
                  onChange={(e) =>
                    setEVData({ ...evData, range: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="gridEmissionFactor">Grid Emission Factor</label>
                <input
                  type="number"
                  id="gridEmissionFactor"
                  className="form-control"
                  placeholder="e.g., 0.5"
                  step="0.1"
                  min="0"
                  value={evData.gridEmissionFactor}
                  onChange={(e) =>
                    setEVData({ ...evData, gridEmissionFactor: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="topSpeed">Top Speed (km/h)</label>
                <input
                  type="number"
                  id="topSpeed"
                  className="form-control"
                  placeholder="e.g., 180"
                  min="0"
                  value={evData.topSpeed}
                  onChange={(e) =>
                    setEVData({ ...evData, topSpeed: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="chargingTime">Charging time (hours)</label>
                <input
                  type="number"
                  id="chargingTime"
                  className="form-control"
                  placeholder="e.g., 8"
                  step="0.5"
                  min="0"
                  value={evData.chargingTime}
                  onChange={(e) =>
                    setEVData({ ...evData, chargingTime: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="motorpower">Motor power (HP)</label>
                <input
                  type="text"
                  id="motorpower"
                  className="form-control"
                  placeholder="e.g., 200 HP"
                  value={evData.motorpower}
                  onChange={(e) =>
                    setEVData({ ...evData, motorpower: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-primary btn-cancel"
                onClick={() => setActiveEVPopup(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary btn-submit-ev">
                Save Details
              </button>
            </div>
          </form>
        </div>
      </div>


      {/* Solar Panel Popup */}
      <div
        className={`popup-overlay ${activeSolarPopup ? "active" : ""}`}
        onClick={() => setActiveSolarPopup(false)}
      >
        <div
          className={`popup ${activeSolarPopup ? "active" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="popup-header">
            <h2>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FF9800"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="7" width="18" height="12" rx="2" ry="2"></rect>
                <line x1="3" y1="13" x2="21" y2="13"></line>
                <line x1="9" y1="7" x2="9" y2="19"></line>
                <line x1="15" y1="7" x2="15" y2="19"></line>
              </svg>
              Solar Panel Details
            </h2>
            <button
              className="popup-close"
              onClick={() => setActiveSolarPopup(false)}
            >
              ×
            </button>
          </div>
          <form onSubmit={handleSolarSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="Installed_Capacity">
                  Installed Capacity (kW)
                </label>
                <input
                  type="number"
                  id="Installed_Capacity"
                  className="form-control"
                  placeholder="e.g., 5"
                  step="0.1"
                  value={solarPanelData.Installed_Capacity}
                  onChange={(e) =>
                    setSolarPanelData({
                      ...solarPanelData,
                      Installed_Capacity: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="Installation_Date">Installation Date</label>
                <input
                  type="date"
                  id="Installation_Date"
                  className="form-control"
                  value={solarPanelData.Installation_Date}
                  onChange={(e) =>
                    setSolarPanelData({
                      ...solarPanelData,
                      Installation_Date: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="Energy_Generation_Value">
                  Energy Generated (kWh)
                </label>
                <input
                  type="number"
                  id="Energy_Generation_Value"
                  className="form-control"
                  placeholder="e.g., 150"
                  step="0.1"
                  value={solarPanelData.Energy_Generation_Value}
                  onChange={(e) =>
                    setSolarPanelData({
                      ...solarPanelData,
                      Energy_Generation_Value: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="Grid_Emission_Factor">
                  Grid Emission Factor
                </label>
                <input
                  type="number"
                  id="Grid_Emission_Factor"
                  className="form-control"
                  placeholder="e.g., 0.7"
                  step="0.1"
                  value={solarPanelData.Grid_Emission_Factor}
                  onChange={(e) =>
                    setSolarPanelData({
                      ...solarPanelData,
                      Grid_Emission_Factor: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="Inverter_Type">Inverter Type</label>
                <select
                  id="Inverter_Type"
                  className="form-control"
                  value={solarPanelData.Inverter_Type}
                  onChange={(e) =>
                    setSolarPanelData({
                      ...solarPanelData,
                      Inverter_Type: e.target.value,
                    })
                  }
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

            <div className="form-actions">
              <button
                type="button"
                className="btn-primary btn-cancel"
                onClick={() => setActiveSolarPopup(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary btn-submit-tree">
                Save Details
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Tree Popup */}
      <div
        className={`popup-overlay ${activeTreePopup ? "active" : ""}`}
        onClick={() => setActiveTreePopup(false)}
      >
        <div
          className={`popup ${activeTreePopup ? "active" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="popup-header">
            <h2>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4CAF50"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 14l-5-5-5 5"></path>
                <path d="M12 9v12"></path>
                <path d="M12 3a5 5 0 0 1 5 5c0 2-3 3-5 3s-5-1-5-3a5 5 0 0 1 5-5z"></path>
              </svg>
              Tree Planting Details
            </h2>
            <button
              className="popup-close"
              onClick={() => setActiveTreePopup(false)}
            >
              ×
            </button>
          </div>
          <form onSubmit={handleTreeSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="TreeName">Tree Name</label>
                <input
                  type="text"
                  id="TreeName"
                  className="form-control"
                  placeholder="e.g., Mango, Pine, Neem"
                  value={treeData.TreeName}
                  onChange={(e) =>
                    setTreeData({ ...treeData, TreeName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="BotanicalName">Botanical Name</label>
                <input
                  type="text"
                  id="BotanicalName"
                  className="form-control"
                  placeholder="e.g., Mangifera indica"
                  value={treeData.BotanicalName}
                  onChange={(e) =>
                    setTreeData({ ...treeData, BotanicalName: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="PlantingDate">Planting Date</label>
                <input
                  type="date"
                  id="PlantingDate"
                  className="form-control"
                  value={treeData.PlantingDate}
                  onChange={(e) =>
                    setTreeData({ ...treeData, PlantingDate: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="Height">Height (cm)</label>
                <input
                  type="number"
                  id="Height"
                  className="form-control"
                  placeholder="e.g., 250"
                  value={treeData.Height}
                  onChange={(e) =>
                    setTreeData({ ...treeData, Height: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  className="form-control"
                  placeholder="e.g., Backyard, Community Garden"
                  value={treeData.location}
                  onChange={(e) =>
                    setTreeData({ ...treeData, location: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Tree Photos (Optional, up to 5)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files).slice(0, 5);
                  const readers = files.map((file) => {
                    return new Promise((resolve) => {
                      const reader = new FileReader();
                      reader.onload = (event) => resolve(event.target.result);
                      reader.readAsDataURL(file);
                    });
                  });
                  Promise.all(readers).then((photos) => {
                    setTreeData((prev) => ({ ...prev, photos }));
                  });
                }}
              />
              {treeData.photos.length > 0 && (
                <div className="photo-preview">
                  {treeData.photos.map((photo, index) => (
                    <div key={index} className="photo-item">
                      <img src={photo} alt={`Tree ${index + 1}`} />
                      <button type="button" onClick={() => removePhoto(index)}>
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-primary btn-cancel"
                onClick={() => setActiveTreePopup(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary btn-submit">
                Save Details
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
};

export default PopupForms;
