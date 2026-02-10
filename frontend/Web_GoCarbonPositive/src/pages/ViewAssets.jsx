import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  evService,
  solarService,
  treeService,
  assetService,
  transactionService,
} from "../services";
import "../styles/user/ViewAssets.css";
import { toast } from "react-toastify";
import { GiTreeGrowth } from "react-icons/gi";
import { PiSolarPanelLight } from "react-icons/pi";
import { MdElectricBolt } from "react-icons/md";

const ViewAssets = () => {
  const [evList, setEvList] = useState([]);
  const [solarList, setSolarList] = useState([]);
  const [treeList, setTreeList] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [initialFormData, setInitialFormData] = useState({});
  const [evTransactionList, setEvTransactionList] = useState([]);
  const [assetStatuses, setAssetStatuses] = useState({});
  const [loading, setLoading] = useState(true);

  const storedUser = JSON.parse(localStorage.getItem("authUser"));
  const userId = storedUser?.u_id || import.meta.env.VITE_DEFAULT_USER_ID;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "#10b981";
      case "rejected":
        return "#ef4444";
      case "pending":
      default:
        return "#fbbc05";
    }
  };

  const getStatusText = (status) => {
    if (!status) return "Pending";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  useEffect(() => {
    fetchAllData();
  }, [userId]);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      const [evData, solarData, treeData, statusData] = await Promise.all([
        evService.getAllEVs(userId).catch(() => ({ data: [] })),
        solarService.getAllSolarPanels(userId).catch(() => ({ data: [] })),
        treeService.getAllTrees(userId).catch(() => ({ data: [] })),
        assetService.getAllAssetStatuses(userId).catch(() => ({})),
      ]);

      console.log("✅ EV Data:", evData);
      console.log("✅ Solar Data:", solarData);
      console.log("✅ Tree Data:", treeData);

      // ✅ Debug: Check exact structure of first solar panel
      if (solarData.data && solarData.data.length > 0) {
        console.log(
          "🔍 First Solar Panel Fields:",
          Object.keys(solarData.data[0])
        );
        console.log("🔍 First Solar Panel Data:", solarData.data[0]);
      }

      setEvList(evData.data || []);
      setSolarList(solarData.data || []);
      setTreeList(treeData.data || []);
      setAssetStatuses(statusData || {});
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load assets");
    } finally {
      setLoading(false);
    }
  };

  const openModal = async (type, asset, assetType) => {
    console.log("📋 Opening modal with asset:", asset);
    setFormData(asset);
    setInitialFormData(asset);
    setIsEditing(false);

    if (assetType === "EV" && type === "View Details") {
      await fetchEVTransactions(asset.ev_id || asset.EV_ID);
    }

    setModalContent({ type, asset, assetType });
  };

  const closeModal = () => {
    setModalContent(null);
    setIsEditing(false);
    setEvTransactionList([]);
  };

  const fetchEVTransactions = async (evId) => {
    try {
      const response = await transactionService.getAllTransactions(userId);
      const evTransactions = response.data.filter(
        (t) =>
          (t.Asset_ID === evId || t.asset_id === evId) &&
          (t.Asset_Type === "ev" || t.asset_type === "ev")
      );
      setEvTransactionList(evTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setEvTransactionList([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveEV = async () => {
    try {
      const originalData = initialFormData;
      const newData = formData;

      const updatedFields = {};
      Object.keys(newData).forEach((key) => {
        if (
          newData[key] !== originalData[key] &&
          ![
            "vuid",
            "u_id",
            "v_uid",
            "ev_id",
            "VUID",
            "U_ID",
            "V_UID",
            "EV_ID",
            "created_at",
            "updated_at",
            "status",
          ].includes(key.toLowerCase())
        ) {
          updatedFields[key] = newData[key];
        }
      });

      if (Object.keys(updatedFields).length === 0) {
        toast.info("No changes to update!");
        return;
      }

      const evId = formData.ev_id || formData.EV_ID;
      await evService.updateEV(evId, updatedFields);
      toast.success("EV updated successfully!");

      const newFormData = { ...formData, ...updatedFields };
      setFormData(newFormData);
      setInitialFormData(newFormData);

      setEvList((prevList) =>
        prevList.map((item) =>
          (item.ev_id || item.EV_ID) === evId
            ? { ...item, ...newFormData }
            : item
        )
      );

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating EV:", error);
      toast.error("Failed to update EV!");
    }
  };

  const handleSaveSolar = async () => {
    try {
      const originalData = initialFormData;
      const newData = formData;

      const updatedFields = {};
      Object.keys(newData).forEach((key) => {
        if (
          newData[key] !== originalData[key] &&
          ![
            "suid",
            "u_id",
            "SUID",
            "U_ID",
            "s_uid",
            "created_at",
            "updated_at",
            "status",
          ].includes(key.toLowerCase())
        ) {
          updatedFields[key] = newData[key];
        }
      });

      if (Object.keys(updatedFields).length === 0) {
        toast.info("No changes to update!");
        return;
      }

      const solarId = formData.suid || formData.SUID || formData.s_uid;
      await solarService.updateSolarPanel(solarId, updatedFields);
      toast.success("Solar panel updated successfully!");

      const newFormData = { ...formData, ...updatedFields };
      setFormData(newFormData);
      setInitialFormData(newFormData);

      setSolarList((prevList) =>
        prevList.map((item) =>
          (item.suid || item.SUID || item.s_uid) === solarId
            ? { ...item, ...newFormData }
            : item
        )
      );

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating Solar Panel:", error);
      toast.error("Failed to update Solar Panel!");
    }
  };

  const handleSaveTree = async () => {
    try {
      const originalData = initialFormData;
      const newData = formData;

      const updatedFields = {};
      Object.keys(newData).forEach((key) => {
        if (
          newData[key] !== originalData[key] &&
          ![
            "tid",
            "u_id",
            "imageurl",
            "TID",
            "U_ID",
            "ImageURL",
            "imageUrl",
            "image_url",
            "created_at",
            "updated_at",
            "status",
          ].includes(key.toLowerCase())
        ) {
          updatedFields[key] = newData[key];
        }
      });

      if (Object.keys(updatedFields).length === 0) {
        toast.info("No changes to update!");
        return;
      }

      const treeId = formData.tid || formData.TID;
      await treeService.updateTree(treeId, updatedFields);
      toast.success("Tree updated successfully!");

      const newFormData = { ...formData, ...updatedFields };
      setFormData(newFormData);
      setInitialFormData(newFormData);

      setTreeList((prevList) =>
        prevList.map((item) =>
          (item.tid || item.TID) === treeId ? { ...item, ...newFormData } : item
        )
      );

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating Tree:", error);
      toast.error("Failed to update Tree!");
    }
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      const evId = modalContent.asset.ev_id || modalContent.asset.EV_ID;
      const payload = {
        U_ID: userId,
        Asset_Type: "ev",
        Asset_ID: evId,
        Transaction_Type: "drive",
        Amount: parseFloat(formData.active_distance) || 0,
        Description: `Drove ${formData.active_distance} km`,
      };

      await transactionService.createTransaction(payload);
      toast.success("Transaction added successfully!");
      closeModal();
      fetchAllData();
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast.error("Failed to add transaction");
    }
  };

  const formatKey = (key) => {
    return key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return "N/A";
    }
    return value.toString();
  };

  const renderModalContent = () => {
    if (!modalContent) return null;

    const { type, assetType } = modalContent;

    return (
      <motion.div
        className="asset-modal-content"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-cross" onClick={closeModal}>
          &times;
        </button>

        <h2>{type}</h2>

        {type === "View Details" ? (
          <>
            {assetType === "EV" && (
              <div className="asset-details-all">
                {Object.entries(formData)
                  .filter(
                    ([key]) =>
                      ![
                        "vuid",
                        "u_id",
                        "v_uid",
                        "ev_id",
                        "VUID",
                        "U_ID",
                        "V_UID",
                        "EV_ID",
                        "created_at",
                        "updated_at",
                        "status",
                      ].includes(key.toLowerCase())
                  )
                  .map(([key, value]) => (
                    <p key={key}>
                      <strong>{formatKey(key)}:</strong>{" "}
                      {isEditing ? (
                        <input
                          type="text"
                          name={key}
                          value={value || ""}
                          onChange={handleInputChange}
                        />
                      ) : (
                        formatValue(value)
                      )}
                    </p>
                  ))}

                <h3>Transactions</h3>
                {evTransactionList.length > 0 ? (
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {evTransactionList.map((item) => (
                        <tr key={item.Tran_ID || item.tran_id}>
                          <td>
                            {new Date(
                              item.Transaction_Date || item.transaction_date
                            ).toLocaleDateString()}
                          </td>
                          <td>
                            {item.Transaction_Type || item.transaction_type}
                          </td>
                          <td>{item.Amount || item.amount}</td>
                          <td>
                            {item.Description || item.description || "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No transactions yet.</p>
                )}

                <button
                  onClick={() => {
                    if (isEditing) {
                      handleSaveEV();
                    } else {
                      setIsEditing(true);
                    }
                  }}
                  className="asset-update-button"
                >
                  {isEditing ? "Save" : "Update"}
                </button>
              </div>
            )}

            {assetType === "Solar" && (
              <div className="asset-details-all">
                {Object.entries(formData)
                  .filter(
                    ([key]) =>
                      ![
                        "suid",
                        "u_id",
                        "SUID",
                        "U_ID",
                        "s_uid",
                        "created_at",
                        "updated_at",
                        "status",
                      ].includes(key.toLowerCase())
                  )
                  .map(([key, value]) => (
                    <p key={key}>
                      <strong>{formatKey(key)}:</strong>{" "}
                      {isEditing ? (
                        <input
                          type="text"
                          name={key}
                          value={value || ""}
                          onChange={handleInputChange}
                        />
                      ) : (
                        formatValue(value)
                      )}
                    </p>
                  ))}
                <button
                  onClick={() => {
                    if (isEditing) {
                      handleSaveSolar();
                    } else {
                      setIsEditing(true);
                    }
                  }}
                  className="asset-update-button"
                >
                  {isEditing ? "Save" : "Update"}
                </button>
              </div>
            )}

            {assetType === "Tree" && (
              <div className="asset-details-all">
                {Object.entries(formData)
                  .filter(
                    ([key]) =>
                      ![
                        "tid",
                        "u_id",
                        "imageurl",
                        "TID",
                        "U_ID",
                        "ImageURL",
                        "imageUrl",
                        "image_url",
                        "created_at",
                        "updated_at",
                        "status",
                      ].includes(key.toLowerCase())
                  )
                  .map(([key, value]) => (
                    <p key={key}>
                      <strong>{formatKey(key)}:</strong>{" "}
                      {isEditing ? (
                        <input
                          type="text"
                          name={key}
                          value={value || ""}
                          onChange={handleInputChange}
                        />
                      ) : (
                        formatValue(value)
                      )}
                    </p>
                  ))}
                <div className="tree-photo-gallery">
                  {formData.imageurl ||
                    formData.ImageURL ||
                    formData.imageUrl ||
                    formData.image_url ? (
                    <img
                      src={
                        formData.imageurl ||
                        formData.ImageURL ||
                        formData.imageUrl ||
                        formData.image_url
                      }
                      alt="Tree"
                      className="tree-photo-thumbnail"
                    />
                  ) : (
                    <p>No photo available.</p>
                  )}
                </div>
                <button
                  onClick={() => {
                    if (isEditing) {
                      handleSaveTree();
                    } else {
                      setIsEditing(true);
                    }
                  }}
                  className="asset-update-button"
                >
                  {isEditing ? "Save" : "Update"}
                </button>
              </div>
            )}
          </>
        ) : type === "Add Details" && assetType === "EV" ? (
          <form onSubmit={handleAddTransaction}>
            <p>
              <strong>Distance Driven (km):</strong>
              <input
                type="number"
                name="active_distance"
                value={formData.active_distance || ""}
                onChange={handleInputChange}
                required
                min="0"
                step="0.1"
              />
            </p>
            <button type="submit" className="asset-update-button">
              Submit
            </button>
            <button
              onClick={closeModal}
              type="button"
              className="asset-close-button"
            >
              Close
            </button>
          </form>
        ) : null}
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your sustainable assets...</p>
      </div>
    );
  }

  return (
    <div className="view-assets-container">

      <div className="view-assets-header">
        <h1 className="main-heading">My Sustainable Assets</h1>
        <p className="main-subheading">
          Building a greener future, one asset at a time
        </p>
      </div>

      {/* EV Section */}
      <section className="asset-section">
        <h2 className="section-heading">
          <MdElectricBolt className="section-icon section-icon-ev" />
          <span>Electric Vehicles</span>
        </h2>
        {evList.length === 0 ? (
          <p className="no-assets-text">No EV assets listed yet.</p>
        ) : (
          <div className="asset-cards-container">
            {evList.map((ev) => {
              const evId = ev.ev_id || ev.EV_ID;
              const model = ev.model || ev.Model || "Unnamed EV";
              const manufacturer =
                ev.manufacturers || ev.Manufacturers || "Unknown Manufacturer";
              const year = ev.purchase_year || ev.Purchase_Year || "N/A";
              const range = ev.range || ev.Range;
              const topSpeed = ev.top_speed || ev.Top_Speed;
              const status = assetStatuses[evId] || ev.status || "pending";

              return (
                <div key={evId} className="asset-card">
                  {/* Header */}
                  <div className="asset-card-header">
                    <div className="asset-card-status">
                      <span
                        className="asset-card-dot"
                        style={{ backgroundColor: getStatusColor(status) }}
                      ></span>
                      <span className="asset-card-status-text">
                        {getStatusText(status)}
                      </span>
                    </div>
                    <span className="asset-card-tag asset-card-tag-ev">EV</span>
                  </div>

                  {/* Title */}
                  <div className="asset-card-title-section">
                    <h2 className="asset-card-title">{model}</h2>
                    <p className="asset-card-subtitle">{manufacturer}</p>
                  </div>

                  {/* Info Box */}
                  <div className="asset-card-info">
                    <div className="asset-card-info-row">
                      <span>Year:</span>
                      <strong>{year}</strong>
                    </div>
                    <div className="asset-card-info-row">
                      <span>Range:</span>
                      <strong className="asset-card-highlight-ev">
                        {range ? `${range} km` : "N/A"}
                      </strong>
                    </div>
                    <div className="asset-card-info-row">
                      <span>Top Speed:</span>
                      <strong>{topSpeed ? `${topSpeed} km/h` : "N/A"}</strong>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="asset-card-actions">
                    <button
                      className="asset-card-btn asset-card-btn-outline"
                      onClick={() => openModal("View Details", ev, "EV")}
                    >
                      View
                    </button>
                    <button
                      className="asset-card-btn asset-card-btn-primary-ev"
                      onClick={() => openModal("Add Details", ev, "EV")}
                    >
                      Add
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Solar Section - ✅ FIXED */}
      <section className="asset-section">
        <h2 className="section-heading">
          <PiSolarPanelLight className="section-icon section-icon-solar" />
          <span>Solar Panels</span>
        </h2>
        {solarList.length === 0 ? (
          <p className="no-assets-text">No Solar Panel assets listed yet.</p>
        ) : (
          <div className="asset-cards-container">
            {solarList.map((solar) => {
              const solarId = solar.suid || solar.SUID || solar.s_uid;

              // ✅ FIXED: Use correct backend field names
              const inverterType =
                solar.inverter_type || solar.Inverter_Type || "microinverter";
              const capacity =
                solar.installed_capacity || solar.Installed_Capacity;
              const generation =
                solar.energy_generation_value || solar.Energy_Generation_Value;

              // ✅ FIXED: Extract year from installation_date
              const installationDate =
                solar.installation_date || solar.Installation_Date;
              const year = installationDate
                ? new Date(installationDate).getFullYear()
                : "N/A";

              const status =
                assetStatuses[solarId] || solar.status || "pending";

              return (
                <div key={solarId} className="asset-card">
                  <div className="asset-card-header">
                    <div className="asset-card-status">
                      <span
                        className="asset-card-dot"
                        style={{ backgroundColor: getStatusColor(status) }}
                      ></span>
                      <span className="asset-card-status-text">
                        {getStatusText(status)}
                      </span>
                    </div>
                    <span className="asset-card-tag asset-card-tag-solar">
                      Solar
                    </span>
                  </div>

                  <div className="asset-card-title-section">
                    <h2 className="asset-card-title">{inverterType}</h2>
                    <p className="asset-card-subtitle">Solar Panel System</p>
                  </div>

                  <div className="asset-card-info">
                    <div className="asset-card-info-row">
                      <span>Year:</span>
                      <strong>{year}</strong>
                    </div>
                    <div className="asset-card-info-row">
                      <span>Capacity:</span>
                      <strong className="asset-card-highlight-solar">
                        {capacity ? `${capacity} kW` : "N/A"}
                      </strong>
                    </div>
                    <div className="asset-card-info-row">
                      <span>Generation:</span>
                      <strong>
                        {generation ? `${generation} kWh` : "N/A"}
                      </strong>
                    </div>
                  </div>

                  <div className="asset-card-actions">
                    <button
                      className="asset-card-btn asset-card-btn-outline"
                      onClick={() => openModal("View Details", solar, "Solar")}
                    >
                      View
                    </button>
                    <button
                      className="asset-card-btn asset-card-btn-primary-solar"
                      disabled
                      style={{ opacity: 0.5, cursor: "not-allowed" }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Trees Section - ✅ FIXED */}
      <section className="asset-section">
        <h2 className="section-heading">
          <GiTreeGrowth className="section-icon section-icon-tree" />
          <span>Trees</span>
        </h2>
        {treeList.length === 0 ? (
          <p className="no-assets-text">No Tree assets listed yet.</p>
        ) : (
          <div className="asset-cards-container">
            {treeList.map((tree) => {
              const treeId = tree.tid || tree.TID;

              // ✅ FIXED: Use correct lowercase field names from backend
              const commonName =
                tree.treename ||
                tree.TreeName ||
                tree.common_name ||
                tree.Common_Name ||
                "Unnamed Tree";
              const scientificName =
                tree.botanicalname ||
                tree.BotanicalName ||
                tree.scientific_name ||
                tree.Scientific_Name ||
                "Unknown Species";

              // ✅ FIXED: Height is stored in cm, convert to meters for display
              const heightCm =
                tree.height || tree.Height || tree.height_m || tree.Height_m;
              const heightM = heightCm ? (heightCm / 100).toFixed(2) : null;

              const location = tree.location || tree.Location || "Unknown";

              // ✅ FIXED: Extract year from plantingdate (DATE field)
              const plantingDate =
                tree.plantingdate ||
                tree.PlantingDate ||
                tree.planting_date ||
                tree.Planting_Date;
              const year = plantingDate
                ? new Date(plantingDate).getFullYear()
                : "N/A";

              const status = assetStatuses[treeId] || tree.status || "pending";

              return (
                <div key={treeId} className="asset-card">
                  <div className="asset-card-header">
                    <div className="asset-card-status">
                      <span
                        className="asset-card-dot"
                        style={{ backgroundColor: getStatusColor(status) }}
                      ></span>
                      <span className="asset-card-status-text">
                        {getStatusText(status)}
                      </span>
                    </div>
                    <span className="asset-card-tag asset-card-tag-tree">
                      Tree
                    </span>
                  </div>

                  <div className="asset-card-title-section">
                    <h2 className="asset-card-title">{commonName}</h2>
                    <p className="asset-card-subtitle">{scientificName}</p>
                  </div>

                  <div className="asset-card-info">
                    <div className="asset-card-info-row">
                      <span>Planted:</span>
                      <strong>{year}</strong>
                    </div>
                    <div className="asset-card-info-row">
                      <span>Height:</span>
                      <strong className="asset-card-highlight-tree">
                        {heightM ? `${heightM} m` : "N/A"}
                      </strong>
                    </div>
                    <div className="asset-card-info-row">
                      <span>Location:</span>
                      <strong>{location}</strong>
                    </div>
                  </div>

                  <div className="asset-card-actions">
                    <button
                      className="asset-card-btn asset-card-btn-outline"
                      onClick={() => openModal("View Details", tree, "Tree")}
                    >
                      View
                    </button>
                    <button
                      className="asset-card-btn asset-card-btn-primary-tree"
                      disabled
                      style={{ opacity: 0.5, cursor: "not-allowed" }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <AnimatePresence>
        {modalContent && (
          <motion.div
            className="asset-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            {renderModalContent()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ViewAssets;
