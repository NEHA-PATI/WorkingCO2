import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/user/Home.css";

const features = [
  {
    iconUrl:
      "https://i.pinimg.com/474x/9e/8d/5e/9e8d5e07eed22f3364b0064a2bbb4dbf.jpg",
    title: "Risk Management",
    desc: `Comprehensive risk assessment and mitigation strategies for your carbon portfolio investments.`,
  },
  {
    iconUrl:
      "https://img.favpng.com/3/25/18/chart-graph-of-a-function-infographic-information-png-favpng-Me2vt9rFvHtWhUjADqmVynUhq.jpg",
    title: "Advanced Analytics",
    desc: "Sophisticated data analytics and reporting tools to track your carbon reduction progress and ROI metrics",
  },
  {
    iconUrl:
      "https://cdn.vectorstock.com/i/500p/20/58/vegan-world-logo-globe-leaf-vector-27912058.jpg",
    title: "Global Portfolio",
    desc: "Access to premium carbon offset projects across 50+ countries, with institutional-grade verification and transparency",
  },
];

const Home = () => {
  const navigate = useNavigate();
 

  const handleGetStarted = () => {
  navigate("/login");
};


  return (
    <>
      <div className="home-hero-section">
        <div className="home-container">
          <div className="home-hero-layout">
            <div className="home-hero-content">
              <h1>Building a Sustainable Future</h1>
              <p>
                Join us in creating a better world through sustainable
                development practices and environmental consciousness.
              </p>
              <div className="home-hero-buttons">
                <button
                  className="home-btn home-btn-white"
                  onClick={handleGetStarted}
                >
                  Get Started
                </button>
                <Link to="/about" className="home-btn home-btn-white">
                  Learn More
                </Link>
              </div>
            </div>

            <div className="home-hero-image">
              <div className="home-image-container">
                <img
                  src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
                  alt="Sustainable Future"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="home-features-section">
        <div className="home-container">
          <h2 className="home-section-title">
            Why Choose Sustainable Development?
          </h2>
          <p className="home-features-subtitle">
            Explore our core values and the impact we strive to make for a
            greener tomorrow.
          </p>
          <div className="home-features-inline">
            {features.map((feature, idx) => (
              <div className="home-feature-card" key={idx}>
                <div className="home-feature-icon">
                  <img
                    src={feature.iconUrl}
                    alt={`${feature.title} icon`}
                    className="home-feature-icon-img"
                  />
                </div>
                <h3 className="home-feature-title">{feature.title}</h3>
                <p className="home-feature-desc">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      {/*{showLogin && (
        <Login
          onClose={closeModal}
          onLogin={handleLoginSuccess}
          onSwitchToSignup={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
        />
      )}*/}

      {/*{showSignup && (
        <Signup
          onClose={closeModal}
          onSwitchToLogin={() => {
            setShowSignup(false);
            setShowLogin(true);
          }}
        />
      )}*/}
    </>
  );
};

export default Home;
