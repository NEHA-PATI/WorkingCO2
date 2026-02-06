import React, { useState } from "react";
import "../styles/user/contact.css";

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
    }
  };

  const handleQueryChange = (e) => {
    setQueryData({ ...queryData, [e.target.name]: e.target.value });
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
  }
};



  return (
    <main>
      <div className="contact">
        <div className="contact-big-container">
          <div className="contactHeader">
            <h1 className="contactTitle">Contact Us</h1>
            <p className="contactSubtitle">
              Get in touch with our team for support, partnerships, or general inquiries
            </p>
          </div>

          <div className="contactGrid">
            {/* LEFT */}
            <div className="contactInfo">
              <h3 className="infoTitle">Get in Touch</h3>
              <p className="infoDescription">
                We're here to help you with your carbon offset journey.
              </p>

              <div className="contactMap">
                <iframe
                  title="Our Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3741.7767760199026!2d85.81654867394697!3d20.309504781165828!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a19091c6159d5c7%3A0x8ea36dfd61cf5143!2sEmerging%20Tech%20%2C%20Bhubaneswar!5e0!3m2!1sen!2sin!4v1756137239455!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                ></iframe>
              </div>

              <div className="contactDetails">
                <p><strong>www.gocarbonpositive.com</strong> is operated by Debadarsan Consulting Private Limited.</p>
                <p><strong>Address:</strong> Bhubaneshwar, Odisha, 751023</p>
                <p><strong>Phone:</strong> +91 8018246346</p>
                <p><strong>Email:</strong> Debadarsan.Mohanty@gocarbonpositive.com</p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="contactForm">
              <h3 className="formTitle">Feedback</h3>

              <form className="form" onSubmit={handleSubmit}>
                <div className="formGroup">
                  <input
                    type="text"
                    name="name"
                    className="formInput"
                    placeholder=" "
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <label className="formLabel">Full Name</label>
                </div>

                <div className="formGroup">
                  <input
                    type="email"
                    name="email"
                    className="formInput"
                    placeholder=" "
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <label className="formLabel">Email Address</label>
                </div>

                <div className="formGroup">
                  <input
                    type="tel"
                    name="phone"
                    className="formInput"
                    placeholder=" "
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                  <label className="formLabel">Phone Number</label>
                </div>

                <div className="formGroup">
                  <input
                    type="text"
                    name="subject"
                    className="formInput"
                    placeholder=" "
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                  <label className="formLabel">Subject</label>
                </div>

                <div className="formGroup">
                  <textarea
                    name="message"
                    className="formTextarea"
                    placeholder=" "
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                  <label className="formLabel">Type Feedback Message</label>
                </div>

                <button type="submit" className="submitButton">
                  Send Message
                </button>
              </form>

              {/* NEED HELP */}
              <div className="raiseQueryBox">
                <h4 className="raiseQueryTitle">Need Help?</h4>
                <p className="raiseQueryText">
                  Facing an issue or need assistance? Raise a query and we’ll handle it.
                </p>
                <button
                  className="needHelpButton"
                  onClick={() => setShowQueryModal(true)}
                >
                  Raise a Query
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QUERY MODAL */}
      {showQueryModal && (
        <div className="queryModalOverlay">
          <div className="queryModal">
            <button className="closeModal" onClick={() => setShowQueryModal(false)}>
              ✕
            </button>

            <h3 className="modalTitle">Raise a Query</h3>

            <form className="modalForm" onSubmit={handleQuerySubmit}>
              <div className="formGroup">
                <input
                  type="text"
                  className="formInput"
                  name="subject"
                  value={queryData.subject}
                  onChange={handleQueryChange}
                  placeholder=" "
                  required
                />
                <label className="formLabel">Subject</label>
              </div>

              <div className="formGroup">
                <textarea
                  className="formTextarea"
                  rows={4}
                  name="issue"
                  value={queryData.issue}
                  onChange={handleQueryChange}
                  placeholder=" "
                  required
                ></textarea>
                <label className="formLabel">Type your issue here</label>
              </div>

              <div className="formGroup">
                <select
                  className="formSelect"
                  name="category"
                  value={queryData.category}
                  onChange={handleQueryChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="technical">Technical Issue</option>
                  <option value="non-technical">Non-Technical Issue</option>
                  <option value="billing">Billing & Payments</option>
                  <option value="carbon">Carbon Credit Related</option>
                  <option value="dashboard">Dashboard / Analytics</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="formGroup">
                <select
                  className="formSelect"
                  name="priority"
                  value={queryData.priority}
                  onChange={handleQueryChange}
                  required
                >
                  <option value="">Select Priority</option>
                  <option value="high">High</option>
                  <option value="moderate">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <button type="submit" className="submitButton">
                Submit Query
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
