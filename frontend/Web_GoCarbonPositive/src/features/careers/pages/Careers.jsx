import React, { useState, useEffect } from "react";
import { fetchActiveJobs, submitApplication } from "@features/careers/services/careerApi";
import "@features/careers/styles/Careers.css";
import {
  FaLeaf,
  FaMapMarkerAlt,
  FaUserTie,
  FaLinkedin,
  FaLaptopHouse,
  FaGraduationCap,
  FaHeart,
} from "react-icons/fa";

const CareersPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Application Form State
  const [appForm, setAppForm] = useState({
    name: "",
    email: "",
    role: "",
    message: "",
  });
  const [appStatus, setAppStatus] = useState(""); // success, error, submitting

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        const data = await fetchActiveJobs();
        setJobs(data.data || []);
      } catch (err) {
        console.error("Failed to fetch jobs", err);
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, []);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  const handleAppChange = (e) => {
    setAppForm({ ...appForm, [e.target.name]: e.target.value });
  };

  const handleAppSubmit = async (e) => {
    e.preventDefault();
    setAppStatus("submitting");
    try {
      // Note: resume upload is not implemented in backend yet, sending placeholder
      const payload = {
        job_id: null,
        name: appForm.name,
        email: appForm.email,
        resume_url: "http://placeholder.com/resume.pdf",
        message: appForm.message,
        role_applied: appForm.role
      };

      await submitApplication(payload);
      setAppStatus("success");
      setAppForm({ name: "", email: "", role: "", message: "" });
    } catch (err) {
      console.error(err);
      setAppStatus("error");
    }
  };

  return (
    <div className="careers-page-wrapper">
      {/* Navbar */}
      <header className="careers-navbar">
        <div className={`careers-nav-links ${menuOpen ? "open" : ""}`}>
          <button onClick={() => scrollToSection("careers-mission")}>Mission</button>
          <button onClick={() => scrollToSection("careers-openings")}>Openings</button>
          <button onClick={() => scrollToSection("careers-benefits")}>Benefits</button>
          <button onClick={() => scrollToSection("careers-apply")}>Apply</button>
        </div>
      </header>

      {/* Hero Section */}
      <section id="careers-mission" className="careers-hero-section">
        <div className="careers-overlay"></div>
        <div className="careers-hero-content">
          <h1>
            Join Our Mission to Make <br /> the Planet Carbon Positive
          </h1>
          <p>
            We are a global team driving sustainability through carbon
            offsetting, green innovation, and circular growth. Build solutions
            that restore nature and empower communities worldwide.
          </p>
          <div className="careers-hero-buttons">
            <button onClick={() => scrollToSection("careers-openings")}>
              View Open Positions
            </button>
            <button onClick={() => scrollToSection("careers-about")}>
              Learn About Our Mission
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="careers-about" className="careers-about-section">
        <h2>About Our Mission</h2>
        <p className="careers-about-text">
          We champion a carbon positive future by investing in regeneration,
          clean energy, and community-led initiatives. Together, we create
          measurable climate impact with transparency and purpose.
        </p>

        <div className="careers-about-card-container">
          <div className="careers-about-card">
            <div className="careers-about-icon">
              <FaLeaf />
            </div>
            <div className="careers-about-info">
              <h3>Carbon Offset</h3>
              <p>Driving verified carbon removal projects across the globe.</p>
            </div>
          </div>
          <div className="careers-about-card">
            <div className="careers-about-icon">
              <FaUserTie />
            </div>
            <div className="careers-about-info">
              <h3>Green Innovation</h3>
              <p>Building tools that help companies decarbonize operations.</p>
            </div>
          </div>
          <div className="careers-about-card">
            <div className="careers-about-icon">
              <FaMapMarkerAlt />
            </div>
            <div className="careers-about-info">
              <h3>Sustainable Growth</h3>
              <p>Scaling nature-based solutions with long-term impact.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Openings Section */}
      <section id="careers-openings" className="careers-openings-section">
        <h2>Current Openings</h2>
        <p>Find your place in our mission-driven team.</p>

        <div className="careers-filters">
          <input type="text" placeholder="Search roles" />
          <select>
            <option>All Departments</option>
          </select>
          <select>
            <option>All Locations</option>
          </select>
          <select>
            <option>All Levels</option>
          </select>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '40px' }}>Loading opportunities...</p>
        ) : (
          <div className="careers-job-cards">
            {jobs.map((job, i) => (
              <div className="careers-job-card" key={i}>
                <h3>{job.title}</h3>
                <div className="careers-job-meta">
                  <span className="careers-dept-tag">{job.department}</span>
                  <span className="careers-meta">
                    <FaMapMarkerAlt /> {job.type}
                  </span>
                  <span className="careers-meta">
                    <FaUserTie /> {job.level}
                  </span>
                </div>
                <div className="careers-job-buttons">
                  <button className="careers-apply-btn" onClick={() => {
                    setAppForm({ ...appForm, role: job.title });
                    scrollToSection("careers-apply");
                  }}>Apply</button>
                  <button className="careers-linkedin-btn">
                    <FaLinkedin /> Apply via LinkedIn
                  </button>
                </div>
              </div>
            ))}
            {jobs.length === 0 && <p className="no-jobs-msg">No active openings at the moment. Check back soon!</p>}
          </div>
        )}
      </section>

      {/* Work Culture & Benefits */}
      <section id="careers-benefits" className="careers-benefits-section">
        <h2>Work Culture & Benefits</h2>
        <p>
          We build an inclusive culture that values sustainability, autonomy,
          and learning.
        </p>

        <div className="careers-benefits-container">
          <div className="careers-benefit-item">
            <FaLaptopHouse className="careers-benefit-icon" />
            <div>
              <h4>Hybrid Work</h4>
              <p>Flexible remote + on-site collaboration.</p>
            </div>
          </div>

          <div className="careers-benefit-item">
            <FaGraduationCap className="careers-benefit-icon" />
            <div>
              <h4>Learning Opportunities</h4>
              <p>Annual budget for growth and conferences.</p>
            </div>
          </div>

          <div className="careers-benefit-item">
            <FaLeaf className="careers-benefit-icon" />
            <div>
              <h4>Eco-friendly Workspace</h4>
              <p>Sustainable offices powered by renewables.</p>
            </div>
          </div>

          <div className="careers-benefit-item">
            <FaHeart className="careers-benefit-icon" />
            <div>
              <h4>Wellness Programs</h4>
              <p>Mental and physical health benefits.</p>
            </div>
          </div>
        </div>

        <div className="careers-teammate-quote">
          <h5>What our teammates say</h5>
          <div className="careers-quote-box">
            <p>“I feel proud contributing to tangible climate impact.”</p>
            <span>— Amara, Product</span>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="careers-why-join-section">
        <h2>Why Join Us</h2>
        <p>
          Be part of a team delivering measurable outcomes for the planet and
          future generations.
        </p>

        <div className="careers-stats-container">
          <div className="careers-stat-card">
            <h3>500+</h3>
            <p>Tons of CO₂ Offset</p>
          </div>
          <div className="careers-stat-card">
            <h3>20,000+</h3>
            <p>Trees Planted</p>
          </div>
          <div className="careers-stat-card">
            <h3>100%</h3>
            <p>Renewable Office Energy</p>
          </div>
        </div>
      </section>

      {/* Apply Section */}
      <section id="careers-apply" className="careers-apply-section">
        <h2>Apply Now</h2>
        <p>
          We review every application with care. Tell us why you want to help
          make the planet carbon positive.
        </p>

        <div className="careers-apply-container">
          <button className="careers-linkedin-apply">
            <FaLinkedin /> Apply via LinkedIn
          </button>

          <form className="careers-apply-form" onSubmit={handleAppSubmit}>
            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Your full name"
              value={appForm.name}
              onChange={handleAppChange}
              required
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@company.com"
              value={appForm.email}
              onChange={handleAppChange}
              required
            />

            <label>Role Applying For</label>
            <input
              type="text"
              name="role"
              placeholder="e.g. Frontend Engineer"
              value={appForm.role}
              onChange={handleAppChange}
              required
            />

            <label>Resume (Optional)</label>
            <input type="file" disabled title="Upload not yet implemented" />

            <label>Message</label>
            <textarea
              name="message"
              placeholder="Share a short note"
              value={appForm.message}
              onChange={handleAppChange}
            ></textarea>

            <button type="submit" className="careers-submit-btn" disabled={appStatus === 'submitting'}>
              {appStatus === 'submitting' ? 'Sending...' : 'Submit Application'}
            </button>
            {appStatus === 'success' && <p style={{ color: 'green', marginTop: '10px' }}>Application sent successfully!</p>}
            {appStatus === 'error' && <p style={{ color: 'red', marginTop: '10px' }}>Something went wrong. Please try again.</p>}
          </form>
        </div>
      </section>

    </div>

  );
};

export default CareersPage;
