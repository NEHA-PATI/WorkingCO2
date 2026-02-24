import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaEye, FaEyeSlash, FaGift } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "@shared/ui/styles/wallet.css";
// import { fireToast } from "@shared/utils/toastService";
import { TOAST_MSG } from "@shared/utils/toastMessages";

const Wallet = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [page, setPage] = useState("landing");
  const [entryFlow, setEntryFlow] = useState("new");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [verifyAddressInput, setVerifyAddressInput] = useState("");
  const [hideBalance, setHideBalance] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState("Account 1");
  const [showAccountsPopup, setShowAccountsPopup] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [loaderText, setLoaderText] = useState(
    "Your wallet is being prepared...",
  );

  const [accounts] = useState([
    {
      id: 1,
      name: "Account 1",
      balance: 27856.56,
      color: "#38b000",
      address: "0x6d540f5a8d73f2e2465272f9f0f8d98f275fc911",
    },
  ]);

  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);

  const [transactions] = useState([
    {
      id: 1,
      type: "Sent",
      amount: -500,
      currency: "IDR",
      method: "Credit Card",
      status: "Success",
      activity: "Sending money to Raihan Fikri",
    },
    {
      id: 2,
      type: "Sent",
      amount: -200000,
      currency: "IDR",
      method: "Wire Transfer",
      status: "Success",
      activity: "Sending money to Bani Zuhilmin",
    },
    {
      id: 3,
      type: "Received",
      amount: 1500,
      currency: "USD",
      method: "Bank Transfer",
      status: "Success",
      activity: "Received money from Andrew",
    },
    {
      id: 4,
      type: "Received",
      amount: 2500,
      currency: "USD",
      method: "PayPal",
      status: "Success",
      activity: "Payment for product",
    },
    {
      id: 5,
      type: "Received",
      amount: 1500,
      currency: "USD",
      method: "Payoneer",
      status: "Incomplete",
      activity: "Payment for invoice",
    },
    {
      id: 6,
      type: "Converted",
      amount: 400000,
      currency: "IDR",
      method: "Debit Card",
      status: "Failed",
      activity: "Convert money from USD to IDR",
    },
  ]);

  const [filteredTransactions, setFilteredTransactions] =
    useState(transactions);
  const [filterType, setFilterType] = useState("All");
  const [activityPage, setActivityPage] = useState("dashboard");

  useEffect(() => {
    setMounted(true);
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);
  const startLoadingAndNavigate = (nextPage) => {
    setLoaderText("Your wallet is being prepared...");
    setShowLoader(true);

    setTimeout(() => {
      setShowLoader(false);
      setPage(nextPage);
    }, 4500); // 4.5 sec vibe
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setToast(null), 5000);
  };

  const normalizeAddress = (value) => value.trim().toLowerCase();

  const handleVerifyAddress = (e) => {
    e.preventDefault();
    const candidate = normalizeAddress(verifyAddressInput);

    if (!candidate) {
      showToast(TOAST_MSG.PROFILE.REQUIRED, "error");

      return;
    }

    const matched = accounts.some(
      (account) => normalizeAddress(account.address) === candidate,
    );

    if (!matched) {
      showToast(TOAST_MSG.API.UNAUTHORIZED, "error");

      return;
    }

    showToast(TOAST_MSG.OTP.VERIFIED, "success");

    setPassword("");
    setConfirmPassword("");
    setPage("create");
  };

  const handleCreateWallet = () => {
    if (!password || !confirmPassword) {
      showToast(TOAST_MSG.PROFILE.REQUIRED, "error");

      return;
    }
    if (password.length < 8) {
      showToast(TOAST_MSG.RESET.INVALID, "error");

      return;
    }
    if (password !== confirmPassword) {
      showToast(TOAST_MSG.RESET.MISMATCH, "error");

      return;
    }
    showToast(TOAST_MSG.PROFILE.SAVE_SUCCESS, "success");

    setTimeout(() => setPage("success"), 800);
  };

  const handleOpenWallet = () => {
    setPage("dashboard");
    setActivityPage("dashboard");
    setFilterType("All");
    setFilteredTransactions(transactions);
    showToast(TOAST_MSG.AUTH.LOGIN_SUCCESS, "success");
  };

  const handleSelectAccount = (accountName) => {
    setSelectedAccount(accountName);
    showToast(`${TOAST_MSG.PROFILE.SAVE_SUCCESS} → ${accountName}`, "success");
  };

  const handleFilterChange = (filter) => {
    setFilterType(filter);
    if (filter === "All") {
      setFilteredTransactions(transactions);
    } else {
      setFilteredTransactions(transactions.filter((t) => t.type === filter));
    }
  };

  const handleQuickAction = (action) => {
    const mapper = {
      Send: "Sent",
      Receive: "Received",
      Swap: "Converted",
    };

    const mappedFilter = mapper[action];

    if (filterType === mappedFilter) {
      handleFilterChange("All");
      return;
    }

    handleFilterChange(mappedFilter);
  };

  const copyAddress = async (value, event) => {
    if (event) event.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      showToast(TOAST_MSG.OTP.RESENT, "success");
    } catch {
      showToast(TOAST_MSG.API.NETWORK, "error");
    }
  };

  const shortenAddress = (value) => {
    if (!value || value.length < 14) return value;
    return `${value.slice(0, 8)}...${value.slice(-6)}`;
  };

  const goBackFromCreate = () => {
    if (entryFlow === "existing") {
      setPage("verifyAddress");
      return;
    }
    setPage("landing");
  };

  const goBackOnePage = () => {
    navigate(-1);
  };

  const renderLanding = () => (
    <div className="hero-section">
      <div className="blob-bg" />

      <div className="content">
        <div className="badge hero-badge-static">
          <div className="dot" />
          Secure & Verified
        </div>

        <h1 className="title">
          Carbon Credit
          <br />
          <span>Wallet</span>
        </h1>
        <p className="subtitle">
          Lorem ipsum dolor sit amet. Consecte-tuer adipiscing elit. Set diam
          nonummy nibh euismod tincidunt.
        </p>
        <div className="btn-group">
          <button
            className="btn btn-primary"
            onClick={() => {
              setEntryFlow("new");
              startLoadingAndNavigate("create");
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
            Create New Wallet
          </button>
          <button
            className="btn btn-outline"
            onClick={() => {
              setEntryFlow("existing");
              setVerifyAddressInput("");
              startLoadingAndNavigate("verifyAddress");
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            Existing Wallet
          </button>
          <button type="button" className="btn btn-outline">
            Learn More
          </button>
        </div>
      </div>

      <div className="illustration">
        <svg viewBox="0 0 560 420" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="60" y="290" width="440" height="22" rx="6" fill="#c8d0d8" />
          <rect x="80" y="295" width="400" height="14" rx="4" fill="#aab0b8" />

          <rect x="90" y="80" width="380" height="218" rx="10" fill="#2a2d3a" />
          <rect x="100" y="90" width="360" height="198" rx="6" fill="#1e2330" />

          <rect x="112" y="100" width="336" height="178" rx="6" fill="#e8f5e9" />

          <circle cx="148" cy="130" r="20" fill="#38b000" opacity="0.2" />
          <circle cx="148" cy="124" r="9" fill="#38b000" opacity="0.6" />
          <ellipse cx="148" cy="142" rx="12" ry="7" fill="#38b000" opacity="0.4" />

          <rect x="115" y="108" width="200" height="90" rx="8" fill="#38b000" />
          <text x="130" y="128" fontSize="10" fill="rgba(255,255,255,0.8)" fontFamily="sans-serif">Balance</text>
          <text x="130" y="150" fontSize="20" fontWeight="bold" fill="#fff" fontFamily="sans-serif">$4,250</text>
          <text x="130" y="168" fontSize="9" fill="rgba(255,255,255,0.7)" fontFamily="sans-serif">**** **** **** 4321</text>
          <text x="130" y="188" fontSize="9" fill="rgba(255,255,255,0.7)" fontFamily="sans-serif">John Doe</text>

          <circle cx="285" cy="148" r="28" fill="rgba(255,255,255,0.15)" />
          <text x="279" y="154" fontSize="20" fill="#fff" fontFamily="sans-serif" fontWeight="bold">$</text>

          <rect x="118" y="208" width="330" height="14" rx="3" fill="#c8e6c9" />
          <rect x="118" y="228" width="280" height="14" rx="3" fill="#dcedc8" />
          <rect x="118" y="248" width="200" height="14" rx="3" fill="#c8e6c9" />

          {[...Array(5)].map((_, row) =>
            [...Array(12)].map((__, col) => (
              <rect
                key={`${row}-${col}`}
                x={100 + col * 30 + (row % 2 === 0 ? 0 : 5)}
                y={305 + row * 12}
                width="26"
                height="9"
                rx="2"
                fill="#3a3f52"
              />
            )),
          )}

          <ellipse cx="310" cy="68" rx="14" ry="18" fill="#ffb74d" />
          <circle cx="310" cy="44" r="12" fill="#ffcc80" />
          <rect x="296" y="60" width="28" height="18" rx="3" fill="#42a5f5" />

          <circle cx="58" cy="188" r="12" fill="#ffcc80" />
          <rect x="46" y="200" width="24" height="36" rx="6" fill="#1565c0" />
          <rect x="46" y="220" width="24" height="36" rx="3" fill="#0d47a1" />
          <rect x="70" y="205" width="18" height="22" rx="2" fill="#fff" opacity="0.9" />
          <rect x="72" y="209" width="14" height="2" rx="1" fill="#ccc" />
          <rect x="72" y="213" width="14" height="2" rx="1" fill="#ccc" />
          <rect x="72" y="217" width="10" height="2" rx="1" fill="#ccc" />

          <circle cx="500" cy="185" r="12" fill="#ffcc80" />
          <rect x="488" y="197" width="24" height="36" rx="6" fill="#2e7d32" />
          <rect x="488" y="217" width="24" height="36" rx="3" fill="#1b5e20" />
          <rect x="480" y="200" width="22" height="15" rx="2" fill="#42a5f5" />

          <circle
            cx="466"
            cy="52"
            r="26"
            fill="rgba(255,255,255,0.15)"
            stroke="#fff"
            strokeWidth="2"
          />
          <ellipse
            cx="466"
            cy="52"
            rx="12"
            ry="26"
            stroke="#fff"
            strokeWidth="1.5"
            fill="none"
          />
          <line x1="440" y1="52" x2="492" y2="52" stroke="#fff" strokeWidth="1.5" />
          <circle cx="466" cy="52" r="8" fill="#38b000" />
          <polyline
            points="462,52 465,55 470,48"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <polygon points="42,155 56,148 56,162" fill="#38b000" opacity="0.7" />
          <polygon points="518,130 532,123 532,137" fill="#38b000" opacity="0.7" />

          <ellipse cx="455" cy="285" rx="30" ry="8" fill="#ffd740" />
          <rect x="425" y="258" width="60" height="27" rx="0" fill="#ffca28" />
          <ellipse cx="455" cy="258" rx="30" ry="8" fill="#ffd740" />
          <rect x="425" y="235" width="60" height="23" rx="0" fill="#ffca28" />
          <ellipse cx="455" cy="235" rx="30" ry="8" fill="#ffd740" />
          <text x="444" y="273" fontSize="14" fontWeight="bold" fill="#e65100" fontFamily="sans-serif">$</text>

          <rect
            x="468"
            y="240"
            width="60"
            height="40"
            rx="6"
            fill="#1565c0"
            transform="rotate(-15, 498, 260)"
          />
          <rect
            x="468"
            y="252"
            width="60"
            height="6"
            rx="1"
            fill="#0d47a1"
            transform="rotate(-15, 498, 260)"
          />
        </svg>
      </div>

    </div>
  );
  const renderVerifyAddress = () => (
    <div className="wallet-container create-wallet-page">
      <div className="create-content">
        <button className="back-button" onClick={() => setPage("landing")}>
          <span className="back-arrow">
            <FaArrowLeft />
          </span>
          <span>Back</span>
        </button>

        <h2>Verify Wallet Address</h2>
        <p className="warning-text">
          Paste an existing wallet address. If it matches, you can continue to
          set credentials.
        </p>

        <form onSubmit={handleVerifyAddress}>
          <div className="form-group">
            <label>Wallet address</label>
            <input
              type="text"
              value={verifyAddressInput}
              onChange={(e) => setVerifyAddressInput(e.target.value)}
              placeholder="Paste 0x... address"
              className="password-input"
            />
            <p className="helper-text">Use any address listed below.</p>
          </div>

          <div className="address-reference">
            {accounts.map((acc) => (
              <div key={acc.id} className="address-row">
                <span>{shortenAddress(acc.address)}</span>
                <button
                  type="button"
                  className="address-copy-btn"
                  onClick={(e) => copyAddress(acc.address, e)}
                >
                  Copy
                </button>
              </div>
            ))}
          </div>

          <button type="submit" className="btn btn-primary btn-submit">
            Verify address
          </button>
        </form>
      </div>
    </div>
  );

  const renderCreateWallet = () => (
    <div className="wallet-container create-wallet-page">
      <div className="create-content">
        <button className="back-button" onClick={goBackFromCreate}>
          <span className="back-arrow">
            <FaArrowLeft />
          </span>
          <span>Back</span>
        </button>

        <h2>Create Your Wallet Password</h2>
        <p className="warning-text">
          Losing this password means losing wallet access on all devices.
          <span className="highlight"> We cannot reset it.</span>
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateWallet();
          }}
        >
          <div className="form-group">
            <label>Create new password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="password-input"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <p className="helper-text">Must be at least 8 characters</p>
          </div>

          <div className="form-group">
            <label>Confirm password</label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="password-input"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="checkbox-group">
            <input type="checkbox" id="updates" />
            <label htmlFor="updates">
              Get product updates, tips, and news including by email.
            </label>
          </div>

          <button type="submit" className="btn btn-primary btn-submit">
            Save credentials
          </button>
        </form>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="wallet-container success-page">
      <div className="success-content">
        <div className="success-animation" aria-hidden="true">
          <span className="party-dot dot-1" />
          <span className="party-dot dot-2" />
          <span className="party-dot dot-3" />
          <div className="party-popup party-popup-icon">
            <FaGift />
          </div>
        </div>
        <h2>Your wallet is ready</h2>
        <button className="btn btn-primary" onClick={handleOpenWallet}>
          Open wallet
        </button>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="wallet-container dashboard-page">
      {(() => {
        const activeAccount =
          accounts.find((a) => a.name === selectedAccount) || accounts[0];

        return (
          <>
            <div className="dashboard-header">
              <div className="header-top">
                <button className="back-button" onClick={goBackOnePage}>
                  <span className="back-arrow">
                    <FaArrowLeft />
                  </span>
                  <span>Back</span>
                </button>
                <h2>Activities</h2>
                <button
                  className="btn-accounts"
                  onClick={() => setShowAccountsPopup(true)}
                >
                  Accounts
                </button>
              </div>
            </div>

            {activityPage === "dashboard" && (
              <>
                <div className="card-section">
                  <div className="wallet-card">
                    <div className="card-top">
                      <div className="card-address-panel">
                        <span className="card-address-label">
                          Wallet address
                        </span>
                        <span className="card-address-value card-address-full">
                          {activeAccount?.address}
                        </span>
                        <button
                          type="button"
                          className="address-copy-btn card-copy-btn"
                          onClick={(e) =>
                            copyAddress(activeAccount?.address, e)
                          }
                        >
                          Copy address
                        </button>
                      </div>
                    </div>

                    <div className="card-footer">
                      <div className="balance-info">
                        <span className="balance-label">Available balance</span>
                        <span className="balance-amount">
                          ${" "}
                          {hideBalance
                            ? "****"
                            : activeAccount?.balance.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            }) || "0.00"}
                        </span>
                      </div>
                      <button
                        className="visibility-btn"
                        onClick={() => setHideBalance((prev) => !prev)}
                        aria-label={
                          hideBalance ? "Show balance" : "Hide balance"
                        }
                      >
                        {hideBalance ? <FaEye /> : <FaEyeSlash />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="activities-section">
                  <div className="activities-header">
                    <h3>Recent Activities</h3>
                    <button
                      className="btn-link"
                      onClick={() => setActivityPage("activities")}
                    >
                      View all
                    </button>
                  </div>

                  <div className="quick-action-bars">
                    <button
                      className={`quick-filter-btn ${filterType === "Sent" ? "active" : ""}`}
                      onClick={() => handleQuickAction("Send")}
                    >
                      Send
                    </button>
                    <button
                      className={`quick-filter-btn ${filterType === "Received" ? "active" : ""}`}
                      onClick={() => handleQuickAction("Receive")}
                    >
                      Receive
                    </button>
                    <button
                      className={`quick-filter-btn ${filterType === "Converted" ? "active" : ""}`}
                      onClick={() => handleQuickAction("Swap")}
                    >
                      Swap
                    </button>
                  </div>

                  <div className="transactions-list">
                    {filteredTransactions.slice(0, 3).map((tx) => (
                      <div key={tx.id} className="transaction-item">
                        <div className="tx-icon">
                          {tx.type === "Sent" && "UP"}
                          {tx.type === "Received" && "DN"}
                          {tx.type === "Converted" && "SW"}
                        </div>
                        <div className="tx-info">
                          <span className="tx-type">{tx.type}</span>
                          <span className="tx-activity">{tx.activity}</span>
                        </div>
                        <div className="tx-amount">
                          {tx.type === "Sent" ? "-" : "+"}
                          {tx.amount.toLocaleString()} {tx.currency}
                        </div>
                        <span
                          className={`tx-status status-${tx.status.toLowerCase()}`}
                        >
                          {tx.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activityPage === "activities" && (
              <div className="activities-full">
                <div className="filters">
                  {["All", "Sent", "Received", "Converted"].map((filter) => (
                    <button
                      key={filter}
                      className={`filter-btn ${filterType === filter ? "active" : ""}`}
                      onClick={() => handleFilterChange(filter)}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                <div className="transactions-table">
                  <div className="table-header">
                    <div>TYPE</div>
                    <div>AMOUNT</div>
                    <div>METHOD</div>
                    <div>STATUS</div>
                    <div>ACTIVITY</div>
                  </div>
                  {filteredTransactions.map((tx) => (
                    <div key={tx.id} className="table-row">
                      <div className="cell-type">{tx.type}</div>
                      <div className="cell-amount">
                        {tx.type === "Sent" ? "-" : "+"}
                        {tx.amount.toLocaleString()} {tx.currency}
                      </div>
                      <div>{tx.method}</div>
                      <div
                        className={`cell-status status-${tx.status.toLowerCase()}`}
                      >
                        {tx.status}
                      </div>
                      <div>{tx.activity}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showAccountsPopup && (
              <div
                className="accounts-popup-overlay"
                onClick={() => setShowAccountsPopup(false)}
              >
                <div
                  className="accounts-popup"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="accounts-header">
                    <button
                      className="back-button"
                      onClick={() => setShowAccountsPopup(false)}
                    >
                      <span className="back-arrow">
                        <FaArrowLeft />
                      </span>
                      <span>Back</span>
                    </button>
                    <h3>Accounts</h3>
                  </div>

                  <p className="accounts-alert" role="alert">
                    Multiple account addition will be available soon.
                  </p>

                  <div className="search-box">
                    <input type="text" placeholder="Search your accounts" />
                  </div>

                  <div className="accounts-list">
                    {accounts.map((acc) => (
                      <div
                        key={acc.id}
                        className={`account-item ${selectedAccount === acc.name ? "active" : ""}`}
                        onClick={() => handleSelectAccount(acc.name)}
                      >
                        <div
                          className="account-icon"
                          style={{ backgroundColor: acc.color }}
                        />
                        <div className="account-info">
                          <span className="account-name">{acc.name}</span>
                          <span className="account-balance">
                            ${acc.balance.toLocaleString()}
                          </span>
                          <div className="account-address-row">
                            <span className="account-address-label">
                              Address:
                            </span>
                            <span className="account-address-value">
                              {shortenAddress(acc.address)}
                            </span>
                          </div>
                        </div>
                        <button
                          className="account-menu"
                          type="button"
                          onClick={(e) => e.stopPropagation()}
                        >
                          ...
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        );
      })()}
    </div>
  );

  if (!mounted) return <div className="wallet-container" />;

  return (
    <>
      {page === "landing" && renderLanding()}
      {page === "verifyAddress" && renderVerifyAddress()}
      {page === "create" && renderCreateWallet()}
      {page === "success" && renderSuccess()}
      {page === "dashboard" && renderDashboard()}

      {/* ===== LOADER POPUP ===== */}
      {showLoader && (
        <div className="loader-overlay">
          <div className="loader-box">
            <div className="wallet-video-loader">
              <video
                src="/wloader.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="loader-video"
              />
            </div>

            <p className="loader-text">{loaderText}</p>

            <p className="loader-sub">
              Securing blocks… planting digital trees 🌱
            </p>
          </div>
        </div>
      )}

      {toast && (
        <div
          className={`toast toast-${toast.type}`}
          role="status"
          aria-live="polite"
        >
          {toast.message}
        </div>
      )}
    </>
  );
};

export default Wallet;

