import React, { useMemo, useState } from "react";
import {
  FiSearch,
  FiEye,
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
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaBuilding,
  FaUserTie,
} from "react-icons/fa";
import "@features/admin/styles/orgrequest.css";

const ORGRQ_ROWS = [
  {
    id: "r1",
    organizationName: "Digital Skills Foundation",
    type: "NGO",
    personName: "Rahul Mehta",
    designation: "Program Manager",
    country: "India",
    state: "Karnataka",
    city: "Bangalore",
    status: "Pending",
    email: "rahul@digitalskills.org",
    phone: "+91 9988776655",
    location: "Bangalore, Karnataka, India",
    description:
      "Providing digital literacy training to underprivileged youth across India.",
  },
  {
    id: "r2",
    organizationName: "GreenFuture Foundation",
    type: "NGO",
    personName: "Ananya Sharma",
    designation: "Director",
    country: "India",
    state: "Maharashtra",
    city: "Mumbai",
    status: "Rejected",
    email: "ananya@greenfuture.org",
    phone: "+91 9876500011",
    location: "Mumbai, Maharashtra, India",
    description: "Environmental awareness and sustainable city campaigns.",
  },
  {
    id: "r3",
    organizationName: "TechNova Inc.",
    type: "Corporate",
    personName: "James Carter",
    designation: "CEO",
    country: "United States",
    state: "California",
    city: "San Francisco",
    status: "Approved",
    email: "james@technova.com",
    phone: "+1 415 998 7766",
    location: "San Francisco, California, United States",
    description: "Tech-driven carbon management platform for enterprises.",
  },
  {
    id: "r4",
    organizationName: "EduBridge Academy",
    type: "Educational",
    personName: "Priya Patel",
    designation: "Principal",
    country: "India",
    state: "Gujarat",
    city: "Ahmedabad",
    status: "Approved",
    email: "priya@edubridge.edu",
    phone: "+91 9090909090",
    location: "Ahmedabad, Gujarat, India",
    description: "School-led sustainability and youth climate literacy program.",
  },
];

const getStatusClass = (status) => {
  if (status === "Approved") return "orgrq-status-approved";
  if (status === "Rejected") return "orgrq-status-rejected";
  return "orgrq-status-pending";
};

export default function OrgRequest() {
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

  const orgrqFilteredRows = useMemo(() => {
    return ORGRQ_ROWS.filter((row) => {
      const query = orgrqSearch.trim().toLowerCase();
      const matchSearch =
        !query ||
        row.organizationName.toLowerCase().includes(query) ||
        row.personName.toLowerCase().includes(query);
      const matchStatus =
        orgrqStatusFilter === "All Status" || row.status === orgrqStatusFilter;
      const matchDate = !orgrqDate || true;
      return matchSearch && matchStatus && matchDate;
    });
  }, [orgrqSearch, orgrqStatusFilter, orgrqDate]);

  const orgrqStats = useMemo(() => {
    const total = ORGRQ_ROWS.length;
    const approved = ORGRQ_ROWS.filter((r) => r.status === "Approved").length;
    const pending = ORGRQ_ROWS.filter((r) => r.status === "Pending").length;
    const rejected = ORGRQ_ROWS.filter((r) => r.status === "Rejected").length;
    return { total, approved, pending, rejected };
  }, []);

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
          <div className="orgrq-stat-icon orgrq-stat-icon-approved">
            <FaCheckCircle />
          </div>
          <div>
            <div className="orgrq-stat-count">{orgrqStats.approved}</div>
            <div className="orgrq-stat-label">APPROVED</div>
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
          <option>Approved</option>
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
                          onClick={() => setOrgrqApproveModal(row)}
                          type="button"
                        >
                          <FiCheckCircle />
                        </button>
                        <button
                          className="orgrq-action-btn orgrq-action-cross"
                          onClick={() => setOrgrqRejectModal(row)}
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
          onClick={() => setOrgrqApproveModal(null)}
        >
          <div
            className="orgrq-modal-card orgrq-create-modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="orgrq-close-xplain"
              onClick={() => setOrgrqApproveModal(null)}
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
              />
            </label>

            <label className="orgrq-field-block">
              <span>PASSWORD</span>
              <div className="orgrq-pass-wrap">
                <input
                  className="orgrq-input"
                  type="password"
                  value={orgrqCreatePassword}
                  onChange={(e) => setOrgrqCreatePassword(e.target.value)}
                />
                <FiEye className="orgrq-pass-eye" />
              </div>
            </label>

            <label className="orgrq-field-block">
              <span>CONFIRM PASSWORD</span>
              <div className="orgrq-pass-wrap">
                <input
                  className="orgrq-input"
                  type="password"
                  value={orgrqCreateConfirmPassword}
                  onChange={(e) => setOrgrqCreateConfirmPassword(e.target.value)}
                />
                <FiEye className="orgrq-pass-eye" />
              </div>
            </label>

            <div className="orgrq-modal-btn-row">
              <button
                type="button"
                className="orgrq-btn orgrq-btn-cancel"
                onClick={() => setOrgrqApproveModal(null)}
              >
                Cancel
              </button>
              <button type="button" className="orgrq-btn orgrq-btn-green">
                Create Organization
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
              />
            </label>

            <div className="orgrq-modal-btn-row">
              <button
                type="button"
                className="orgrq-btn orgrq-btn-cancel"
                onClick={() => setOrgrqRejectModal(null)}
              >
                Cancel
              </button>
              <button type="button" className="orgrq-btn orgrq-btn-red">
                Reject Request
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
