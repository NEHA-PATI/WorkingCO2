import React, { useEffect, useMemo, useState } from "react";
import {
  FiSearch,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiXCircle,
  FiX,
  FiMail,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiCalendar,
} from "react-icons/fi";
import {
  FaFileAlt,
  FaClock,
  FaTimesCircle,
  FaBuilding,
  FaUserTie,
} from "react-icons/fa";
import "@features/admin/styles/orgrequest.css";

const ORGRQ_API_BASE_URL = "http://localhost:8080/api/v1";

const normalizeStatus = (rawStatus = "") => {
  const value = String(rawStatus).trim().toLowerCase();
  if (value === "approved") return "Approved";
  if (value === "rejected") return "Rejected";
  return "Pending";
};

const normalizeOrgRequest = (row) => ({
  id: row.org_request_id,
  organizationName: row.org_name || "-",
  type: row.org_type || "-",
  personName: row.org_contact_person || "-",
  designation: row.org_designation || "-",
  country: row.org_country || "-",
  state: row.org_state || "-",
  city: row.org_city || "-",
  status: normalizeStatus(row.request_status),
  email: row.org_mail || "-",
  phone: row.org_contact_number || "-",
  location: [row.org_city, row.org_state, row.org_country].filter(Boolean).join(", ") || "-",
  description: "-",
  createdAt: row.created_at,
});

const getStatusClass = (status) => {
  if (status === "Approved") return "orgrq-status-approved";
  if (status === "Rejected") return "orgrq-status-rejected";
  return "orgrq-status-pending";
};

