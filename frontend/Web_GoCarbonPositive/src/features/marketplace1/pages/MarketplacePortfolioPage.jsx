import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiArrowDown,
  FiBriefcase,
  FiCheckCircle,
  FiCreditCard,
  FiDownload,
  FiDollarSign,
  FiList,
  FiMoreHorizontal,
  FiPlusCircle,
  FiTag,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import { FaLeaf } from "react-icons/fa";

import MarketplaceNavbar from "../components/MarketplaceNavbar";
import "../styles/marketplace1.css";

const LISTING_ROWS = [
  {
    name: "Amazon Reforestation Alpha",
    status: "active",
    quantity: "1,200",
    price: "$45.00",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC205jgfeqLdX8ecPFieO1bob5ECcnkn-O7QR6H3VOrDCSP0VJt1TJCcyyooAFmN_zTBLEsbMMhqHRw0sOrebRQfWxHIKBJm205-g-MuwK97ShcLAFeRJaA4S80H7zyG1fdsAT-LXq5u4JC0Z72dz9HnY20mnQYTkJsFOD-8HplhSHKoVOzARom5HQggvHk6xaTh6u9EkT1udGc5IoP0-t7uHyXxua7Ku1EjZV8YHna9neZ40HvssvNDYc0oAdd50n3isdD7Px42IWT",
  },
  {
    name: "Sahara Wind Power Phase II",
    status: "under-review",
    quantity: "2,000",
    price: "$28.50",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBjYiIWJfBY-rZyFD4aQPMjgiiO34wpzVmQNKr1e2JnfOrRTQA8c-L1J3F_ETFlsRneFEN1BrgICXZpnIqGdcSIWaSsJGL04pn62OH73Mgxn-TIslgItGOgpoD5UyuQU4oEYj5VHkFTdRXVHV37r4X6D41JVD6831QTmQFbLV8b9kEc3kQ7ggkzqwzjB4cBvJH7eLDrapPSlPdymsJcnkV1WSOqridQihdLGmbCcSMroxkWFkaKtZ5YkfT4KvO7q4yEglzwzbvOiuzF",
  },
  {
    name: "Methane Capture Project",
    status: "rejected",
    quantity: "500",
    price: "$32.00",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDutcdgxnh6bhgwcjuOjYmDlybHxytca1LpNLJi1GKaA_CeFlsoqlRRtTaHPJEYfl2tfMpLKyZ7PCdoAsk6yIBVad3woLMjDBCUsgrQMTuaUkkvBbSAGuMIpRoJFlJ3obNyH83j0M13ojDR6UWGmuRdk_6j3NZ8_XN_E1IpZOKjdeGbFbelOLMKspCH85ZgaA985ykmi17kxNdrzzK8GLdZfGTxyLqWmfoB5UWBRXx7TV1uEV6TnMQW3FAqKADhA4Cf52DuLUk0Gc0b",
  },
];

const RETIREMENT_ROWS = [
  {
    name: "Oceanic Blue Carbon Initiative",
    date: "Sept 14, 2023",
  },
  {
    name: "Alpine Biomass Gasification",
    date: "Aug 28, 2023",
  },
];

const GEO_SPREAD = [
  { label: "LATAM", percent: 45, barClass: "mkt-portfolio-geo-fill-45" },
  { label: "Africa", percent: 30, barClass: "mkt-portfolio-geo-fill-30" },
  { label: "APAC", percent: 25, barClass: "mkt-portfolio-geo-fill-25" },
];

const RECENT_ACTIVITY = [
  {
    title: "Credit Purchase",
    meta: "Oct 12, 2023 • AMZN-REF-23",
    amount: "-$12,400.00",
    tone: "negative",
    icon: FiArrowDown,
  },
  {
    title: "Listing Sold",
    meta: "Oct 10, 2023 • SAH-WIND-II",
    amount: "+$4,250.00",
    tone: "positive",
    icon: FiTag,
  },
  {
    title: "Capital Infusion",
    meta: "Oct 05, 2023 • BANK-WIRE",
    amount: "+$50,000.00",
    tone: "tertiary",
    icon: FiCreditCard,
  },
];

function getStatusLabel(status) {
  if (status === "active") return "Active";
  if (status === "under-review") return "Under Review";
  return "Rejected";
}

