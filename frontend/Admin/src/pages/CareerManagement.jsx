import React from "react";
import {
  FiEdit,
  FiEye,
  FiTrash2,
  FiDownload,
  FiPlus,
  FiDownloadCloud,
} from "react-icons/fi";
import "../styles/CareerManagement.css";
import { fireToast } from "../services/toastService";

const jobs = [
  {
    id: 1,
    title: "Senior Sustainability Engineer",
    dept: "Engineering",
    type: "Remote",
    level: "Senior",
    status: "Active",
  },
  {
    id: 2,
    title: "Carbon Analyst",
    dept: "Analytics",
    type: "Hybrid",
    level: "Mid",
    status: "Active",
  },
  {
    id: 3,
    title: "Environmental Compliance Officer",
    dept: "Compliance",
    type: "On-site",
    level: "Senior",
    status: "Active",
  },
  {
    id: 4,
    title: "Junior Developer",
    dept: "Engineering",
    type: "Remote",
    level: "Junior",
    status: "Draft",
  },
  {
    id: 5,
    title: "Sustainability Consultant",
    dept: "Consulting",
    type: "Hybrid",
    level: "Mid",
    status: "Closed",
  },
];

const applications = [
  { name: "Sarah Johnson", role: "Senior Sustainability Engineer", date: "2024-10-28", status: "Pending" },
  { name: "Michael Chen", role: "Carbon Analyst", date: "2024-10-27", status: "Reviewed" },
  { name: "Emma Davis", role: "Environmental Compliance Officer", date: "2024-10-26", status: "Hired" },
  { name: "James Wilson", role: "Junior Developer", date: "2024-10-25", status: "Pending" },
  { name: "Lisa Anderson", role: "Sustainability Consultant", date: "2024-10-24", status: "Reviewed" },
];

export default function CareerManagement() {
  const handleAddJob = () => {
    // placeholder navigation: devs can replace with react-router later
    console.log("Add New Job clicked");
    window.location.href = "/jobs/new";
  };

  const handleExportCSV = () => {
    console.log("Export CSV");
    // small CSV demo export for jobs table
    const header = ["Job Title", "Department", "Type", "Level", "Status"];
    const rows = jobs.map((j) => [j.title, j.dept, j.type, j.level, j.status]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "jobs_export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    // placeholder: implement PDF generation (jsPDF) later
    console.log("Export PDF clicked - implement server or jsPDF later");
    fireToast("CAREER.EXPORT_PLACEHOLDER", "info");
  };

  const handleEdit = (id) => {
    console.log("Edit job", id);
    window.location.href = `/jobs/edit/${id}`;
  };
  const handleView = (id) => {
    console.log("View job", id);
    window.location.href = `/jobs/${id}`;
  };
  const handleDelete = (id) => {
    if (!confirm("Delete this job? This action cannot be undone.")) return;
    console.log("Delete job", id);
    // hook to delete API later
    fireToast("CAREER.DELETE_PLACEHOLDER", "info", { id });
  };

  return (
    <div className="career-page">
      {/* Header top */}
      <header className="career-header">
        <div>
          <h1>Career Management</h1>
          <p className="career-sub">Manage job openings, applications, and hiring progress.</p>
        </div>
        <div>
          <button className="career-add" onClick={handleAddJob}>
            <FiPlus style={{ marginRight: 8 }} /> Add New Job
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <section className="career-kpis">
        <div className="career-kpi">
          <div className="kpi-meta">Total Openings</div>
          <div className="kpi-value">12</div>
        </div>
        <div className="career-kpi">
          <div className="kpi-meta">Active Jobs</div>
          <div className="kpi-value">8</div>
        </div>
        <div className="career-kpi">
          <div className="kpi-meta">Applications Pending</div>
          <div className="kpi-value">24</div>
        </div>
        <div className="career-kpi">
          <div className="kpi-meta">Hires Completed</div>
          <div className="kpi-value">5</div>
        </div>
      </section>

      {/* Job Listings (table) */}
      <section className="career-listings">
        <div className="listings-header">
          <h3>Job Listings</h3>
          <div className="list-actions">
            <button className="btn-ghost" onClick={handleExportCSV}><FiDownload style={{marginRight:6}}/>CSV</button>
            <button className="btn-ghost" onClick={handleExportPDF}><FiDownloadCloud style={{marginRight:6}}/>PDF</button>
          </div>
        </div>

        <div className="list-filters">
          <input placeholder="Search by title or department..." />
          <div className="filter-row">
            <select><option>All Departments</option><option>Engineering</option><option>Analytics</option></select>
            <select><option>All Statuses</option><option>Active</option><option>Draft</option><option>Closed</option></select>
          </div>
        </div>

        <div className="table-wrap">
          <table className="career-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Department</th>
                <th>Type</th>
                <th>Level</th>
                <th>Status</th>
                <th style={{width:120}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j.id}>
                  <td>{j.title}</td>
                  <td>{j.dept}</td>
                  <td>{j.type}</td>
                  <td>{j.level}</td>
                  <td>
                    <span className={`tag ${j.status.toLowerCase()}`}>{j.status}</span>
                  </td>
                  <td>
                    <div className="actions">
                      <button title="Edit" onClick={() => handleEdit(j.id)}><FiEdit /></button>
                      <button title="View" onClick={() => handleView(j.id)}><FiEye /></button>
                      <button title="Delete" className="danger" onClick={() => handleDelete(j.id)}><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Charts row */}
      <section className="career-charts">
        <div className="chart-card">
          <h4>Openings by Department</h4>
          <div className="chart-placeholder">[Bar chart placeholder — integrate Chart.js / Recharts]</div>
        </div>
        <div className="chart-card">
          <h4>Applications Trend (Last 6 Months)</h4>
          <div className="chart-placeholder">[Line chart placeholder — integrate Chart.js / Recharts]</div>
        </div>
      </section>

      {/* Recent Applications (table) */}
      <section className="career-apps">
        <div className="apps-header">
          <h3>Recent Applications</h3>
          <button className="btn-ghost" onClick={() => window.location.href = "/applications"}>View All Applications</button>
        </div>

        <div className="table-wrap">
          <table className="career-table">
            <thead>
              <tr>
                <th>Applicant Name</th>
                <th>Role Applied</th>
                <th>Date Applied</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((a, idx) => (
                <tr key={idx}>
                  <td>{a.name}</td>
                  <td>{a.role}</td>
                  <td>{a.date}</td>
                  <td><span className={`tag ${a.status.toLowerCase()}`}>{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
