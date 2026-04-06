// src/pages/Configuration.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  FaSave,
  FaUndo,
  FaKey,
  FaClipboardList,
  FaBell,
  FaDollarSign,
  FaDatabase,
  FaCog,
  FaLeaf,
  FaCloudUploadAlt,
} from "react-icons/fa";
import "@features/admin/styles/Configuration.css";
import { carbonApiClient } from "@shared/utils/apiClient";

const initialCreditRules = {
  evRate: "0.8",
  treeRate: "1.2",
  solarRate: "1.0",
  windRate: "0.9",
  minVerificationDays: "7",
  autoApprovalThreshold: "100",
  requireAudit: false,
  enableMarketplace: false,
};

const initialFees = {
  transactionFee: "2.5",
  listingFee: "1.0",
  verificationFee: "50.0",
  withdrawalFee: "0.5",
  dynamicPricing: false,
};

const initialSystem = {
  dbHost: "postgres.greencredit.com",
  dbName: "greencredit_prod",
  poolSize: "20",
  sessionTimeout: "30",
  enable2FAforAdmins: false,
  enableIPWhitelist: false,
  enableAuditLogging: false,
  platformName: "GreenCredit Platform",
  defaultCurrency: "USD",
};

const fakeApiKeys = [
  { id: 1, name: "Blockchain API", lastUsed: "2024-06-15 14:30", active: true },
  { id: 2, name: "Payment Gateway", lastUsed: "2024-06-15 12:15", active: true },
  { id: 3, name: "Verification Service", lastUsed: "2024-06-14 16:45", active: true },
  { id: 4, name: "Email Service", lastUsed: "2024-06-15 10:20", active: true },
];

