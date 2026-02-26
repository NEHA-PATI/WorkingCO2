import React, { useState } from 'react';
import "@features/user/styles/contact.css";
import { fireToast } from "@shared/utils/toastService.js";
import { contactApiClient, ticketApiClient } from "@shared/utils/apiClient.js";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [showQueryModal, setShowQueryModal] = useState(false);
  const [queryData, setQueryData] = useState({
    subject: "",
    issue: "",
    category: "",
    priority: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQueryChange = (e) => {
    setQueryData({ ...queryData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message,
    };
    try {
      const res = await contactApiClient.post("/api/contact", payload);
      const data = res.data;
      fireToast("CONTACT.MESSAGE_SENT", "success", { id: data.contact_id });
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });    } catch (error) {
      console.error("CONTACT ERROR:", error);
      fireToast("API.NETWORK", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAuthUser = () => {
    try {
      const raw = localStorage.getItem("authUser");
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (err) {
      console.error("Invalid authUser in localStorage:", err);
      return null;
    }
  };

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const storedUser = getAuthUser();
      const u_id = storedUser?.u_id ?? null;
      if (!u_id) {
        fireToast("CONTACT.LOGIN_REQUIRED", "warning");
        setIsSubmitting(false);
        return;
      }
      const payload = {
        subject: queryData.subject,
        message: queryData.issue,
        category: queryData.category,
        priority: queryData.priority,
      };
      const res = await ticketApiClient.post("/api/tickets", payload, {
        headers: { "x-user-id": u_id },
      });
      const data = res.data;
      fireToast("TICKET.SUBMITTED", "success", { id: data.ticket_id });
      setShowQueryModal(false);
      setQueryData({ subject: "", issue: "", category: "", priority: "" });
    } catch (error) {
      console.error("RAISE QUERY ERROR:", error);
      fireToast("API.NETWORK", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cp-root">

      {/* ── LEFT PANEL ── */}
      <aside className="cp-left">
        <div className="cp-left-inner">
          <div className="cp-left-top">
            <h1 className="cp-headline">We're here</h1>
            <p className="cp-subtext">Our door is always open for a good cup of coffee.</p>
          </div>

          <div className="cp-office-block">
            <h3 className="cp-office-title">Our Office</h3>
            <p className="cp-office-addr">
              Emerging Tech Building<br />
              Bhubaneshwar, Odisha 751023<br />
              India
            </p>
            <div className="cp-contact-details">
              <a href="mailto:support@gocarbonpositive.com" className="cp-detail-link">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                support@gocarbonpositive.com
              </a>
              <a href="tel:+918018246346" className="cp-detail-link">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 016 1.18 2 2 0 018 3.22v3a2 2 0 001.45 1.94 12 12 0 002.91.44 2 2 0 011.72 2v2.39a2 2 0 01-.47 1.31 10 10 0 01-1.23 1.12 16 16 0 006.29 6.29c.37-.42.75-.84 1.12-1.23a2 2 0 011.31-.47h2.39a2 2 0 012 1.72 12 12 0 00.44 2.91A2 2 0 0122 16.92z" />
                </svg>
                +91 8018246346
              </a>
              <a href="https://www.gocarbonpositive.com" target="_blank" rel="noopener noreferrer" className="cp-detail-link">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                </svg>
                www.gocarbonpositive.com
              </a>
            </div>
          </div>

          <div className="cp-map-wrap">
            <iframe
              title="Our Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3741.7767760199026!2d85.81654867394697!3d20.309504781165828!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a19091c6159d5c7%3A0x8ea36dfd61cf5143!2sEmerging%20Tech%20%2C%20Bhubaneswar!5e0!3m2!1sen!2sin!4v1756137239455!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
            />
          </div>

          <p className="cp-operator-note">
            <a href="https://www.gocarbonpositive.com" target="_blank" rel="noopener noreferrer">www.gocarbonpositive.com</a> is operated by <strong>Debadarsan Consulting Private Limited.</strong>
          </p>
        </div>
      </aside>

      {/* ── RIGHT PANEL ── */}
      <main className="cp-right">
        <div className="cp-step cp-step--active">
          <h2 className="cp-right-headline">Let's talk.</h2>
          <p className="cp-right-sub">
            Share your excitement with us.{" "}
            <a href="mailto:support@gocarbonpositive.com" className="cp-email-link">
              support@gocarbonpositive.com ?
            </a>
          </p>

          <form onSubmit={handleSubmit} className="cp-form">
            <div className="cp-form-row">
              <div className="cp-form-group">
                <label className="cp-form-label">Full Name</label>
                <input
                  className="cp-form-input"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="cp-form-group">
                <label className="cp-form-label">Email Address</label>
                <input
                  className="cp-form-input"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="cp-form-row">
              <div className="cp-form-group">
                <label className="cp-form-label">Phone Number</label>
                <input
                  className="cp-form-input"
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="cp-form-group">
                <label className="cp-form-label">Subject</label>
                <input
                  className="cp-form-input"
                  type="text"
                  name="subject"
                  placeholder="Enter subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="cp-form-group cp-form-group--full">
              <label className="cp-form-label">Message</label>
              <textarea
                className="cp-form-input cp-textarea"
                name="message"
                placeholder="Type your message here..."
                required
                rows={4}
                value={formData.message}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="cp-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>

          <button className="cp-query-link" onClick={() => setShowQueryModal(true)}>
            Need help? Raise a support ticket ->
          </button>
        </div>
      </main>

      {/* ── SUPPORT MODAL ── */}
      {showQueryModal && (
        <div className="cp-modal-overlay">
          <div className="cp-modal">
            <header className="cp-modal-header">
              <h3>Raise a Query</h3>
              <button className="cp-modal-close" onClick={() => setShowQueryModal(false)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </header>

            <form className="cp-modal-form" onSubmit={handleQuerySubmit}>
              <div className="cp-form-group">
                <label className="cp-form-label">Subject</label>
                <input
                  className="cp-form-input"
                  type="text"
                  name="subject"
                  placeholder="Enter query subject"
                  required
                  value={queryData.subject}
                  onChange={handleQueryChange}
                />
              </div>

              <div className="cp-form-group">
                <label className="cp-form-label">Describe your issue</label>
                <textarea
                  className="cp-form-input cp-textarea"
                  name="issue"
                  placeholder="Describe your issue in detail"
                  required
                  rows={3}
                  value={queryData.issue}
                  onChange={handleQueryChange}
                />
              </div>

              <div className="cp-select-row">
                <div className="cp-select-group">
                  <label className="cp-form-label">Category</label>
                  <select
                    name="category"
                    required
                    value={queryData.category}
                    onChange={handleQueryChange}
                    className="cp-select"
                  >
                    <option value="">Select Category</option>
                    <option value="technical">Technical Issue</option>
                    <option value="non-technical">Non-Technical Issue</option>
                    <option value="billing">Billing &amp; Payments</option>
                    <option value="carbon">Carbon Credit Related</option>
                    <option value="dashboard">Dashboard / Analytics</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="cp-select-group">
                  <label className="cp-form-label">Priority</label>
                  <select
                    name="priority"
                    required
                    value={queryData.priority}
                    onChange={handleQueryChange}
                    className="cp-select"
                  >
                    <option value="">Select Priority</option>
                    <option value="high">High</option>
                    <option value="moderate">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="cp-submit-btn" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Query"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}









