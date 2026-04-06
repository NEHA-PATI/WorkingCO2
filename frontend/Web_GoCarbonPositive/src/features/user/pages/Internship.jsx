import React from "react";
import { FaBriefcase } from "react-icons/fa";
import {
  FaCircleCheck,
  FaMagnifyingGlass,
  FaPaperPlane,
  FaRocket,
} from "react-icons/fa6";
import "../styles/Internship.css";

const InternshipPage = () => {
  const internshipFormUrl =
    "https://docs.google.com/forms/d/e/1FAIpQLSdznp5YPTPRwDYondAXtqbr9QSVUdMOtkYWdgKAkApfqjtquw/viewform";
  const internshipHeroImage =
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80";

  const openInternshipForm = () => {
    window.open(internshipFormUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="internship26-page-wrapper">
      {/* Top Hero Section */}
      <section className="internship26-hero-section">
        <div className="internship26-hero-inner">
          <div className="internship26-hero-left">
            <div className="internship26-hero-badge">
              Applications Open - Summer Internship 2026
            </div>
            <h1 className="internship26-hero-title">
              Kickstart Your Career <span className="internship26-hero-green">With Us</span>
            </h1>
            <p className="internship26-hero-subtitle">
              Join our internship program and work on real-world impactful
              projects alongside industry leaders who are invested in your
              growth.
            </p>
            <div className="internship26-hero-actions">
              <button
                className="internship26-primary-btn"
                onClick={openInternshipForm}
              >
                Apply Now
              </button>
            </div>
          </div>

          <div className="internship26-hero-right">
            <div className="internship26-hero-illustration">
              <div className="internship26-hero-image-shell">
                <img
                  className="internship26-hero-image"
                  src={internshipHeroImage}
                  alt="Interns collaborating on a project together"
                />
              </div>
              <div className="internship26-hero-image-caption">
                <span>Hands-on projects</span>
                <span>Mentor-led learning</span>
                <span>Career-ready experience</span>
                <span>Team-Work</span>
              </div>
              <div className="internship26-hero-image-glow" aria-hidden="true">
                <div className="internship26-hero-glow internship26-hero-glow-green" />
                <div className="internship26-hero-glow internship26-hero-glow-blue" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program About Section */}
      <section className="internship26-about-section">
        <div className="internship26-about-inner">
          <div className="internship26-about-left">
            <div className="internship26-about-label">ABOUT THE PROGRAM</div>
            <h2 className="internship26-about-title">
              More Than an Internship - {" "}
              <span className="internship26-about-green">A Career Launchpad</span>
            </h2>
            <p className="internship26-about-description">
              Our 2-Months program is designed to bridge the gap between academics
              and industry. You&apos;ll work on live products, ship real features,
              and leave with a portfolio that speaks for itself - not just a line
              on your resume.
            </p>
            <ul className="internship26-about-list">
              <li>Hands-on real-world projects from day one</li>
              <li>Mentorship from senior industry experts</li>
              <li>Verified certificate upon completion</li>
              <li>Flexible remote &amp; hybrid options available</li>
              <li>2-Months structured learning roadmap</li>
            </ul>
          </div>

          <div className="internship26-about-right">
            <div className="internship26-cohort-card">
              <div className="internship26-cohort-header">
                <div>
                  <div className="internship26-cohort-year"> Internship 2026 </div>
                  <div className="internship26-cohort-sub">Summer Program</div>
                </div>
                <div className="internship26-cohort-icon" aria-hidden="true">
                  <FaBriefcase />
                </div>
              </div>
              <div className="internship26-cohort-row">
                <span>Duration</span>
                <span>2 Months</span>
              </div>
              <div className="internship26-cohort-row">
                <span>Mode</span>
                <span>Remote / Hybrid</span>
              </div>
              <div className="internship26-cohort-row">
                <span>Start Date</span>
                <span>Immediate Joining</span>
              </div>
              <div className="internship26-cohort-cert">
                Certificate Included
                <br />
                <span>Industry-recognized credential upon completion</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="internship26-steps-section">
        <h2 className="internship26-steps-heading">Your Journey to Day 1</h2>
        <p className="internship26-steps-subheading">
          A transparent, 4-step process designed to be fair and respectful of your time.
        </p>

        <div className="internship26-steps-row">
          <div className="internship26-step-card">
            <div className="internship26-step-icon internship26-step-icon-apply">
              <FaPaperPlane />
            </div>
            <h3 className="internship26-step-title">Apply</h3>
            <p className="internship26-step-text">
              Submit your application with your updated resume.
            </p>
          </div>

          <div className="internship26-step-card">
            <div className="internship26-step-icon internship26-step-icon-screening">
              <FaMagnifyingGlass />
            </div>
            <h3 className="internship26-step-title">Screening</h3>
            <p className="internship26-step-text">
              Our team reviews your application and checks for role fit.
            </p>
          </div>

          <div className="internship26-step-card">
            <div className="internship26-step-icon internship26-step-icon-selection">
              <FaCircleCheck />
            </div>
            <h3 className="internship26-step-title">Selection</h3>
            <p className="internship26-step-text">
              Offers extended to successful candidates within 48 hours.
            </p>
          </div>

          <div className="internship26-step-card">
            <div className="internship26-step-icon internship26-step-icon-onboarding">
              <FaRocket />
            </div>
            <h3 className="internship26-step-title">Onboarding</h3>
            <p className="internship26-step-text">
              Kickoff call, team intro, Day 1 begins!
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="internship26-cta-section">
        <div className="internship26-cta-inner">
          <div className="internship26-cta-badge">Limited Seats Available</div>
          <h2 className="internship26-cta-title">
            Ready to Start <span className="internship26-cta-green">Your Journey?</span>
          </h2>
          <p className="internship26-cta-text">
            Don&apos;t let this opportunity pass. Many applied last year.
            The ones who acted early got in. This is your moment.
          </p>
          <button className="internship26-cta-btn" onClick={openInternshipForm}>
            Apply for Internship
          </button>
        </div>
      </section>
    </div>
  );
};

export default InternshipPage;
