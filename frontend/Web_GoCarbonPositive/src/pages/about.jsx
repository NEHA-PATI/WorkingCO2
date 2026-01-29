import React from "react";
import "../styles/user/about.css";

const features = [
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="12" fill="none" />
        <path
          d="M7 8h10M7 8l2-2M7 8l2 2"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17 16H7m10 0l-2 2m2-2l-2-2"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    label: "Carbon Trading",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="12" fill="none" />
        <path
          d="M12 17v-5M12 12l-2-2m2 2l2-2M12 12V7"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="7" r="3" stroke="#fff" strokeWidth="2" />
      </svg>
    ),
    label: "Carbon Offset",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="12" fill="none" />
        <rect x="7" y="14" width="2" height="4" fill="#fff" />
        <rect x="11" y="10" width="2" height="8" fill="#fff" />
        <rect x="15" y="12" width="2" height="6" fill="#fff" />
      </svg>
    ),
    label: "Impact Analysis",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="12" fill="none" />
        <path
          d="M12 4l6 3v4c0 5-6 9-6 9s-6-4-6-9V7l6-3z"
          stroke="#fff"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M10 12l2 2 3-3"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    label: "ESG Compliance",
  },
];

const stats = [
  { value: "98%", label: "Happy clients for our organic products" },
  { value: "250+", label: "Happy tons of harvest in the whole world wide" },
];

export default function About()
// ({ isAuthenticated, user, onLogout }) 
{
  return (
    <>
      {/* <Navbar /> */}
      <div className="about-hero-section-v2">
        <div className="about-hero-content-v2">
          <div className="about-hero-left-v2">
            <h1>
              <span className="highlight-yellow">Together</span>,{" "}
              <div className="black ">
                we are building a greener future with carbon credits.
              </div>{" "}
              <span role="img" aria-label="leaf">
                🌿
              </span>
            </h1>
          </div>
          <div className="about-hero-right-v2">
            <div className="about-hero-box-v2">
              <p className="about-hero-desc-v2">
                Our platform empowers individuals and organizations to measure,
                reduce, and offset their carbon footprint—making climate action
                accessible to all. Every action counts. Start your journey to
                sustainability today. Measure, reduce, and offset your impact
                with us.
              </p>
            </div>
          </div>
        </div>
        <div className="about-hero-features-v2">
          <div className="about-features-line-v2">
            {features.map((f, idx) => (
              <div className="about-feature-stack-v2" key={f.label}>
                <div className="about-feature-circle-v2">
                  <span className="about-feature-icon-v2">{f.icon}</span>
                </div>
                <span className="about-feature-label-v2">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="about-image-section-v2">
        <div className="about-image-overlay-v2">
          <div className="about-image-text-v2">
            <h2>Empowering climate action for a sustainable tomorrow.</h2>
            <p>
              Join us in reducing global emissions, supporting impactful
              projects, and building a greener future through carbon credits and
              sustainability initiatives.
            </p>
          </div>
        </div>
        <img
          className="about-image-v2"
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80"
          alt="Environment"
        />
      </div>

      <div className="about-main-content">
        <div className="about-who-we-are">
          <div className="about-who-text">
            <h2>
              Leading the Way in{" "}
              <span className="highlight">Carbon Solutions</span>
            </h2>
            <p>
              We are dedicated to accelerating the transition to a low-carbon
              world. Our platform connects individuals and organizations to
              verified carbon offset projects, transparent trading, and
              actionable climate insights.
            </p>
            <div className="about-mission-vision">
              <div className="about-card about-mission">
                <h4>Our Mission</h4>
                <p>
                  To empower everyone to take meaningful climate action by
                  making carbon offsetting, trading, and impact analysis
                  accessible, transparent, and effective.
                </p>
              </div>
              <div className="about-card about-vision">
                <h4>Our Vision</h4>
                <p>
                  A net-zero future where every footprint is balanced, every
                  project is impactful, and every action counts for the planet.
                </p>
              </div>
            </div>
          </div>
          <div className="about-who-image">
            <img
              src="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=800&q=80"
              alt="Green Landscape"
            />
          </div>
        </div>
        <div className="about-why-choose">
          <div className="about-why-text">
            <h3>
              Why Choose <span className="highlight">CarbonCredit?</span>
            </h3>
            <p>
              We offer a seamless experience for measuring, reducing, and
              offsetting your carbon footprint. Our verified projects,
              transparent reporting, and expert support help you make a real
              difference for the climate.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
