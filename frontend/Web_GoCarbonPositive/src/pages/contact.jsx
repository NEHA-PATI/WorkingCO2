
import React, { useState } from 'react';
import '../styles/user/contact.css';

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
      const res = await fetch("http://localhost:5005/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`Message sent successfully! Contact ID: ${data.contact_id}`);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        alert(data.message || "Failed to send message");
      }
    } catch (error) {
      console.error("CONTACT ERROR:", error);
      alert("Something went wrong!");
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
        alert("Please login to raise a query");
        return;
      }

      const payload = {
        subject: queryData.subject,
        message: queryData.issue,
        category: queryData.category,
        priority: queryData.priority,
      };

      const res = await fetch("http://localhost:5004/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": u_id,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`Query submitted! Ticket ID: ${data.ticket_id}`);
        setShowQueryModal(false);
        setQueryData({
          subject: "",
          issue: "",
          category: "",
          priority: "",
        });
      } else {
        alert(data.message || "Failed to submit query");
      }
    } catch (error) {
      console.error("RAISE QUERY ERROR:", error);
      alert("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div className="contact-page">
      <div className="bg-glow">
        <div className="glow-1"></div>
        <div className="glow-2"></div>
      </div>

      <main className="container">
        <header className="contact-header">
          <h1>GET IN <span>TOUCH</span></h1>
          <p>Have a question about carbon credits or want to partner with us? Our team is ready to assist.</p>
        </header>

        <div className="contact-grid">
          {/* LEFT: Info & Details */}
          <aside className="info-sidebar">
            <div className="info-card">
              <div className="icon-box">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <div>
                <h4>Email Support</h4>
                <a href="mailto:Debadarsan.Mohanty@gocarbonpositive.com" className="contact-link">
                  Debadarsan.Mohanty@gocarbonpositive.com
                </a>
              </div>
            </div>

            <div className="info-card">
              <div className="icon-box">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
              </div>
              <div>
                <h4>Direct Line</h4>
                <a href="tel:+918018246346" className="contact-link">+91 8018246346</a>
              </div>
            </div>

            <div className="info-card">
              <div className="icon-box">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <div>
                <h4>Headquarters</h4>
                <p className="contact-text">Bhubaneshwar, Odisha, 751023</p>
              </div>
            </div>

            <div className="operator-card">
              <p>
                <a href="https://www.gocarbonpositive.com" target="_blank" rel="noopener noreferrer">www.gocarbonpositive.com</a> is operated by <strong>Debadarsan Consulting Private Limited.</strong>
              </p>
            </div>

            <div className="map-wrapper">
              <iframe
                title="Our Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3741.7767760199026!2d85.81654867394697!3d20.309504781165828!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a19091c6159d5c7%3A0x8ea36dfd61cf5143!2sEmerging%20Tech%20%2C%20Bhubaneswar!5e0!3m2!1sen!2sin!4v1756137239455!5m2!1sen!2sin"
                width="100%" height="100%" style={{ border: 0 }} loading="lazy"
              ></iframe>
            </div>
          </aside>

          {/* RIGHT: Form */}
          <section className="contact-form-container">
            <h3>SEND FEEDBACK</h3>
            <form onSubmit={handleSubmit} className="main-form">
              <div className="input-row">
                <div className={`form-group ${formData.name ? "has-value" : ""}`}>
                  <label className="form-label">Full Name</label>
                  <input className="form-input" type="text" name="name" placeholder="Enter your full name" required value={formData.name} onChange={handleChange} onInput={handleChange} />
                </div>
                <div className={`form-group ${formData.email ? "has-value" : ""}`}>
                  <label className="form-label">Email Address</label>
                  <input className="form-input" type="email" name="email" placeholder="Enter your email address" required value={formData.email} onChange={handleChange} onInput={handleChange} />
                </div>
              </div>

              <div className="input-row">
                <div className={`form-group ${formData.phone ? "has-value" : ""}`}>
                  <label className="form-label">Phone Number</label>
                  <input className="form-input" type="tel" name="phone" placeholder="Enter your phone number" required value={formData.phone} onChange={handleChange} onInput={handleChange} />
                </div>
                <div className={`form-group ${formData.subject ? "has-value" : ""}`}>
                  <label className="form-label">Subject</label>
                  <input className="form-input" type="text" name="subject" placeholder="Enter subject" required value={formData.subject} onChange={handleChange} onInput={handleChange} />
                </div>
              </div>

              <div className={`form-group ${formData.message ? "has-value" : ""}`}>
                <label className="form-label">Type Feedback Message</label>
                <textarea className="form-input textarea" name="message" placeholder="Type your feedback message" required rows={4} value={formData.message} onChange={handleChange} onInput={handleChange}></textarea>
              </div>

              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>

            <div className="query-teaser">
              <h4>Need Help?</h4>
              <p>Facing an issue or need assistance? Raise a query and we’ll handle it.</p>
              <button className="query-btn" onClick={() => setShowQueryModal(true)}>
                Raise a Query
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* SUPPORT MODAL */}
      {showQueryModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <header className="modal-header">
              <h3>Raise a Query</h3>
              <button className="close-modal" onClick={() => setShowQueryModal(false)}>&times;</button>
            </header>
            <form className="modal-form" onSubmit={handleQuerySubmit}>
              <div className={`form-group ${queryData.subject ? "has-value" : ""}`}>
                <label className="form-label">Subject</label>
                <input className="form-input" type="text" name="subject" placeholder="Enter query subject" required value={queryData.subject} onChange={handleQueryChange} onInput={handleQueryChange} />
              </div>

              <div className={`form-group ${queryData.issue ? "has-value" : ""}`}>
                <label className="form-label">Type your issue here</label>
                <textarea className="form-input textarea" name="issue" placeholder="Describe your issue in detail" required rows={3} value={queryData.issue} onChange={handleQueryChange} onInput={handleQueryChange}></textarea>
              </div>

              <div className="select-row">
                <div className="select-group">
                  <label>Category</label>
                  <select name="category" required value={queryData.category} onChange={handleQueryChange}>
                    <option value="">Select Category</option>
                    <option value="technical">Technical Issue</option>
                    <option value="non-technical">Non-Technical Issue</option>
                    <option value="billing">Billing & Payments</option>
                    <option value="carbon">Carbon Credit Related</option>
                    <option value="dashboard">Dashboard / Analytics</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="select-group">
                  <label>Priority</label>
                  <select name="priority" required value={queryData.priority} onChange={handleQueryChange}>
                    <option value="">Select Priority</option>
                    <option value="high">High</option>
                    <option value="moderate">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Query"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
