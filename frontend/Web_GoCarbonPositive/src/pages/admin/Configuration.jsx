// src/pages/Configuration.jsx
import React, { useState } from "react";
import {
  FaSave,
  FaUndo,
  FaKey,
  FaClipboardList,
  FaBell,
  FaDollarSign,
  FaDatabase,
  FaCog,
} from "react-icons/fa";
import "../../styles/admin/Configuration.css";

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
      </div>

      {/* small toast */}
      {toast && <div className="config-toast">{toast}</div>}
    </div>
  );
};

export default Configuration;
