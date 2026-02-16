import React, { useEffect, useMemo, useState } from "react";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

.maintenance-wrapper {
  font-family: 'Poppins', sans-serif;
  width: 100%;
  height: 100%;
  min-height: 100%;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  position: relative;
  overflow: hidden;
  background: #f8fafc;
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
  background: #38b000;
  top: -15%; right: -10%;
  animation: float1 12s ease-in-out infinite;
}
.orb-2 {
  width: 400px; height: 400px;
  background: #38b000;
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
    linear-gradient(rgba(15,23,42,0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(15,23,42,0.035) 1px, transparent 1px);
  background-size: 60px 60px;
  pointer-events: none;
}

.maintenance-content {
  position: relative; z-index: 10;
  text-align: center;
  max-width: none;
  width: 100%;
  min-height: 100%;
  padding: 40px 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  justify-content: safe center;
  overflow-y: auto;
  background: #ffffff;
  border: none;
  border-radius: 0;
  box-shadow: none;
  opacity: 0; transform: translateY(30px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.loaded .maintenance-content { opacity: 1; transform: translateY(0); }

.gears-container {
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 32px; position: relative; height: 80px;
}
.gear { color: rgba(22,163,74,0.85); filter: drop-shadow(0 0 10px rgba(22,163,74,0.25)); }
.gear-large { width: 70px; height: 70px; animation: spinCW 8s linear infinite; }
.gear-small {
  width: 48px; height: 48px;
  margin-left: -14px; margin-top: -28px;
  color: #334155;
  filter: drop-shadow(0 0 8px rgba(51,65,85,0.18));
  animation: spinCCW 6s linear infinite;
}

@keyframes spinCW { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes spinCCW { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }

.status-badge {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 8px 20px; border-radius: 100px;
  background: #ecfdf3;
  border: 1px solid #bbf7d0;
  font-size: 13px; font-weight: 500;
  color: #15803d; letter-spacing: 0.5px;
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
  line-height: 1.15; color: #0f172a;
  margin: 0 0 20px; letter-spacing: -1px;
}
.gradient-text {
  background: #38b000;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.maintenance-desc {
  font-size: 16px; line-height: 1.7;
  color: #475569; font-weight: 400;
  margin: 0 auto 36px; max-width: 560px;
}

.progress-section { margin-bottom: 40px; }
.progress-bar-track {
  width: 100%; max-width: 360px; height: 4px;
  background: #dbe3ec;
  border-radius: 100px; margin: 0 auto 12px; overflow: hidden;
}
.progress-bar-fill {
  width: 65%; height: 100%; border-radius: 100px;
  background: #38b000;
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
.progress-text { font-size: 13px; color: #64748b; font-weight: 500; margin: 0; }

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
  background: #38b000;
  color: #fff; border: none;
  box-shadow: 0 4px 20px rgba(34,197,94,0.3), inset 0 1px 0 rgba(255,255,255,0.15);
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(34,197,94,0.45), inset 0 1px 0 rgba(255,255,255,0.15);
  background: #38b000;
}
.btn-secondary {
  background: #ffffff; color: #0f172a;
  border: 1px solid #cbd5e1;
  backdrop-filter: none;
}
.btn-secondary:hover {
  transform: translateY(-2px);
  border-color: #86efac; color: #166534;
  box-shadow: 0 4px 20px rgba(22,163,74,0.12);
  background: #f0fdf4;
}

.maintenance-footer { opacity: 0; transition: opacity 1s ease 0.5s; }
.loaded .maintenance-footer { opacity: 1; }
.footer-divider {
  width: 60px; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(15,23,42,0.22), transparent);
  margin: 0 auto 20px;
}
.footer-text {
  font-size: 12px; color: #64748b;
  text-transform: uppercase; letter-spacing: 2px;
  font-weight: 500; margin: 0 0 16px;
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

export default function MaintenancePage({
  pageName = "Page",
  description,
  badgeText,
  footerText,
  progressText = "Content update in progress.",
  backHref = "/admin/overview",
  backLabel = "Back to Overview",
}) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const safePageName = String(pageName || "Page");
  const resolvedDescription = useMemo(
    () =>
      description ||
      "This feature is currently under preparation. Its content and management features will be updated later.",
    [description]
  );
  const resolvedBadge = badgeText || `${safePageName} Module Notice`;
  const resolvedFooter =
    footerText || `${safePageName} page content will be updated later`;

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
              <path d="M50 35a15 15 0 100 30 15 15 0 000-30zm0 24a9 9 0 110-18 9 9 0 010 18z" fill="currentColor" />
              <path d="M93.5 42.5h-6.8a37.5 37.5 0 00-3.2-7.7l4.8-4.8a3.5 3.5 0 000-5L83 20a3.5 3.5 0 00-5 0l-4.8 4.8a37.5 37.5 0 00-7.7-3.2V14.5a3.5 3.5 0 00-3.5-3.5h-8a3.5 3.5 0 00-3.5 3.5v6.8a37.5 37.5 0 00-7.7 3.2L38 19.7a3.5 3.5 0 00-5 0L28 25a3.5 3.5 0 000 5l4.8 4.8a37.5 37.5 0 00-3.2 7.7h-6.1a3.5 3.5 0 00-3.5 3.5v8a3.5 3.5 0 003.5 3.5h6.8a37.5 37.5 0 003.2 7.7L28.7 70a3.5 3.5 0 000 5L34 80.3a3.5 3.5 0 005 0l4.8-4.8a37.5 37.5 0 007.7 3.2v6.8a3.5 3.5 0 003.5 3.5h8a3.5 3.5 0 003.5-3.5v-6.8a37.5 37.5 0 007.7-3.2l4.8 4.8a3.5 3.5 0 005 0L89 75a3.5 3.5 0 000-5l-4.8-4.8a37.5 37.5 0 003.2-7.7h6.1a3.5 3.5 0 003.5-3.5v-8a3.5 3.5 0 00-3.5-3.5z" fill="currentColor" />
            </svg>
            <svg className="gear gear-small" viewBox="0 0 100 100" fill="none">
              <path d="M50 35a15 15 0 100 30 15 15 0 000-30zm0 24a9 9 0 110-18 9 9 0 010 18z" fill="currentColor" />
              <path d="M93.5 42.5h-6.8a37.5 37.5 0 00-3.2-7.7l4.8-4.8a3.5 3.5 0 000-5L83 20a3.5 3.5 0 00-5 0l-4.8 4.8a37.5 37.5 0 00-7.7-3.2V14.5a3.5 3.5 0 00-3.5-3.5h-8a3.5 3.5 0 00-3.5 3.5v6.8a37.5 37.5 0 00-7.7 3.2L38 19.7a3.5 3.5 0 00-5 0L28 25a3.5 3.5 0 000 5l4.8 4.8a37.5 37.5 0 00-3.2 7.7h-6.1a3.5 3.5 0 00-3.5 3.5v8a3.5 3.5 0 003.5 3.5h6.8a37.5 37.5 0 003.2 7.7L28.7 70a3.5 3.5 0 000 5L34 80.3a3.5 3.5 0 005 0l4.8-4.8a37.5 37.5 0 007.7 3.2v6.8a3.5 3.5 0 003.5 3.5h8a3.5 3.5 0 003.5-3.5v-6.8a37.5 37.5 0 007.7-3.2l4.8 4.8a3.5 3.5 0 005 0L89 75a3.5 3.5 0 000-5l-4.8-4.8a37.5 37.5 0 003.2-7.7h6.1a3.5 3.5 0 003.5-3.5v-8a3.5 3.5 0 00-3.5-3.5z" fill="currentColor" />
            </svg>
          </div>

          <div className="status-badge">
            <span className="pulse-dot" />
            <span>{resolvedBadge}</span>
          </div>

          <h1 className="maintenance-title">
            This Feature Is
            <br />
            <span className="gradient-text">Coming Soon</span>
          </h1>

          <p className="maintenance-desc">{resolvedDescription}</p>

          <div className="progress-section">
            <div className="progress-bar-track">
              <div className="progress-bar-fill" />
            </div>
            <p className="progress-text">{progressText}</p>
          </div>

          <div className="btn-group">
            <a href={backHref} className="btn-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              {backLabel}
            </a>
            <button className="btn-secondary" onClick={() => window.location.reload()}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
              Reload Page
            </button>
          </div>

          <div className="maintenance-footer">
            <div className="footer-divider" />
            <p className="footer-text">{resolvedFooter}</p>
          </div>
        </div>
      </div>
    </>
  );
}
