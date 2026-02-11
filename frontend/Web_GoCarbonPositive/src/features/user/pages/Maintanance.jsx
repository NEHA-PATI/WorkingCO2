import React, { useEffect, useState } from "react";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

.maintenance-wrapper {
  font-family: 'Poppins', sans-serif;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: #0a0a0a;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0;
  transition: opacity 1.5s ease;
}
.loaded .orb { opacity: 1; }

.orb-1 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(34,197,94,0.25), transparent 70%);
  top: -15%; right: -10%;
  animation: float1 12s ease-in-out infinite;
}
.orb-2 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(16,185,129,0.2), transparent 70%);
  bottom: -10%; left: -8%;
  animation: float2 15s ease-in-out infinite;
}
.orb-3 {
  width: 300px; height: 300px;
  background: radial-gradient(circle, rgba(255,255,255,0.05), transparent 70%);
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  animation: float3 10s ease-in-out infinite;
}

@keyframes float1 {
  0%, 100% { transform: translate(0,0) scale(1); }
  33% { transform: translate(-30px,40px) scale(1.05); }
  66% { transform: translate(20px,-20px) scale(0.95); }
}
@keyframes float2 {
  0%, 100% { transform: translate(0,0) scale(1); }
  33% { transform: translate(40px,-30px) scale(1.1); }
  66% { transform: translate(-20px,20px) scale(0.9); }
}
@keyframes float3 {
  0%, 100% { transform: translate(-50%,-50%) scale(1); }
  50% { transform: translate(-50%,-50%) scale(1.2); }
}

.grid-overlay {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
  background-size: 60px 60px;
  pointer-events: none;
}

