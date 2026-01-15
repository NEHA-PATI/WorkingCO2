import React, { useState } from "react";
// Navbar and Footer are provided by BaseLayout
import "../styles/user/Careers.css";
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

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  const jobs = [
    {
      title: "Frontend Engineer",
      dept: "Engineering",
      type: "Remote",
      level: "Mid",
    },
    {
      title: "Backend Engineer",
      dept: "Engineering",
      type: "Remote",
      level: "Senior",
    },
    {
      title: "Product Designer",
      dept: "Design",
      type: "On-site",
      level: "Mid",
    },
    {
      title: "Sustainability Analyst",
      dept: "Impact",
      type: "Hybrid",
      level: "Junior",
    },
    {
      title: "Partnerships Manager",
      dept: "Business",
      type: "On-site",
      level: "Senior",
    },
    {
      title: "Data Scientist",
      dept: "Engineering",
      type: "Hybrid",
      level: "Senior",
    },
  ];

  return (
    <div className="careers-page-wrapper">
      {/* Navbar */}
      <header className="careers-navbar">
        <div className={`careers-nav-links ${menuOpen ? "open" : ""}`}>
          <button onClick={() => scrollToSection("careers-mission")}>
            Mission
          </button>
          <button onClick={() => scrollToSection("careers-openings")}>
            Openings
          </button>
          <button onClick={() => scrollToSection("careers-benefits")}>
            Benefits
          </button>
          <button onClick={() => scrollToSection("careers-apply")}>
            Apply
          </button>
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

        <div className="careers-job-cards">
          {jobs.map((job, i) => (
            <div className="careers-job-card" key={i}>
              <h3>{job.title}</h3>
              <div className="careers-job-meta">
                <span className="careers-dept-tag">{job.dept}</span>
                <span className="careers-meta">
                  <FaMapMarkerAlt /> {job.type}
                </span>
                <span className="careers-meta">
                  <FaUserTie /> {job.level}
                </span>
              </div>
              <div className="careers-job-buttons">
                <button className="careers-apply-btn">Apply</button>
                <button className="careers-linkedin-btn">
                  <FaLinkedin /> Apply via LinkedIn
                </button>
              </div>
            </div>
          ))}
        </div>
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

          <form className="careers-apply-form">
            <label>Name</label>
            <input type="text" placeholder="Your full name" />

            <label>Email</label>
            <input type="email" placeholder="you@company.com" />

            <label>Role Applying For</label>
            <input type="text" placeholder="e.g. Frontend Engineer" />

            <label>Resume</label>
            <input type="file" />

            <label>Message</label>
            <textarea placeholder="Share a short note"></textarea>

            <button type="submit" className="careers-submit-btn">
              Submit Application
            </button>
          </form>
        </div>
      </section>
      {/* Footer is provided by BaseLayout */}
    </div>
  );
};

export default CareersPage;