export default function OrgRequest() {
  const [orgrqRows, setOrgrqRows] = useState([]);
  const [orgrqLoading, setOrgrqLoading] = useState(true);
  const [orgrqActionLoading, setOrgrqActionLoading] = useState(false);
  const [orgrqError, setOrgrqError] = useState("");
  const [orgrqSearch, setOrgrqSearch] = useState("");
  const [orgrqStatusFilter, setOrgrqStatusFilter] = useState("All Status");
  const [orgrqDate, setOrgrqDate] = useState("");
  const [orgrqViewModal, setOrgrqViewModal] = useState(null);
  const [orgrqApproveModal, setOrgrqApproveModal] = useState(null);
  const [orgrqRejectModal, setOrgrqRejectModal] = useState(null);
  const [orgrqRejectReason, setOrgrqRejectReason] = useState("");
  const [orgrqCreateEmail, setOrgrqCreateEmail] = useState("");
  const [orgrqCreatePassword, setOrgrqCreatePassword] = useState("");
  const [orgrqCreateConfirmPassword, setOrgrqCreateConfirmPassword] =
    useState("");
  const [orgrqShowCreatePassword, setOrgrqShowCreatePassword] = useState(false);
  const [orgrqShowCreateConfirmPassword, setOrgrqShowCreateConfirmPassword] =
    useState(false);
  const [orgrqActionError, setOrgrqActionError] = useState("");

  useEffect(() => {
    const fetchOrgRequests = async () => {
      try {
        setOrgrqLoading(true);
        setOrgrqError("");

        const response = await fetch(`${ORGRQ_API_BASE_URL}/org-requests`);
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to fetch organization requests");
        }

        const rows = (result.data || [])
          .map(normalizeOrgRequest)
          .filter((row) => row.status !== "Approved");

        setOrgrqRows(rows);
      } catch (error) {
        setOrgrqError(error.message || "Failed to fetch organization requests");
      } finally {
        setOrgrqLoading(false);
      }
    };

    fetchOrgRequests();
  }, []);

  const updateRowStatus = (orgRequestId, nextStatus) => {
    setOrgrqRows((prev) =>
      prev.map((row) =>
        row.id === orgRequestId ? { ...row, status: nextStatus } : row
      )
    );
  };

  const resetApproveModalState = () => {
    setOrgrqApproveModal(null);
    setOrgrqCreateEmail("");
    setOrgrqCreatePassword("");
    setOrgrqCreateConfirmPassword("");
    setOrgrqShowCreatePassword(false);
    setOrgrqShowCreateConfirmPassword(false);
    setOrgrqActionError("");
  };

  const resetRejectModalState = () => {
    setOrgrqRejectModal(null);
    setOrgrqRejectReason("");
    setOrgrqActionError("");
  };

  const handleApproveOrganization = async () => {
    if (!orgrqApproveModal) return;

    const email = orgrqCreateEmail.trim().toLowerCase();
    const password = orgrqCreatePassword.trim();
    const confirmPassword = orgrqCreateConfirmPassword.trim();

    if (!email || !password || !confirmPassword) {
      setOrgrqActionError("Email, password, and confirm password are required.");
      return;
    }

    if (password !== confirmPassword) {
      setOrgrqActionError("Password and confirm password do not match.");
      return;
    }

    try {
      setOrgrqActionLoading(true);
      setOrgrqActionError("");

      const response = await fetch(
        `${ORGRQ_API_BASE_URL}/admin/approve-organization`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            org_request_id: orgrqApproveModal.id,
            email,
            password,
          }),
        }
      );

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to approve organization.");
      }

      setOrgrqRows((prev) => prev.filter((row) => row.id !== orgrqApproveModal.id));
      resetApproveModalState();
    } catch (error) {
      setOrgrqActionError(error.message || "Failed to approve organization.");
    } finally {
      setOrgrqActionLoading(false);
    }
  };

  const handleRejectOrganization = async () => {
    if (!orgrqRejectModal) return;

    const reason = orgrqRejectReason.trim();
    if (!reason) {
      setOrgrqActionError("Rejection reason is required.");
      return;
    }

    try {
      setOrgrqActionLoading(true);
      setOrgrqActionError("");

      const response = await fetch(
        `${ORGRQ_API_BASE_URL}/admin/reject-organization`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            org_request_id: orgrqRejectModal.id,
            reason,
          }),
        }
      );

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to reject request.");
      }

      updateRowStatus(orgrqRejectModal.id, "Rejected");
      resetRejectModalState();
    } catch (error) {
      setOrgrqActionError(error.message || "Failed to reject request.");
    } finally {
      setOrgrqActionLoading(false);
    }
  };

  const orgrqFilteredRows = useMemo(() => {
    return orgrqRows.filter((row) => {
      const query = orgrqSearch.trim().toLowerCase();
      const matchSearch =
        !query ||
        row.organizationName.toLowerCase().includes(query) ||
        row.personName.toLowerCase().includes(query);
      const matchStatus =
        orgrqStatusFilter === "All Status" || row.status === orgrqStatusFilter;
      const matchDate =
        !orgrqDate ||
        (row.createdAt && new Date(row.createdAt).toISOString().slice(0, 10) === orgrqDate);
      return matchSearch && matchStatus && matchDate;
    });
  }, [orgrqRows, orgrqSearch, orgrqStatusFilter, orgrqDate]);

  const orgrqStats = useMemo(() => {
    const total = orgrqRows.length;
    const pending = orgrqRows.filter((r) => r.status === "Pending").length;
    const rejected = orgrqRows.filter((r) => r.status === "Rejected").length;
    return { total, pending, rejected };
  }, [orgrqRows]);

  return (
    <section className="orgrq-page-shell">
      <div className="orgrq-head-wrap">
        <h1 className="orgrq-head-title">Organization Requests</h1>
        <p className="orgrq-head-subtitle">
          Review and manage incoming organization requests
        </p>
      </div>

      <div className="orgrq-stat-grid">
        <article className="orgrq-stat-card">
          <div className="orgrq-stat-icon orgrq-stat-icon-total">
            <FaFileAlt />
          </div>
          <div>
            <div className="orgrq-stat-count">{orgrqStats.total}</div>
            <div className="orgrq-stat-label">TOTAL REQUESTS</div>
          </div>
        </article>

        <article className="orgrq-stat-card">
          <div className="orgrq-stat-icon orgrq-stat-icon-pending">
            <FaClock />
          </div>
          <div>
            <div className="orgrq-stat-count">{orgrqStats.pending}</div>
            <div className="orgrq-stat-label">PENDING</div>
          </div>
        </article>

        <article className="orgrq-stat-card">
          <div className="orgrq-stat-icon orgrq-stat-icon-rejected">
            <FaTimesCircle />
          </div>
          <div>
            <div className="orgrq-stat-count">{orgrqStats.rejected}</div>
            <div className="orgrq-stat-label">REJECTED</div>
          </div>
        </article>
      </div>

      <div className="orgrq-filter-bar">
        <label className="orgrq-search-wrap">
          <FiSearch className="orgrq-search-icon" />
          <input
            className="orgrq-search-input"
            placeholder="Search by organization or person name..."
            value={orgrqSearch}
            onChange={(e) => setOrgrqSearch(e.target.value)}
          />
        </label>

        <select
          className="orgrq-status-select"
          value={orgrqStatusFilter}
          onChange={(e) => setOrgrqStatusFilter(e.target.value)}
        >
          <option>All Status</option>
          <option>Pending</option>
          <option>Rejected</option>
        </select>

        <label className="orgrq-date-wrap">
          <input
            className="orgrq-date-input"
            type="date"
            value={orgrqDate}
            onChange={(e) => setOrgrqDate(e.target.value)}
          />
          <FiCalendar className="orgrq-date-icon" />
        </label>
      </div>

      <div className="orgrq-table-card">
        <table className="orgrq-main-table">
          <thead>
            <tr>
              <th>ORGANIZATION NAME</th>
              <th>TYPE</th>
              <th>PERSON NAME</th>
              <th>DESIGNATION</th>
              <th>COUNTRY</th>
              <th>STATE</th>
              <th>CITY</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {!orgrqLoading && !orgrqError && orgrqFilteredRows.length === 0 && (
              <tr>
                <td colSpan={9}>No organization requests found.</td>
              </tr>
            )}
            {!orgrqLoading && orgrqError && (
              <tr>
                <td colSpan={9}>{orgrqError}</td>
              </tr>
            )}
            {orgrqLoading && (
              <tr>
                <td colSpan={9}>Loading organization requests...</td>
              </tr>
            )}
            {orgrqFilteredRows.map((row) => (
              <tr key={row.id}>
                <td className="orgrq-org-name">{row.organizationName}</td>
                <td>{row.type}</td>
                <td>{row.personName}</td>
                <td>{row.designation}</td>
                <td>{row.country}</td>
                <td>{row.state}</td>
                <td>{row.city}</td>
                <td>
                  <span className={`orgrq-status-pill ${getStatusClass(row.status)}`}>
                    {row.status}
                  </span>
                </td>
                <td>
                  <div className="orgrq-action-wrap">
                    <button
                      className="orgrq-action-btn orgrq-action-eye"
                      onClick={() => setOrgrqViewModal(row)}
                      type="button"
                    >
                      <FiEye />
                    </button>

                    {row.status === "Pending" && (
                      <>
                    <button
                      className="orgrq-action-btn orgrq-action-check"
                      onClick={() => {
                        setOrgrqActionError("");
                        setOrgrqApproveModal(row);
                      }}
                      type="button"
                    >
                      <FiCheckCircle />
                    </button>
                    <button
                      className="orgrq-action-btn orgrq-action-cross"
                      onClick={() => {
                        setOrgrqActionError("");
                        setOrgrqRejectModal(row);
                      }}
                      type="button"
                    >
                      <FiXCircle />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orgrqViewModal && (
        <div
          className="orgrq-overlay"
          role="presentation"
          onClick={() => setOrgrqViewModal(null)}
        >
          <div
            className="orgrq-modal-card orgrq-view-modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="orgrq-close-btn"
              onClick={() => setOrgrqViewModal(null)}
              type="button"
            >
              <FiX />
            </button>

            <h2 className="orgrq-modal-title">Request Details</h2>
            <div className="orgrq-view-headline">
              <h3>{orgrqViewModal.organizationName}</h3>
              <span
                className={`orgrq-status-pill ${getStatusClass(orgrqViewModal.status)}`}
              >
                {orgrqViewModal.status}
              </span>
            </div>

            <div className="orgrq-view-grid">
              <div className="orgrq-view-item">
                <div className="orgrq-view-icon">
                  <FaBuilding className="orgrq-view-icon-org" />
                </div>
                <div>
                  <p>ORGANIZATION TYPE</p>
                  <h4>{orgrqViewModal.type}</h4>
                </div>
              </div>
              <div className="orgrq-view-item">
                <div className="orgrq-view-icon">
                  <FaUserTie className="orgrq-view-icon-person" />
                </div>
                <div>
                  <p>CONTACT PERSON</p>
                  <h4>{orgrqViewModal.personName}</h4>
                </div>
              </div>
              <div className="orgrq-view-item">
                <div className="orgrq-view-icon">
                  <FiBriefcase className="orgrq-view-icon-designation" />
                </div>
                <div>
                  <p>DESIGNATION</p>
                  <h4>{orgrqViewModal.designation}</h4>
                </div>
              </div>
              <div className="orgrq-view-item">
                <div className="orgrq-view-icon">
                  <FiMail className="orgrq-view-icon-mail" />
                </div>
                <div>
                  <p>EMAIL</p>
                  <h4>{orgrqViewModal.email}</h4>
                </div>
              </div>
              <div className="orgrq-view-item">
                <div className="orgrq-view-icon">
                  <FiPhone className="orgrq-view-icon-phone" />
                </div>
                <div>
                  <p>PHONE</p>
                  <h4>{orgrqViewModal.phone}</h4>
                </div>
              </div>
              <div className="orgrq-view-item">
                <div className="orgrq-view-icon">
                  <FiMapPin className="orgrq-view-icon-location" />
                </div>
                <div>
                  <p>LOCATION</p>
                  <h4>{orgrqViewModal.location}</h4>
                </div>
              </div>
            </div>

            <div className="orgrq-view-description">
              <p>DESCRIPTION</p>
              <h4>{orgrqViewModal.description}</h4>
            </div>

            {orgrqViewModal.status === "Pending" && (
              <div className="orgrq-view-actions">
                <p className="orgrq-view-actions-label">ACTIONS</p>
                <div className="orgrq-view-actions-row">
                  <button
                    type="button"
                    className="orgrq-btn orgrq-btn-cancel"
                    onClick={() => {
                      setOrgrqViewModal(null);
                      setOrgrqRejectModal(orgrqViewModal);
                    }}
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    className="orgrq-btn orgrq-btn-green"
                    onClick={() => {
                      setOrgrqViewModal(null);
                      setOrgrqApproveModal(orgrqViewModal);
                    }}
                  >
                    Approve
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {orgrqApproveModal && (
        <div
          className="orgrq-overlay"
          role="presentation"
          onClick={resetApproveModalState}
        >
          <div
            className="orgrq-modal-card orgrq-create-modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="orgrq-close-xplain"
              onClick={resetApproveModalState}
              type="button"
            >
              <FiX />
            </button>

            <h2 className="orgrq-modal-title">Create Organization</h2>

            <label className="orgrq-field-block">
              <span>ORGANIZATION NAME</span>
              <input
                value={orgrqApproveModal.organizationName}
                readOnly
                className="orgrq-input orgrq-input-readonly"
              />
            </label>

            <label className="orgrq-field-block">
              <span>EMAIL</span>
                <input
                  className="orgrq-input"
                  value={orgrqCreateEmail}
                  onChange={(e) => setOrgrqCreateEmail(e.target.value)}
                  disabled={orgrqActionLoading}
                />
              </label>

            <label className="orgrq-field-block">
              <span>PASSWORD</span>
              <div className="orgrq-pass-wrap">
                <input
                  className="orgrq-input"
                  type={orgrqShowCreatePassword ? "text" : "password"}
                  value={orgrqCreatePassword}
                  onChange={(e) => setOrgrqCreatePassword(e.target.value)}
                  disabled={orgrqActionLoading}
                />
                <button
                  type="button"
                  className="orgrq-pass-eye-btn"
                  onClick={() => setOrgrqShowCreatePassword((prev) => !prev)}
                  aria-label={
                    orgrqShowCreatePassword ? "Hide password" : "Show password"
                  }
                  disabled={orgrqActionLoading}
                >
                  {orgrqShowCreatePassword ? (
                    <FiEyeOff className="orgrq-pass-eye" />
                  ) : (
                    <FiEye className="orgrq-pass-eye" />
                  )}
                </button>
              </div>
            </label>

            <label className="orgrq-field-block">
              <span>CONFIRM PASSWORD</span>
              <div className="orgrq-pass-wrap">
                <input
                  className="orgrq-input"
                  type={orgrqShowCreateConfirmPassword ? "text" : "password"}
                  value={orgrqCreateConfirmPassword}
                  onChange={(e) => setOrgrqCreateConfirmPassword(e.target.value)}
                  disabled={orgrqActionLoading}
                />
                <button
                  type="button"
                  className="orgrq-pass-eye-btn"
                  onClick={() =>
                    setOrgrqShowCreateConfirmPassword((prev) => !prev)
                  }
                  aria-label={
                    orgrqShowCreateConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  disabled={orgrqActionLoading}
                >
                  {orgrqShowCreateConfirmPassword ? (
                    <FiEyeOff className="orgrq-pass-eye" />
                  ) : (
                    <FiEye className="orgrq-pass-eye" />
                  )}
                </button>
              </div>
            </label>

            {orgrqActionError && <p className="orgrq-reject-sub">{orgrqActionError}</p>}

            <div className="orgrq-modal-btn-row">
              <button
                type="button"
                className="orgrq-btn orgrq-btn-cancel"
                onClick={resetApproveModalState}
                disabled={orgrqActionLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="orgrq-btn orgrq-btn-green"
                onClick={handleApproveOrganization}
                disabled={orgrqActionLoading}
              >
                {orgrqActionLoading ? "Creating..." : "Create Organization"}
              </button>
            </div>
          </div>
        </div>
      )}

      {orgrqRejectModal && (
        <div
          className="orgrq-overlay"
          role="presentation"
          onClick={() => setOrgrqRejectModal(null)}
        >
          <div
            className="orgrq-modal-card orgrq-reject-modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="orgrq-close-xplain"
              onClick={() => setOrgrqRejectModal(null)}
              type="button"
            >
              <FiX />
            </button>

            <h2 className="orgrq-reject-title">
              <FiXCircle /> Reject Request
            </h2>

            <p className="orgrq-reject-sub">
              Are you sure you want to reject the request from{" "}
              <strong>{orgrqRejectModal.organizationName}</strong>?
            </p>

            <label className="orgrq-field-block">
              <span>REASON FOR REJECTION</span>
              <textarea
                className="orgrq-textarea"
                placeholder="Please specify why this request is being rejected..."
                value={orgrqRejectReason}
                onChange={(e) => setOrgrqRejectReason(e.target.value)}
                disabled={orgrqActionLoading}
              />
            </label>

            {orgrqActionError && <p className="orgrq-reject-sub">{orgrqActionError}</p>}

            <div className="orgrq-modal-btn-row">
              <button
                type="button"
                className="orgrq-btn orgrq-btn-cancel"
                onClick={resetRejectModalState}
                disabled={orgrqActionLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="orgrq-btn orgrq-btn-red"
                onClick={handleRejectOrganization}
                disabled={orgrqActionLoading}
              >
                {orgrqActionLoading ? "Rejecting..." : "Reject Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