.maintenance-content {
  position: relative; z-index: 10;
  text-align: center;
  max-width: 620px; width: 100%;
  padding: 40px 24px;
  opacity: 0; transform: translateY(30px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.loaded .maintenance-content { opacity: 1; transform: translateY(0); }

.gears-container {
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 32px; position: relative; height: 80px;
}
.gear { color: rgba(34,197,94,0.7); filter: drop-shadow(0 0 12px rgba(34,197,94,0.3)); }
.gear-large { width: 70px; height: 70px; animation: spinCW 8s linear infinite; }
.gear-small {
  width: 48px; height: 48px;
  margin-left: -14px; margin-top: -28px;
  color: rgba(255,255,255,0.6);
  filter: drop-shadow(0 0 8px rgba(255,255,255,0.15));
  animation: spinCCW 6s linear infinite;
}

@keyframes spinCW { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes spinCCW { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }

.status-badge {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 8px 20px; border-radius: 100px;
  background: rgba(34,197,94,0.1);
  border: 1px solid rgba(34,197,94,0.2);
  font-size: 13px; font-weight: 500;
  color: #4ade80; letter-spacing: 0.5px;
  text-transform: uppercase; margin-bottom: 28px;
}
.pulse-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: #22c55e;
  animation: pulse 2s ease-in-out infinite;
  box-shadow: 0 0 8px rgba(34,197,94,0.6);
}
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

.maintenance-title {
  font-size: 48px; font-weight: 700;
  line-height: 1.15; color: #ffffff;
  margin: 0 0 20px; letter-spacing: -1px;
}
.gradient-text {
  background: linear-gradient(135deg, #22c55e 0%, #4ade80 40%, #bbf7d0 70%, #ffffff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.maintenance-desc {
  font-size: 16px; line-height: 1.7;
  color: rgba(255,255,255,0.5); font-weight: 300;
  margin: 0 auto 36px; max-width: 480px;
}

.progress-section { margin-bottom: 40px; }
.progress-bar-track {
  width: 100%; max-width: 360px; height: 4px;
  background: rgba(255,255,255,0.08);
  border-radius: 100px; margin: 0 auto 12px; overflow: hidden;
}
.progress-bar-fill {
  width: 65%; height: 100%; border-radius: 100px;
  background: linear-gradient(90deg, #22c55e, #4ade80);
  animation: progressGlow 2s ease-in-out infinite alternate;
  position: relative;
}
.progress-bar-fill::after {
  content: ''; position: absolute; right: 0; top: -2px;
  width: 8px; height: 8px; background: #4ade80;
  border-radius: 50%; box-shadow: 0 0 12px rgba(34,197,94,0.8);
}
@keyframes progressGlow {
  from { box-shadow: 0 0 8px rgba(34,197,94,0.3); }
  to { box-shadow: 0 0 20px rgba(34,197,94,0.6); }
}
.progress-text { font-size: 13px; color: rgba(255,255,255,0.35); font-weight: 400; margin: 0; }

.btn-group {
  display: flex; align-items: center; justify-content: center;
  gap: 16px; margin-bottom: 48px; flex-wrap: wrap;
}
.btn-primary, .btn-secondary {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 14px 32px; border-radius: 14px;
  font-family: 'Poppins', sans-serif; font-size: 14px;
  font-weight: 600; cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
  text-decoration: none; letter-spacing: 0.3px;
}
.btn-primary {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff; border: none;
  box-shadow: 0 4px 20px rgba(34,197,94,0.3), inset 0 1px 0 rgba(255,255,255,0.15);
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(34,197,94,0.45), inset 0 1px 0 rgba(255,255,255,0.15);
  background: linear-gradient(135deg, #16a34a, #15803d);
}
.btn-secondary {
  background: transparent; color: rgba(255,255,255,0.8);
  border: 1px solid rgba(255,255,255,0.15);
  backdrop-filter: blur(10px);
}
.btn-secondary:hover {
  transform: translateY(-2px);
  border-color: rgba(34,197,94,0.4); color: #4ade80;
  box-shadow: 0 4px 20px rgba(34,197,94,0.1);
}

.maintenance-footer { opacity: 0; transition: opacity 1s ease 0.5s; }
.loaded .maintenance-footer { opacity: 1; }
.footer-divider {
  width: 60px; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
  margin: 0 auto 20px;
}
.footer-text {
  font-size: 12px; color: rgba(255,255,255,0.3);
  text-transform: uppercase; letter-spacing: 2px;
  font-weight: 500; margin: 0 0 16px;
}
.social-icons { display: flex; align-items: center; justify-content: center; gap: 16px; }
.social-link {
  width: 42px; height: 42px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  color: rgba(255,255,255,0.35);
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.06);
  transition: all 0.3s ease; text-decoration: none;
}
.social-link:hover {
  color: #4ade80; background: rgba(34,197,94,0.1);
  border-color: rgba(34,197,94,0.25); transform: translateY(-2px);
}

@media (max-width: 640px) {
  .maintenance-title { font-size: 32px; letter-spacing: -0.5px; }
  .maintenance-desc { font-size: 14px; padding: 0 8px; }
  .btn-primary, .btn-secondary { padding: 12px 24px; font-size: 13px; }
  .gears-container { margin-bottom: 24px; }
  .gear-large { width: 56px; height: 56px; }
  .gear-small { width: 38px; height: 38px; margin-left: -10px; margin-top: -22px; }
}
`;

export default function Maintenance() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className={`maintenance-wrapper ${loaded ? "loaded" : ""}`}>
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="grid-overlay" />

        <div className="maintenance-content">
          <div className="gears-container">
            <svg className="gear gear-large" viewBox="0 0 100 100" fill="none">
              <path d="M50 35a15 15 0 100 30 15 15 0 000-30zm0 24a9 9 0 110-18 9 9 0 010 18z" fill="currentColor"/>
              <path d="M93.5 42.5h-6.8a37.5 37.5 0 00-3.2-7.7l4.8-4.8a3.5 3.5 0 000-5L83 20a3.5 3.5 0 00-5 0l-4.8 4.8a37.5 37.5 0 00-7.7-3.2V14.5a3.5 3.5 0 00-3.5-3.5h-8a3.5 3.5 0 00-3.5 3.5v6.8a37.5 37.5 0 00-7.7 3.2L38 19.7a3.5 3.5 0 00-5 0L28 25a3.5 3.5 0 000 5l4.8 4.8a37.5 37.5 0 00-3.2 7.7h-6.1a3.5 3.5 0 00-3.5 3.5v8a3.5 3.5 0 003.5 3.5h6.8a37.5 37.5 0 003.2 7.7L28.7 70a3.5 3.5 0 000 5L34 80.3a3.5 3.5 0 005 0l4.8-4.8a37.5 37.5 0 007.7 3.2v6.8a3.5 3.5 0 003.5 3.5h8a3.5 3.5 0 003.5-3.5v-6.8a37.5 37.5 0 007.7-3.2l4.8 4.8a3.5 3.5 0 005 0L89 75a3.5 3.5 0 000-5l-4.8-4.8a37.5 37.5 0 003.2-7.7h6.1a3.5 3.5 0 003.5-3.5v-8a3.5 3.5 0 00-3.5-3.5z" fill="currentColor"/>
            </svg>
            <svg className="gear gear-small" viewBox="0 0 100 100" fill="none">
              <path d="M50 35a15 15 0 100 30 15 15 0 000-30zm0 24a9 9 0 110-18 9 9 0 010 18z" fill="currentColor"/>
              <path d="M93.5 42.5h-6.8a37.5 37.5 0 00-3.2-7.7l4.8-4.8a3.5 3.5 0 000-5L83 20a3.5 3.5 0 00-5 0l-4.8 4.8a37.5 37.5 0 00-7.7-3.2V14.5a3.5 3.5 0 00-3.5-3.5h-8a3.5 3.5 0 00-3.5 3.5v6.8a37.5 37.5 0 00-7.7 3.2L38 19.7a3.5 3.5 0 00-5 0L28 25a3.5 3.5 0 000 5l4.8 4.8a37.5 37.5 0 00-3.2 7.7h-6.1a3.5 3.5 0 00-3.5 3.5v8a3.5 3.5 0 003.5 3.5h6.8a37.5 37.5 0 003.2 7.7L28.7 70a3.5 3.5 0 000 5L34 80.3a3.5 3.5 0 005 0l4.8-4.8a37.5 37.5 0 007.7 3.2v6.8a3.5 3.5 0 003.5 3.5h8a3.5 3.5 0 003.5-3.5v-6.8a37.5 37.5 0 007.7-3.2l4.8 4.8a3.5 3.5 0 005 0L89 75a3.5 3.5 0 000-5l-4.8-4.8a37.5 37.5 0 003.2-7.7h6.1a3.5 3.5 0 003.5-3.5v-8a3.5 3.5 0 00-3.5-3.5z" fill="currentColor"/>
            </svg>
          </div>

          <div className="status-badge">
            <span className="pulse-dot" />
            <span>Scheduled Maintenance</span>
          </div>

          <h1 className="maintenance-title">
            We're Making Things
            <br />
            <span className="gradient-text">Better For You</span>
          </h1>

          <p className="maintenance-desc">
            Our team is currently performing scheduled maintenance to enhance your experience.
            We'll be back shortly with exciting improvements. Thank you for your patience!
          </p>

          <div className="progress-section">
            <div className="progress-bar-track">
              <div className="progress-bar-fill" />
            </div>
            <p className="progress-text">Estimated completion: ~2 hours</p>
          </div>

          <div className="btn-group">
            <a href="mailto:support@example.com" className="btn-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              Contact Us
            </a>
            <button className="btn-secondary" onClick={() => window.location.reload()}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10"/>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
              </svg>
              Reload Page
            </button>
          </div>

          <div className="maintenance-footer">
            <div className="footer-divider" />
            <p className="footer-text">Follow us for live updates</p>
            <div className="social-icons">
              <a href="#" className="social-link" aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="GitHub">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}