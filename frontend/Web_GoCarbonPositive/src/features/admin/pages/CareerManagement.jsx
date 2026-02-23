import React, { useState, useEffect } from "react";
import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiDownload,
  FiDownloadCloud,
} from "react-icons/fi";
import {
  fetchJobs,
  createJob,
  deleteJob,
  updateJob,
  fetchApplications,
} from "@features/admin/services/careerApi";
import "@features/admin/styles/CareerManagement.css";
import { fireToast } from "@shared/utils/toastService";

export default function CareerManagement() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    department: "Engineering",
    type: "Remote",
    level: "Junior",
    status: "Draft",
    description: "",
    location: "Remote",
  });

  const [message, setMessage] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const jobsData = await fetchJobs();
      const appsData = await fetchApplications();
      setJobs(jobsData.data || []);
      setApplications(appsData.data || []);
    } catch (err) {
      console.error("Failed to load career data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openModal = (job = null) => {
    if (job) {
      setEditingJob(job);
      setFormData({
        title: job.title,
        department: job.department,
        type: job.type,
        level: job.level,
        status: job.status,
        description: job.description || "",
        location: job.location || "",
      });
    } else {
      setEditingJob(null);
      setFormData({
        title: "",
        department: "Engineering",
        type: "Remote",
        level: "Junior",
        status: "Draft",
        description: "",
        location: "Remote",
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingJob(null);
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingJob) {
        await updateJob(editingJob.id, formData);
        setMessage("Job updated successfully!");
      } else {
        await createJob(formData);
        setMessage("Job created successfully!");
      }
      loadData();
      setTimeout(closeModal, 1500);
    } catch (err) {
      setMessage("Error saving job");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this job? This action cannot be undone.")) return;
    try {
      await deleteJob(id);
      loadData();
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      fireToast("CAREER.DELETE_FAILED", "error");
    }
  };

  // KPIs
  const totalOpenings = jobs.length;
  const activeJobs = jobs.filter((j) => j.status === "Active").length;
  const hiredCount = applications.filter((a) => a.status === "Hired").length;
  const pendingApps = applications.filter((a) => a.status === "Pending").length;

  return (
    <div className="career-page">
      {/* Header top */}
      <header className="career-header">
        <div>
          <h1>Career Management</h1>
          <p className="career-sub">
            Manage job openings, applications, and hiring progress.
          </p>
        </div>
        <div>
          <button className="career-add" onClick={() => openModal()}>
            <FiPlus style={{ marginRight: 8 }} /> Add New Job
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <section className="career-kpis">
        <div className="career-kpi">
          <div className="kpi-meta">Total Openings</div>
          <div className="kpi-value">{totalOpenings}</div>
        </div>
        <div className="career-kpi">
          <div className="kpi-meta">Active Jobs</div>
          <div className="kpi-value">{activeJobs}</div>
        </div>
        <div className="career-kpi">
          <div className="kpi-meta">Applications Pending</div>
          <div className="kpi-value">{pendingApps}</div>
        </div>
        <div className="career-kpi">
          <div className="kpi-meta">Hires Completed</div>
          <div className="kpi-value">{hiredCount}</div>
        </div>
      </section>

      {/* Job Listings (table) */}
      <section className="career-listings">
        <div className="listings-header">
          <h3>Job Listings</h3>
          <div className="list-actions">
            <button className="btn-ghost">
              <FiDownload style={{ marginRight: 6 }} />
              CSV
            </button>
            <button className="btn-ghost">
              <FiDownloadCloud style={{ marginRight: 6 }} />
              PDF
            </button>
          </div>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="table-wrap">
            <table className="career-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Department</th>
                  <th>Type</th>
                  <th>Level</th>
                  <th>Status</th>
                  <th style={{ width: 120 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((j) => (
                  <tr key={j.id}>
                    <td>{j.title}</td>
                    <td>{j.department}</td>
                    <td>{j.type}</td>
                    <td>{j.level}</td>
                    <td>
                      <span className={`tag ${j.status?.toLowerCase()}`}>
                        {j.status}
                      </span>
                    </td>
                    <td>
                      <div className="actions">
                        <button title="Edit" onClick={() => openModal(j)}>
                          <FiEdit />
                        </button>
                        <button
                          title="Delete"
                          className="danger"
                          onClick={() => handleDelete(j.id)}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {jobs.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      No jobs found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Recent Applications (table) */}
      <section className="career-apps">
        <div className="apps-header">
          <h3>Recent Applications</h3>
        </div>
        <div className="table-wrap">
          <table className="career-table">
            <thead>
              <tr>
                <th>Applicant Name</th>
                <th>Role Applied</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((a) => (
                <tr key={a.id}>
                  <td>{a.name}</td>
                  <td>{a.job_title}</td>
                  <td>{a.email}</td>
                  <td>
                    <span className={`tag ${a.status?.toLowerCase()}`}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
              {applications.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    No applications yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Simple Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{editingJob ? "Edit Job" : "Create New Job"}</h2>
            {message && <div className="modal-msg">{message}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Job Title</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                  >
                    <option>Engineering</option>
                    <option>Analytics</option>
                    <option>Design</option>
                    <option>Product</option>
                    <option>Marketing</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                  >
                    <option>Remote</option>
                    <option>Hybrid</option>
                    <option>On-site</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Level</label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                  >
                    <option>Junior</option>
                    <option>Mid</option>
                    <option>Senior</option>
                    <option>Lead</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option>Draft</option>
                    <option>Active</option>
                    <option>Closed</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
