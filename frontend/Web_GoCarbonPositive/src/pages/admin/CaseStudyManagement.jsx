import React from "react";
import "../../styles/admin/CaseStudyManagement.css";
import { Link } from "react-router-dom";

const CaseStudyManagement = () => {
  const caseStudies = [
    {
      title: "Green Valley Reforestation",
      category: "Reforestation",
      status: "Published",
      description:
        "A comprehensive reforestation project that planted over 50,000 trees in the valley region, restoring natural habitats and improving air quality.",
      author: "Admin",
      date: "Oct 25, 2025",
      image:
        "https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "EV Impact in Urban India",
      category: "EVs",
      status: "Draft",
      description:
        "Analyzing the environmental and economic impact of electric vehicle adoption in major Indian cities over the past two years.",
      author: "Admin",
      date: "Oct 23, 2025",
      image:
        "https://images.unsplash.com/photo-1549921296-3a6b3e5f91b3?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Solar Farm Expansion",
      category: "Energy",
      status: "Published",
      description:
        "Documenting the expansion of solar energy infrastructure and its contribution to renewable energy goals in the region.",
      author: "Admin",
      date: "Oct 20, 2025",
      image:
        "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const activityLog = [
    {
      date: "Oct 25, 2025",
      action: "Edited",
      title: "Green Valley Reforestation",
      author: "Admin",
      status: "Published",
    },
    {
      date: "Oct 23, 2025",
      action: "Created",
      title: "EV Impact in Urban India",
      author: "Admin",
      status: "Draft",
    },
  ];

  return (
    <div className="caseStudyM-container">
      {/* Header */}
      <header className="caseStudyM-header">
        <h1>Case Study Management</h1>
        <p>Create, review, and publish impactful sustainability case studies.</p>
      </header>

      {/* Stats Section */}
      <section className="caseStudyM-stats">
        <div className="caseStudyM-statBox">
          <h3>18</h3>
          <p>Total Case Studies</p>
        </div>
        <div className="caseStudyM-statBox">
          <h3>12</h3>
          <p>Published Case Studies</p>
        </div>
        <div className="caseStudyM-statBox">
          <h3>4</h3>
          <p>Drafts in Progress</p>
        </div>
        <div className="caseStudyM-statBox">
          <h3>5</h3>
          <p>Contributors</p>
        </div>
      </section>

      {/* Filters */}
      <div className="caseStudyM-controls">
        <input type="text" placeholder="Search by name, author, or region..." />
        <select>
          <option>All Categories</option>
          <option>Energy</option>
          <option>Reforestation</option>
          <option>EVs</option>
        </select>
        <select>
          <option>All Status</option>
          <option>Published</option>
          <option>Draft</option>
          <option>Archived</option>
        </select>
        <select>
          <option>Date (Newest)</option>
          <option>Date (Oldest)</option>
        </select>
        <button className="caseStudyM-addBtn">+ Add New Case Study</button>
      </div>

      {/* Cards Full Width */}
      <section className="caseStudyM-cards full-width">
        {caseStudies.map((study, i) => (
          <div key={i} className="caseStudyM-card">
            <img src={study.image} alt={study.title} />
            <div className="caseStudyM-cardContent">
              <h3>{study.title}</h3>
              <div className="caseStudyM-tags">
                <span className={`tag ${study.category.toLowerCase()}`}>
                  {study.category}
                </span>
                <span className={`status ${study.status.toLowerCase()}`}>
                  {study.status}
                </span>
              </div>
              <p>{study.description}</p>
              <div className="caseStudyM-meta">
                <span>{study.author}</span>
                <span>{study.date}</span>
              </div>
            </div>
            <div className="caseStudyM-buttons">
              <Link to="/edit">Edit</Link>
              <Link to="/preview">Preview</Link>
              <Link to="/delete" className="delete">
                Delete
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* Activity Section */}
      <section className="caseStudyM-activity">
        <div className="caseStudyM-activityHeader">
          <h2>Activity Log</h2>
          <div>
            <button>Export CSV</button>
            <button>Export PDF</button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Action</th>
              <th>Case Study Title</th>
              <th>Author</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {activityLog.map((log, i) => (
              <tr key={i}>
                <td>{log.date}</td>
                <td>{log.action}</td>
                <td>{log.title}</td>
                <td>{log.author}</td>
                <td>
                  <span className={`status ${log.status.toLowerCase()}`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default CaseStudyManagement;
