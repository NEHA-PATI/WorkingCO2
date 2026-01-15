// PopupForms.js - React component file with all three popup forms
import React, { useState, useEffect } from "react";
import "../../styles/org/popupforms.css";
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
  setSolarCount, // ✅ Add this line!
}) => {
  // State for managing popups

  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  // List state for fetched data
  const [evList, setEvList] = useState([]); // All EVs from backend
  const [treeList, setTreeList] = useState([]); // All trees from backend
  const [solarPanels, setSolarPanels] = useState([]); // All solar panels from backend

  const [solarPanelData, setSolarPanelData] = useState({
    Installed_Capacity: "",
    Installation_Date: "",
    Energy_Generation_Value: "",
    Energy_Generation: "",
    Grid_Emission_Factor: "",
    Inverter_Type: "",
    Panel_Efficiency: "",
  });

  const [evData, setEVData] = useState({
    manufacturer: "",
    model: "",
    year: "",
    batteryCapacity: "",
    range: "",
    EVCategory: "",
    chargingType: "",
    averageMileage: "",
    homeCharging: "yes",
    publicCharging: "sometimes",
    lastServiceDate: "",
  });
  const [treeData, setTreeData] = useState({
    TreeName: "",
    BotanicalName: "", // ✅ add this line
    PlantingDate: "",
    DBH: "",
    Height: "",
    location: "",
    photos: [],
  });

  // Toast notification handler
  const showToast = (message, type = "success") => {
    console.log("🔔 Showing toast:", message, type);
    setToast({ show: true, message, type });
    setTimeout(() => {
      console.log("🔔 Hiding toast");
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleSolarSubmit = async (e) => {
    e.preventDefault();

    // Hardcoded U_ID for demo purposes - you can change this to any valid user ID
    const U_ID = "DEMO_USER_001";

    const payload = {
      SUID: crypto.randomUUID(),
      U_ID,
      Installed_Capacity: solarPanelData.Installed_Capacity,
      Installation_Date: solarPanelData.Installation_Date,
      Energy_Generation_Value: Number(solarPanelData.Energy_Generation_Value),

      Grid_Emission_Factor: Number(solarPanelData.Grid_Emission_Factor),
      Inverter_Type: solarPanelData.Inverter_Type,
    };

    // ✅ Debug log
    console.log("Submitting Solar Panel Payload:", payload);

    // ✅ Quick client-side validation
    const missingFields = Object.entries(payload).filter(
      ([_, val]) =>
        val === undefined ||
        val === null ||
        val === "" ||
        (typeof val === "string" && val.trim() === "")
    );

    if (missingFields.length > 0) {
      showToast(
        `Missing fields: ${missingFields.map((f) => f[0]).join(", ")}`,
        "error"
      );
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/solarpanel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const { data: savedSolar, solarCount } = await response.json();
        setSolarCount(solarCount);
        showToast(`Solar Panel saved! Total: ${solarCount}`, "success");
        // Let AddAsset.jsx handle the popup closing and navigation
        handleSaveSolar(savedSolar);
      } else {
        const err = await response.json();
        showToast("Failed: " + (err.message || "Unknown error"), "error");
      }
    } catch (err) {
      showToast("Server error: " + err.message, "error");
    }
  };

  const handleEVSubmit = async (e) => {
    e.preventDefault();

    // Hardcoded U_ID for demo purposes - you can change this to any valid user ID
    const U_ID = "DEMO_USER_001";

    // 📦 Construct payload
    const payload = {
      VUID: crypto.randomUUID(), // Generate unique VUID on frontend
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

    // ✅ Debug log
    console.log("🔍 Submitting EV Payload:", payload);

    try {
      const response = await fetch("http://localhost:8080/api/evmasterdata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const { data: savedEV, evCount } = await response.json();

        // ✅ Only call if it's a valid function
        if (typeof setEvCount === "function") {
          setEvCount(evCount);
        }

        showToast(`EV saved! Total EVs: ${evCount}`, "success");

        // ✅ Save new activity to localStorage
        const newActivity = {
          title: "EV Added",
          detail: `${evData.manufacturer} ${evData.model} - ${evData.range} km range`,
          time: "Just now",
          credits: 20, // Adjust as per logic
          color: "bg-blue-100",
        };

        localStorage.setItem("latestActivity", JSON.stringify(newActivity));

        // Let AddAsset.jsx handle the popup closing and navigation
        handleSaveEV(savedEV);
      } else {
        const errMsg = await response.text();
        console.error("EV submit failed:", errMsg);
        showToast("Failed to save EV: " + errMsg, "error");
      }
    } catch (error) {
      console.error("EV submit error:", error);
      showToast("Server error! " + error.message, "error");
    }
  };

  const handleTreeSubmit = async (e) => {
    e.preventDefault();

    // Hardcoded U_ID for demo purposes - you can change this to any valid user ID
    const U_ID = "DEMO_USER_001";

    try {
      let imageUrls = [];

      // ✅ Pehle images upload karo agar photos hai
      if (treeData.photos && treeData.photos.length > 0) {
        const formData = new FormData();
        treeData.photos.forEach((photo) => {
          const blob = dataURLtoBlob(photo);
          formData.append("images", blob);
        });

        const imageRes = await fetch("http://localhost:8080/api/image/upload", {
          method: "POST",
          body: formData,
        });

        const imageData = await imageRes.json();
        if (!imageRes.ok) {
          showToast(imageData.message || "Failed to upload images.", "error");
          return;
        }

        console.log("✅ Uploaded images:", imageData.imageUrls);
        imageUrls = imageData.imageUrls;
      }

      // ✅ Tree payload banayo
      const payload = {
        UID: U_ID,
        TreeName: treeData.TreeName,
        BotanicalName: treeData.BotanicalName,
        PlantingDate: treeData.PlantingDate,
        Height: parseFloat(treeData.Height),
        Location: treeData.location,
        imageIds: imageUrls,
        CreatedBy: "Demo User",
      };

      // ✅ Tree save request
      const response = await fetch("http://localhost:8080/api/tree", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        showToast("Tree data saved successfully!", "success");
        // Let AddAsset.jsx handle the popup closing and navigation
        handleSaveTree(response.data);
      } else {
        const data = await response.json();
        showToast(data.message || "Failed to save tree data.", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Server error!", "error");
    }
  };

  // ✅ Helper function: dataURL to Blob
  function dataURLtoBlob(dataURL) {
    const byteString = atob(dataURL.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: "image/jpeg" });
    return blob;
  }

  // File upload handler for tree photos

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
                  <option value="Three-Wheeler">Three-Wheeler </option>
                  <option value="Hatchbacks">Hatchbacks</option>
                  <option value="Sedans">Sedans</option>
                  <option value="SUVs">SUVs</option>
                  <option value="MPVs">MPVs</option>
                  <option value="Buses">Buses</option>
                  <option value="Trucks">Trucks</option>
                  <option value="Vans">Vans</option>
                  <option value="Tractors">Tractors</option>
                  <option value="nForklifts">Forklifts</option>
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
                <label htmlFor="energyConsumed">Energy consumed(kWh)</label>
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
                <label htmlFor="range">Range (Km) </label>
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
                  placeholder="e.g., 5 "
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
                <label htmlFor="topSpeed">Top Speed</label>
                <input
                  type="number"
                  id="topSpeed"
                  className="form-control"
                  placeholder="e.g., 80km/h"
                  min="0"
                  value={evData.topSpeed}
                  onChange={(e) =>
                    setEVData({ ...evData, topSpeed: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="chargingTime">Charging time</label>
                <input
                  type="number"
                  id="chargingTime"
                  className="form-control"
                  placeholder="e.g., 1 hr"
                  min="0"
                  value={evData.chargingTime}
                  onChange={(e) =>
                    setEVData({ ...evData, chargingTime: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="motorpower">Motor power</label>
                <input
                  type="number"
                  id="motorpower"
                  className="form-control"
                  placeholder="e.g., 5 w"
                  min="0"
                  value={evData.motorpower}
                  onChange={(e) =>
                    setEVData({ ...evData, motorpower: e.target.value })
                  }
                  required
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
                stroke="#FF9800"
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
                <label htmlFor="Height">Height</label>
                <input
                  type="number"
                  id="Height"
                  className="form-control"
                  placeholder="e.g., In CM"
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
                <label htmlFor="location">Location Description</label>
                <input
                  type="text"
                  id="location"
                  className="form-control"
                  placeholder="e.g., Backyard, Community Garden, 123 Main St"
                  value={treeData.location}
                  onChange={(e) =>
                    setTreeData({ ...treeData, location: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Tree Photos (Upload up to 5)</label>
              <label className="file-upload">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = e.target.files;
                    if (!files || files.length === 0) return;

                    const updatedPhotos = Array.from(files).slice(0, 5);
                    const fileReaders = [];
                    const base64Images = [];

                    updatedPhotos.forEach((file) => {
                      const reader = new FileReader();
                      fileReaders.push(reader);

                      reader.onload = (event) => {
                        base64Images.push(event.target.result);
                        if (base64Images.length === updatedPhotos.length) {
                          setTreeData((prev) => ({
                            ...prev,
                            photos: [
                              ...(prev.photos || []),
                              ...base64Images,
                            ].slice(0, 5),
                          }));
                        }
                      };

                      reader.readAsDataURL(file);
                    });
                  }}
                  disabled={(treeData.photos || []).length >= 5}
                />
                <svg
                  className="file-upload-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <div className="file-upload-text">
                  <strong>Click to upload photos</strong>
                  <p>Install GPS MAP CAMERA and upload the picture</p>
                  <p>PER IMAGE LIMIT 1 Mb</p>
                  <p>{(treeData.photos || []).length}/5 photos uploaded</p>
                </div>
              </label>
              {(treeData.photos || []).length > 0 && (
                <div className="photo-preview">
                  {treeData.photos.map((photo, index) => (
                    <div key={index} className="photo-item">
                      <img src={photo} alt={`Tree photo ${index + 1}`} />
                      <button
                        type="button"
                        className="remove-photo"
                        onClick={() => removePhoto(index)}
                      >
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
              <button type="submit" className="btn-primary btn-submit-tree">
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
                stroke="#4CAF50"
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
                <label htmlFor="Installed_Capacity">Installed Capacity</label>
                <input
                  type="text"
                  id="Installed_Capacity"
                  className="form-control"
                  placeholder="e.g., 3kw"
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
                <label htmlFor="Installation_Date">Installation_Date</label>
                <input
                  type="date"
                  id="Installation_Date"
                  className="form-control"
                  placeholder="e.g., 3kw"
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
                  Energy Generation Value
                </label>
                <input
                  type="number"
                  id="Energy_Generation_Value"
                  className="form-control"
                  placeholder="e.g., 3kw"
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
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="Grid_Emission_Factor">
                  Grid_Emission_Factor
                </label>
                <input
                  type="number"
                  id="Grid_Emission_Factor"
                  className="form-control"
                  placeholder="e.g., 30"
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

              <div className="form-group">
                <label htmlFor="Inverter_Type">Inverter_Type</label>
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
            <div className="form-row"></div>
            <div className="form-row"></div>
            <div className="form-actions">
              <button
                type="button"
                className="btn-primary btn-cancel"
                onClick={() => setActiveSolarPopup(false)}
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

      {/* Toast Notification */}
      <div className={`toast ${toast.show ? "show" : ""} ${toast.type}`}>
        {toast.type === "error" ? (
          <svg
            className="toast-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        ) : (
          <svg
            className="toast-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        )}
        <span className="toast-message">{toast.message}</span>
      </div>
    </div>
  );
};
export default PopupForms;