const Configuration = () => {
  const [activeTab, setActiveTab] = useState("credit");
  const [creditRules, setCreditRules] = useState(initialCreditRules);
  const [fees, setFees] = useState(initialFees);
  const [system, setSystem] = useState(initialSystem);
  const [apiKeys, setApiKeys] = useState(fakeApiKeys);
  const [cfcFactors, setCfcFactors] = useState([]);
  const [cfcLoading, setCfcLoading] = useState(false);
  const [cfcSavingId, setCfcSavingId] = useState(null);
  const [cfcSearch, setCfcSearch] = useState("");
  const [airports, setAirports] = useState([]);
  const [airportsLoading, setAirportsLoading] = useState(false);
  const [airportSavingCode, setAirportSavingCode] = useState(null);
  const [airportDeletingCode, setAirportDeletingCode] = useState(null);
  const [airportCreating, setAirportCreating] = useState(false);
  const [airportSearch, setAirportSearch] = useState("");
  const [newAirport, setNewAirport] = useState({
    code: "",
    name: "",
    latitude: "",
    longitude: "",
    country: "IN",
  });
  const [toast, setToast] = useState(null);

  // small helper to show temporary toast
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  // Save handlers (placeholder - replace with actual API calls)
  const handleSaveCreditRules = () => {
    console.log("Saving credit rules:", creditRules);
    showToast("Credit rules saved");
  };

  const handleResetCreditRules = () => {
    setCreditRules(initialCreditRules);
    showToast("Credit rules reset");
  };

  const handleSaveFees = () => {
    console.log("Saving fees:", fees);
    showToast("Fee settings saved");
  };

  const handleResetFees = () => {
    setFees(initialFees);
    showToast("Fee settings reset");
  };

  const handleSaveSystem = () => {
    console.log("Saving system:", system);
    showToast("System settings saved");
  };

  const handleResetSystem = () => {
    setSystem(initialSystem);
    showToast("System settings reset");
  };

  // API Keys actions
  const handleRegenerateKey = (id) => {
    console.log("Regenerate key id:", id);
    showToast("API key regenerated (placeholder)");
  };
  const handleRevokeKey = (id) => {
    setApiKeys((prev) => prev.map(k => k.id === id ? { ...k, active: false } : k));
    console.log("Revoke key id:", id);
    showToast("API key revoked");
  };
  const handleGenerateNewKey = () => {
    const newKey = {
      id: Date.now(),
      name: `New Key ${apiKeys.length + 1}`,
      lastUsed: "Never",
      active: true,
    };
    setApiKeys((p) => [...p, newKey]);
    showToast("New API key generated");
  };

  // Small utilities
  const handleInputChange = (setter) => (e) => {
    const { name, value, type, checked } = e.target;
    setter((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const loadCfcFactors = async () => {
    try {
      setCfcLoading(true);
      const res = await carbonApiClient.get("/v1/factors");
      const rows = Array.isArray(res?.data?.data) ? res.data.data : [];
      setCfcFactors(rows);
    } catch (error) {
      console.error("Failed to load CFC factors:", error);
      showToast("Failed to load CFC factors");
    } finally {
      setCfcLoading(false);
    }
  };

  const loadAirports = async () => {
    try {
      setAirportsLoading(true);
      const res = await carbonApiClient.get("/v1/airports/admin");
      const rows = Array.isArray(res?.data?.data) ? res.data.data : [];
      setAirports(rows);
    } catch (error) {
      console.error("Failed to load airports:", error);
      showToast("Failed to load airports");
    } finally {
      setAirportsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab !== "cfc") return;
    loadCfcFactors();
    loadAirports();
  }, [activeTab]);

  const filteredCfcFactors = useMemo(() => {
    const q = cfcSearch.trim().toLowerCase();
    if (!q) return cfcFactors;

    return cfcFactors.filter((row) => {
      return (
        String(row.category || "").toLowerCase().includes(q) ||
        String(row.sub_category || "").toLowerCase().includes(q) ||
        String(row.region || "").toLowerCase().includes(q) ||
        String(row.source || "").toLowerCase().includes(q) ||
        String(row.version || "").toLowerCase().includes(q)
      );
    });
  }, [cfcFactors, cfcSearch]);

  const updateCfcDraftField = (id, key, value) => {
    setCfcFactors((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [key]: value } : row))
    );
  };

  const filteredAirports = useMemo(() => {
    const q = airportSearch.trim().toLowerCase();
    if (!q) return airports;

    return airports.filter((row) => (
      String(row.code || "").toLowerCase().includes(q) ||
      String(row.name || "").toLowerCase().includes(q) ||
      String(row.country || "").toLowerCase().includes(q)
    ));
  }, [airports, airportSearch]);

  const updateAirportField = (code, key, value) => {
    setAirports((prev) =>
      prev.map((row) => (row.code === code ? { ...row, [key]: value } : row))
    );
  };

  const saveCfcFactor = async (row) => {
    try {
      setCfcSavingId(row.id);
      await carbonApiClient.put(`/v1/factors/${row.id}`, {
        category: row.category,
        sub_category: row.sub_category,
        unit: row.unit,
        value: Number(row.value),
        region: row.region,
        year: Number(row.year),
        source: row.source,
        version: row.version,
      });
      showToast("CFC factor updated");
    } catch (error) {
      console.error("Failed to update CFC factor:", error);
      showToast("Failed to update CFC factor");
    } finally {
      setCfcSavingId(null);
    }
  };

  const saveAirport = async (row) => {
    try {
      setAirportSavingCode(row.code);
      await carbonApiClient.put(`/v1/airports/admin/${encodeURIComponent(row.code)}`, {
        name: row.name,
        latitude: Number(row.latitude),
        longitude: Number(row.longitude),
        country: String(row.country || "").toUpperCase(),
      });
      showToast("Airport updated");
    } catch (error) {
      console.error("Failed to update airport:", error);
      showToast("Failed to update airport");
    } finally {
      setAirportSavingCode(null);
    }
  };

  const removeAirport = async (code) => {
    try {
      setAirportDeletingCode(code);
      await carbonApiClient.delete(`/v1/airports/admin/${encodeURIComponent(code)}`);
      setAirports((prev) => prev.filter((row) => row.code !== code));
      showToast("Airport deleted");
    } catch (error) {
      console.error("Failed to delete airport:", error);
      showToast("Failed to delete airport");
    } finally {
      setAirportDeletingCode(null);
    }
  };

  const createAirport = async () => {
    try {
      setAirportCreating(true);
      await carbonApiClient.post("/v1/airports/admin", {
        code: String(newAirport.code || "").toUpperCase().trim(),
        name: newAirport.name,
        latitude: Number(newAirport.latitude),
        longitude: Number(newAirport.longitude),
        country: String(newAirport.country || "").toUpperCase().trim(),
      });

      setNewAirport({
        code: "",
        name: "",
        latitude: "",
        longitude: "",
        country: "IN",
      });

      await loadAirports();
      showToast("Airport created");
    } catch (error) {
      console.error("Failed to create airport:", error);
      showToast("Failed to create airport");
    } finally {
      setAirportCreating(false);
    }
  };

  return (
    <div className="config-page__container">
      {/* Tabs */}
      <div className="config-page__tabs">
        <button
          className={`config-tab ${activeTab === "credit" ? "active" : ""}`}
          onClick={() => setActiveTab("credit")}
        >
          <FaKey /> Credit Rules
        </button>
        <button
          className={`config-tab ${activeTab === "fees" ? "active" : ""}`}
          onClick={() => setActiveTab("fees")}
        >
          <FaDollarSign /> Fees & Pricing
        </button>
        <button
          className={`config-tab ${activeTab === "notifications" ? "active" : ""}`}
          onClick={() => setActiveTab("notifications")}
        >
          <FaBell /> Notifications
        </button>
        <button
          className={`config-tab ${activeTab === "apikeys" ? "active" : ""}`}
          onClick={() => setActiveTab("apikeys")}
        >
          <FaClipboardList /> API Keys
        </button>
        <button
          className={`config-tab ${activeTab === "system" ? "active" : ""}`}
          onClick={() => setActiveTab("system")}
        >
          <FaCog /> System
        </button>
        <button
          className={`config-tab ${activeTab === "cfc" ? "active" : ""}`}
          onClick={() => setActiveTab("cfc")}
        >
          <FaLeaf /> CFC
        </button>
      </div>

      {/* Content */}
      <div className="config-page__content">
        {activeTab === "credit" && (
          <section className="config-card config-credit">
            <div className="config-card__header">
              <h2><FaKey className="config-icon" /> Carbon Credit Rules</h2>
              <div className="config-actions-right">
                <button className="config-btn config-btn--outline" onClick={handleResetCreditRules}>
                  <FaUndo /> Reset to Defaults
                </button>
                <button className="config-btn config-btn--primary" onClick={handleSaveCreditRules}>
                  <FaSave /> Save Credit Rules
                </button>
              </div>
            </div>

            <div className="config-grid two-col">
              <div className="config-field">
                <label>EV Credit Rate (per mile)</label>
                <input
                  name="evRate"
                  value={creditRules.evRate}
                  onChange={handleInputChange(setCreditRules)}
                  type="text"
                />
                <small>Credits generated per mile driven</small>
              </div>

              <div className="config-field">
                <label>Min Verification Period (days)</label>
                <input
                  name="minVerificationDays"
                  value={creditRules.minVerificationDays}
                  onChange={handleInputChange(setCreditRules)}
                  type="text"
                />
                <small>Minimum days for verification process</small>
              </div>

              <div className="config-field">
                <label>Tree Credit Rate (per tree)</label>
                <input
                  name="treeRate"
                  value={creditRules.treeRate}
                  onChange={handleInputChange(setCreditRules)}
                  type="text"
                />
                <small>Credits generated per tree planted</small>
              </div>

              <div className="config-field">
                <label>Auto Approval Threshold</label>
                <input
                  name="autoApprovalThreshold"
                  value={creditRules.autoApprovalThreshold}
                  onChange={handleInputChange(setCreditRules)}
                  type="text"
                />
                <small>Credits below this amount are auto-approved</small>
              </div>

              <div className="config-field">
                <label>Solar Credit Rate (per kWh)</label>
                <input
                  name="solarRate"
                  value={creditRules.solarRate}
                  onChange={handleInputChange(setCreditRules)}
                  type="text"
                />
                <small>Credits generated per kWh produced</small>
              </div>

              <div className="config-field">
                <label>Wind Credit Rate (per kWh)</label>
                <input
                  name="windRate"
                  value={creditRules.windRate}
                  onChange={handleInputChange(setCreditRules)}
                  type="text"
                />
                <small>Credits generated per kWh produced</small>
              </div>
            </div>

            <div className="config-toggle-row">
              <label className="config-toggle">
                <input
                  name="requireAudit"
                  type="checkbox"
                  checked={creditRules.requireAudit}
                  onChange={handleInputChange(setCreditRules)}
                />
                <span>Require Third-Party Audit</span>
              </label>

              <label className="config-toggle">
                <input
                  name="enableMarketplace"
                  type="checkbox"
                  checked={creditRules.enableMarketplace}
                  onChange={handleInputChange(setCreditRules)}
                />
                <span>Enable Marketplace Features</span>
              </label>
            </div>
          </section>
        )}

        {activeTab === "fees" && (
          <section className="config-card config-fees">
            <div className="config-card__header">
              <h2><FaDollarSign className="config-icon" /> Platform Fees & Pricing</h2>
              <div className="config-actions-right">
                <button className="config-btn config-btn--outline" onClick={handleResetFees}>
                  <FaUndo /> Reset
                </button>
                <button className="config-btn config-btn--primary" onClick={handleSaveFees}>
                  <FaSave /> Save Fee Settings
                </button>
              </div>
            </div>

            <div className="config-grid two-col">
              <div className="config-field">
                <label>Transaction Fee (%)</label>
                <input name="transactionFee" value={fees.transactionFee} onChange={handleInputChange(setFees)} />
                <small>Percentage fee on marketplace transactions</small>
              </div>

              <div className="config-field">
                <label>Verification Fee ($)</label>
                <input name="verificationFee" value={fees.verificationFee} onChange={handleInputChange(setFees)} />
                <small>Fixed fee for asset verification</small>
              </div>

              <div className="config-field">
                <label>Listing Fee (%)</label>
                <input name="listingFee" value={fees.listingFee} onChange={handleInputChange(setFees)} />
                <small>Fee for creating marketplace listings</small>
              </div>

              <div className="config-field">
                <label>Withdrawal Fee (%)</label>
                <input name="withdrawalFee" value={fees.withdrawalFee} onChange={handleInputChange(setFees)} />
                <small>Fee for withdrawing funds</small>
              </div>
            </div>

            <div className="config-toggle-row">
              <label className="config-toggle">
                <input name="dynamicPricing" type="checkbox" checked={fees.dynamicPricing} onChange={handleInputChange(setFees)} />
                <span>Enable Dynamic Pricing</span>
                <small>Adjust fees based on market conditions</small>
              </label>
            </div>
          </section>
        )}

        {activeTab === "notifications" && (
          <section className="config-card config-notifications">
            <div className="config-card__header">
              <h2><FaBell className="config-icon" /> Notifications</h2>
              <div className="config-actions-right">
                <button className="config-btn config-btn--primary" onClick={() => { console.log("Save notifications"); showToast("Notifications saved"); }}>
                  <FaSave /> Save Notifications
                </button>
              </div>
            </div>

            <div className="config-grid single-col">
              <div className="config-field">
                <label>Email Alerts</label>
                <select>
                  <option>Enabled (Immediate)</option>
                  <option>Digest (Daily)</option>
                  <option>Disabled</option>
                </select>
                <small>System and verification alerts to admins</small>
              </div>

              <div className="config-field">
                <label>SMS Alerts</label>
                <select>
                  <option>Disabled</option>
                  <option>Enabled</option>
                </select>
                <small>Optional SMS alerts for critical events</small>
              </div>

              <div className="config-field">
                <label>Webhook Endpoints</label>
                <input placeholder="https://your-webhook.example/endpoint" />
                <small>Send real-time events to your systems</small>
              </div>
            </div>
          </section>
        )}

        {activeTab === "apikeys" && (
          <section className="config-card config-apikeys">
            <div className="config-card__header">
              <h2><FaClipboardList className="config-icon" /> API Keys & Integrations</h2>
              <div className="config-actions-right">
                <button className="config-btn config-btn--outline" onClick={() => { console.log("Export keys"); showToast("Exported keys (placeholder)"); }}>
                  <FaCloudUploadAlt /> Export
                </button>
                <button className="config-btn config-btn--primary" onClick={handleGenerateNewKey}>
                  <FaKey /> Generate New API Key
                </button>
              </div>
            </div>

            <div className="config-api-list">
              {apiKeys.map((k) => (
                <div className="config-api-row" key={k.id}>
                  <div className="config-api-left">
                    <div className="api-name">
                      <strong>{k.name}</strong> <span className={`config-badge ${k.active ? "green" : "gray"}`}>{k.active ? "active" : "inactive"}</span>
                    </div>
                    <div className="api-sub">Used for integrations • Last used: {k.lastUsed}</div>
                    <div className="api-key-visual">********************…</div>
                  </div>

                  <div className="config-api-actions">
                    <button className="small-btn" onClick={() => handleRegenerateKey(k.id)}>Regenerate</button>
                    <button className="small-btn outline" onClick={() => handleRevokeKey(k.id)}>Revoke</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "system" && (
          <section className="config-card config-system">
            <div className="config-card__header">
              <h2><FaDatabase className="config-icon" /> System</h2>
              <div className="config-actions-right">
                <button className="config-btn config-btn--outline" onClick={handleResetSystem}>
                  <FaUndo /> Reset to Defaults
                </button>
                <button className="config-btn config-btn--primary" onClick={handleSaveSystem}>
                  <FaSave /> Save All Changes
                </button>
              </div>
            </div>

            <div className="config-grid two-col">
              <div className="config-field">
                <label>Database Host</label>
                <input name="dbHost" value={system.dbHost} onChange={handleInputChange(setSystem)} />
                <small>Postgres connection host</small>
              </div>

              <div className="config-field">
                <label>Default Currency</label>
                <input name="defaultCurrency" value={system.defaultCurrency} onChange={handleInputChange(setSystem)} />
                <small>ISO currency for the platform</small>
              </div>

              <div className="config-field">
                <label>Database Name</label>
                <input name="dbName" value={system.dbName} onChange={handleInputChange(setSystem)} />
              </div>

              <div className="config-field">
                <label>Maintenance Mode</label>
                <select>
                  <option>Disabled</option>
                  <option>Enabled</option>
                </select>
              </div>

              <div className="config-field">
                <label>Connection Pool Size</label>
                <input name="poolSize" value={system.poolSize} onChange={handleInputChange(setSystem)} />
                <small>Number of DB connections in pool</small>
              </div>

              <div className="config-field">
                <label>Session Timeout (minutes)</label>
                <input name="sessionTimeout" value={system.sessionTimeout} onChange={handleInputChange(setSystem)} />
              </div>
            </div>

            <div className="config-toggle-row">
              <label className="config-toggle">
                <input name="enable2FAforAdmins" type="checkbox" checked={system.enable2FAforAdmins} onChange={handleInputChange(setSystem)} />
                <span>Require 2FA for Admins</span>
              </label>

              <label className="config-toggle">
                <input name="enableIPWhitelist" type="checkbox" checked={system.enableIPWhitelist} onChange={handleInputChange(setSystem)} />
                <span>Enable IP Whitelisting</span>
              </label>

              <label className="config-toggle">
                <input name="enableAuditLogging" type="checkbox" checked={system.enableAuditLogging} onChange={handleInputChange(setSystem)} />
                <span>Enable Audit Logging</span>
              </label>
            </div>
          </section>
        )}

        {activeTab === "cfc" && (
          <section className="config-card config-cfc">
            <div className="config-card__header">
              <h2><FaLeaf className="config-icon" /> CFC Emission Factors</h2>
              <div className="config-actions-right">
                <button className="config-btn config-btn--outline" onClick={loadCfcFactors}>
                  <FaUndo /> Refresh
                </button>
              </div>
            </div>

            <div className="config-field">
              <label>Search Factors</label>
              <input
                value={cfcSearch}
                onChange={(e) => setCfcSearch(e.target.value)}
                placeholder="Search by category, sub category, region, source, version"
              />
            </div>

            <div className="config-cfc-table-wrap">
              <table className="config-cfc-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Sub Category</th>
                    <th>Unit</th>
                    <th>Value</th>
                    <th>Region</th>
                    <th>Year</th>
                    <th>Source</th>
                    <th>Version</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cfcLoading ? (
                    <tr>
                      <td colSpan={9} className="config-cfc-empty">Loading emission factors...</td>
                    </tr>
                  ) : filteredCfcFactors.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="config-cfc-empty">No emission factors found.</td>
                    </tr>
                  ) : (
                    filteredCfcFactors.map((row) => (
                      <tr key={row.id}>
                        <td>
                          <input
                            value={row.category || ""}
                            onChange={(e) => updateCfcDraftField(row.id, "category", e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            value={row.sub_category || ""}
                            onChange={(e) => updateCfcDraftField(row.id, "sub_category", e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            value={row.unit || ""}
                            onChange={(e) => updateCfcDraftField(row.id, "unit", e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            step="0.00001"
                            value={row.value ?? ""}
                            onChange={(e) => updateCfcDraftField(row.id, "value", e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            value={row.region || ""}
                            onChange={(e) => updateCfcDraftField(row.id, "region", e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={row.year ?? ""}
                            onChange={(e) => updateCfcDraftField(row.id, "year", e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            value={row.source || ""}
                            onChange={(e) => updateCfcDraftField(row.id, "source", e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            value={row.version || ""}
                            onChange={(e) => updateCfcDraftField(row.id, "version", e.target.value)}
                          />
                        </td>
                        <td>
                          <button
                            className="small-btn"
                            onClick={() => saveCfcFactor(row)}
                            disabled={cfcSavingId === row.id}
                          >
                            {cfcSavingId === row.id ? "Saving..." : "Save"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="config-cfc-divider" />

            <div className="config-card__header">
              <h2><FaDatabase className="config-icon" /> Airports</h2>
              <div className="config-actions-right">
                <button className="config-btn config-btn--outline" onClick={loadAirports}>
                  <FaUndo /> Refresh Airports
                </button>
              </div>
            </div>

            <div className="config-grid two-col">
              <div className="config-field">
                <label>Airport Code</label>
                <input
                  value={newAirport.code}
                  onChange={(e) => setNewAirport((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
                  placeholder="DEL"
                  maxLength={3}
                />
              </div>
              <div className="config-field">
                <label>Airport Name</label>
                <input
                  value={newAirport.name}
                  onChange={(e) => setNewAirport((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Indira Gandhi International Airport"
                />
              </div>
              <div className="config-field">
                <label>Latitude</label>
                <input
                  type="number"
                  step="0.000001"
                  value={newAirport.latitude}
                  onChange={(e) => setNewAirport((p) => ({ ...p, latitude: e.target.value }))}
                />
              </div>
              <div className="config-field">
                <label>Longitude</label>
                <input
                  type="number"
                  step="0.000001"
                  value={newAirport.longitude}
                  onChange={(e) => setNewAirport((p) => ({ ...p, longitude: e.target.value }))}
                />
              </div>
              <div className="config-field">
                <label>Country</label>
                <input
                  value={newAirport.country}
                  onChange={(e) => setNewAirport((p) => ({ ...p, country: e.target.value.toUpperCase() }))}
                  placeholder="IN"
                  maxLength={2}
                />
              </div>
            </div>

            <div className="config-actions-right" style={{ marginTop: "10px" }}>
              <button
                className="config-btn config-btn--primary"
                onClick={createAirport}
                disabled={airportCreating}
              >
                <FaSave /> {airportCreating ? "Creating..." : "Create Airport"}
              </button>
            </div>

            <div className="config-field" style={{ marginTop: "14px" }}>
              <label>Search Airports</label>
              <input
                value={airportSearch}
                onChange={(e) => setAirportSearch(e.target.value)}
                placeholder="Search by code, name, country"
              />
            </div>

            <div className="config-cfc-table-wrap">
              <table className="config-cfc-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Latitude</th>
                    <th>Longitude</th>
                    <th>Country</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {airportsLoading ? (
                    <tr>
                      <td colSpan={6} className="config-cfc-empty">Loading airports...</td>
                    </tr>
                  ) : filteredAirports.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="config-cfc-empty">No airports found.</td>
                    </tr>
                  ) : (
                    filteredAirports.map((row) => (
                      <tr key={row.code}>
                        <td>
                          <input value={row.code || ""} disabled />
                        </td>
                        <td>
                          <input
                            value={row.name || ""}
                            onChange={(e) => updateAirportField(row.code, "name", e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            step="0.000001"
                            value={row.latitude ?? ""}
                            onChange={(e) => updateAirportField(row.code, "latitude", e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            step="0.000001"
                            value={row.longitude ?? ""}
                            onChange={(e) => updateAirportField(row.code, "longitude", e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            value={row.country || ""}
                            onChange={(e) => updateAirportField(row.code, "country", e.target.value.toUpperCase())}
                            maxLength={2}
                          />
                        </td>
                        <td>
                          <div className="config-inline-actions">
                            <button
                              className="small-btn"
                              onClick={() => saveAirport(row)}
                              disabled={airportSavingCode === row.code}
                            >
                              {airportSavingCode === row.code ? "Saving..." : "Save"}
                            </button>
                            <button
                              className="small-btn outline"
                              onClick={() => removeAirport(row.code)}
                              disabled={airportDeletingCode === row.code}
                            >
                              {airportDeletingCode === row.code ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>

      {/* small toast */}
      {toast && <div className="config-toast">{toast}</div>}
    </div>
  );
};

export default Configuration;