export default function MarketplacePortfolioPage() {
  const location = useLocation();
  const rootPath = location.pathname.startsWith("/marketplace1")
    ? "/marketplace1"
    : "/marketplace";

  return (
    <div className="mkt-root mkt-portfolio-page">
      <div className="mkt-portfolio-nav-host">
        <MarketplaceNavbar rootPath={rootPath} activeItem="portfolio" />
      </div>

      <main className="mkt-portfolio-main">
        <header className="mkt-portfolio-header">
          <div>
            <div className="mkt-portfolio-subtitle-row">
              <span className="mkt-portfolio-subtitle-brand">Carbon Marketplace</span>
              <span className="mkt-portfolio-subtitle-dot" />
              <span className="mkt-portfolio-subtitle-trail">Institutional Dashboard</span>
            </div>
            <h1 className="mkt-portfolio-title">My Portfolio</h1>
            <p className="mkt-portfolio-lead">
              Institutional view of your carbon assets and market positions.
            </p>
          </div>

          <div className="mkt-portfolio-header-actions">
            <Link to="/wallet" className="mkt-portfolio-btn mkt-portfolio-btn-outline">
              <FiCreditCard />
              Connect Wallet
            </Link>
            <Link
              to={`${rootPath}/create-listing/seller-details`}
              className="mkt-portfolio-btn mkt-portfolio-btn-primary"
            >
              <FiPlusCircle />
              Create Listing
            </Link>
          </div>
        </header>

        <section className="mkt-portfolio-stat-grid">
          <article className="mkt-portfolio-stat-card mkt-portfolio-stat-card-primary">
            <div className="mkt-portfolio-stat-head">
              <span className="mkt-portfolio-stat-icon mkt-portfolio-stat-icon-primary">
                <FaLeaf />
              </span>
              <span className="mkt-portfolio-stat-trend">
                <FiTrendingUp /> +2.4%
              </span>
            </div>
            <p className="mkt-portfolio-stat-label">Total Credits Owned</p>
            <h3 className="mkt-portfolio-stat-value">
              12,450 <span>tCO2e</span>
            </h3>
          </article>

          <article className="mkt-portfolio-stat-card mkt-portfolio-stat-card-secondary">
            <div className="mkt-portfolio-stat-head">
              <span className="mkt-portfolio-stat-icon mkt-portfolio-stat-icon-secondary">
                <FiList />
              </span>
            </div>
            <p className="mkt-portfolio-stat-label">Listed Credits</p>
            <h3 className="mkt-portfolio-stat-value">
              3,200 <span>tCO2e</span>
            </h3>
          </article>

          <article className="mkt-portfolio-stat-card mkt-portfolio-stat-card-tertiary">
            <div className="mkt-portfolio-stat-head">
              <span className="mkt-portfolio-stat-icon mkt-portfolio-stat-icon-tertiary">
                <FiCheckCircle />
              </span>
            </div>
            <p className="mkt-portfolio-stat-label">Retired Credits</p>
            <h3 className="mkt-portfolio-stat-value">
              850 <span>tCO2e</span>
            </h3>
          </article>

          <article className="mkt-portfolio-stat-card mkt-portfolio-stat-card-neutral">
            <div className="mkt-portfolio-stat-head">
              <span className="mkt-portfolio-stat-icon mkt-portfolio-stat-icon-neutral">
                <FiDollarSign />
              </span>
            </div>
            <p className="mkt-portfolio-stat-label">Portfolio Value</p>
            <h3 className="mkt-portfolio-stat-value">$348,200</h3>
          </article>
        </section>

        <section className="mkt-portfolio-grid-main">
          <div className="mkt-portfolio-table-stack">
            <article className="mkt-portfolio-panel">
              <header className="mkt-portfolio-panel-head">
                <h3>Active Listings</h3>
                <button type="button" className="mkt-portfolio-icon-btn" aria-label="More options">
                  <FiMoreHorizontal />
                </button>
              </header>

              <div className="mkt-portfolio-table-scroll">
                <table className="mkt-portfolio-table">
                  <thead>
                    <tr>
                      <th>Project Name</th>
                      <th className="mkt-portfolio-text-center">Status</th>
                      <th className="mkt-portfolio-text-right">Quantity</th>
                      <th className="mkt-portfolio-text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {LISTING_ROWS.map((row) => (
                      <tr key={row.name}>
                        <td>
                          <div className="mkt-portfolio-project-cell">
                            <img src={row.image} alt={row.name} />
                            <span>{row.name}</span>
                          </div>
                        </td>
                        <td className="mkt-portfolio-text-center">
                          <span className={`mkt-portfolio-status mkt-portfolio-status-${row.status}`}>
                            {getStatusLabel(row.status)}
                          </span>
                        </td>
                        <td className="mkt-portfolio-text-right">
                          <strong>{row.quantity}</strong>
                          <small>tCO2e</small>
                        </td>
                        <td className="mkt-portfolio-text-right mkt-portfolio-price-cell">{row.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            <article className="mkt-portfolio-panel">
              <header className="mkt-portfolio-panel-head">
                <h3>Retirement History</h3>
                <button type="button" className="mkt-portfolio-link-btn">
                  Download Annual Report
                </button>
              </header>

              <div className="mkt-portfolio-table-scroll">
                <table className="mkt-portfolio-table">
                  <thead>
                    <tr>
                      <th>Project Asset</th>
                      <th>Date</th>
                      <th className="mkt-portfolio-text-right">Certificate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RETIREMENT_ROWS.map((row) => (
                      <tr key={row.name}>
                        <td>
                          <div className="mkt-portfolio-retire-cell">
                            <span className="mkt-portfolio-retire-icon">
                              <FaLeaf />
                            </span>
                            <span>{row.name}</span>
                          </div>
                        </td>
                        <td>{row.date}</td>
                        <td className="mkt-portfolio-text-right">
                          <button type="button" className="mkt-portfolio-certificate-btn">
                            <FiDownload />
                            View PDF
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          </div>

          <aside className="mkt-portfolio-side-stack">
            <article className="mkt-portfolio-offset-card">
              <p className="mkt-portfolio-kicker">Total Carbon Offset</p>
              <div className="mkt-portfolio-offset-number-row">
                <h2>15.2k</h2>
                <span>Metric Tons</span>
              </div>

              <div className="mkt-portfolio-equivalent">
                <span className="mkt-portfolio-equivalent-icon">
                  <FiUsers />
                </span>
                <div>
                  <p>Equivalent to</p>
                  <strong>250,000 trees planted</strong>
                </div>
              </div>
            </article>

            <article className="mkt-portfolio-geo-card">
              <h3>Geographic Spread</h3>
              <p>Asset distribution across 5 continents.</p>

              <div className="mkt-portfolio-geo-bars">
                {GEO_SPREAD.map((row) => (
                  <div className="mkt-portfolio-geo-row" key={row.label}>
                    <span>{row.label}</span>
                    <div className="mkt-portfolio-geo-track">
                      <span className={`mkt-portfolio-geo-fill ${row.barClass}`} />
                    </div>
                    <strong>{row.percent}%</strong>
                  </div>
                ))}
              </div>

              <div className="mkt-portfolio-geo-map">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFsSFQqoAUMD7yKyG44StruzIX0wOoF8J2HQPmQDDUEE2oq4OqDyy9_a8fP-XzU5eHSzcnfpp7wkB_I2lqg89Fu0LGTcTs8B6y_ZmC1K_77ADoNHjBKScvW5X0Ti3nOkmPKi9XRyRFRwqfl3lQibjfDCHe3WbSF1oBe_qErz134TElVp3R6XcZKI4n49nYXtsIiiSUZuM9_MDB50yDtPv7uVHzprTaNKSUdpB59QG_Pzo3anb4HMvqUbJlnxOpn21s5UIf9gGUYmwW"
                  alt="Global spread map"
                />
              </div>
            </article>
          </aside>
        </section>

        <section className="mkt-portfolio-lower-grid">
          <article className="mkt-portfolio-wallet-card">
            <h4>Wallet Intelligence</h4>
            <div className="mkt-portfolio-wallet-panel">
              <div className="mkt-portfolio-wallet-head">
                <div>
                  <p>Institutional Entity</p>
                  <h5>Carbon Positive Ltd.</h5>
                </div>
                <span className="mkt-portfolio-wallet-badge">
                  <FiCreditCard />
                </span>
              </div>

              <div className="mkt-portfolio-wallet-address">0x71C24...4f89</div>

              <div className="mkt-portfolio-wallet-balance">
                <span>$142,500</span>
                <small>.50 USD</small>
              </div>
            </div>
          </article>

          <article className="mkt-portfolio-activity-card">
            <header className="mkt-portfolio-activity-head">
              <h4>Recent Activity</h4>
              <button type="button" className="mkt-portfolio-link-btn">
                View Ledger
              </button>
            </header>

            <div className="mkt-portfolio-activity-list">
              {RECENT_ACTIVITY.map((row) => {
                const Icon = row.icon;
                return (
                  <div className="mkt-portfolio-activity-row" key={`${row.title}-${row.meta}`}>
                    <div className="mkt-portfolio-activity-left">
                      <span className={`mkt-portfolio-activity-icon mkt-portfolio-activity-icon-${row.tone}`}>
                        <Icon />
                      </span>
                      <div>
                        <p>{row.title}</p>
                        <small>{row.meta}</small>
                      </div>
                    </div>
                    <strong className={`mkt-portfolio-activity-amount mkt-portfolio-activity-amount-${row.tone}`}>
                      {row.amount}
                    </strong>
                  </div>
                );
              })}
            </div>
          </article>
        </section>

        <footer className="mkt-portfolio-footer">
          <p>© 2024 Carbon Marketplace Institutional. All rights reserved.</p>
          <div className="mkt-portfolio-footer-links">
            <Link to="/security">Security</Link>
            <Link to="/faq">Terminal Help</Link>
            <Link to="/privacypolicy">Privacy</Link>
          </div>
        </footer>
      </main>
    </div>
  );
}

