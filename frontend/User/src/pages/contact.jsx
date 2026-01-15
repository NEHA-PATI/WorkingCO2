import React, { useState } from "react";
import "../styles/user/contact.css";
import { useNavigate } from "react-router-dom";
// import Navbar from './Navbar';

export default function Contact() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get user ID from localStorage
    const storedUser = JSON.parse(localStorage.getItem("authUser"));
    const u_id = storedUser?.u_id;

    if (!u_id) {
      alert("User not logged in!");
      return;
    }

    const payload = { u_id, firstName, lastName, email, company, message };

    try {
      const res = await fetch(
        "https://contact-service-sls2.onrender.com/api/contact",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (data.success) {
        alert(`Your ticket has been created! Ticket ID: ${data.ticket_id}`);
      } else {
        alert("Failed to create ticket");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  };

  return (
    <main>
      {/* <Navbar /> */}
      <div className="contact">
        <div className="contact-big-container">
          <div className="contactHeader">
            <h1 className="contactTitle">Contact Us</h1>
            <p className="contactSubtitle">
              Get in touch with our team for support, partnerships, or general
              inquiries
            </p>
          </div>
          <div className="contactGrid">
            <div className="contactInfo">
              <h3 className="infoTitle">Get in Touch</h3>
              <p className="infoDescription">
                We're here to help you with your carbon offset journey. Reach
                out to us through any of the following channels.
              </p>

              <div className="contactMap">
                <iframe
                  title="Our Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3741.7767760199026!2d85.81654867394697!3d20.309504781165828!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a19091c6159d5c7%3A0x8ea36dfd61cf5143!2sEmerging%20Tech%20%2C%20Bhubaneswar(EmTek%20-%20STPI%20Industry%204.0%20CoE)!5e0!3m2!1sen!2sin!4v1756137239455!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

              <div className="contactDetails">
                <p>
                  <strong>www.gocarbonpositive.com</strong> is operated by
                  Debadarsan Consulting Private Limited.
                </p>
                <p>
                  <strong>Address:</strong> EmTek STPI, Fortune Towers, Maitri
                  Vihar Road, Bhubaneshwar, Odisha 751023.
                </p>
                <p>
                  <strong>Phone:</strong> +91 8018246346
                </p>

              </div>
            </div>
            <div className="contactForm">
              <h3 className="formTitle">Send us a Message</h3>
              <form className="form" onSubmit={handleSubmit}>
                <div className="formRow">
                  <div className="formGroup">
                    <input
                      type="text"
                      className="formInput"
                      placeholder=" "
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                    <label className="formLabel">First Name</label>
                  </div>
                  <div className="formGroup">
                    <input
                      type="text"
                      className="formInput"
                      placeholder=" "
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                    <label className="formLabel">Last Name</label>
                  </div>
                </div>
                <div className="formGroup">
                  <input
                    type="email"
                    className="formInput"
                    placeholder=" "
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <label className="formLabel">Email Address</label>
                </div>
                <div className="formGroup">
                  <input
                    type="text"
                    className="formInput"
                    placeholder=" "
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                  <label className="formLabel">Company (Optional)</label>
                </div>
                <div className="formGroup">
                  <textarea
                    className="formTextarea"
                    placeholder=" "
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  ></textarea>
                  <label className="formLabel">Message</label>
                </div>
                <button type="submit" className="submitButton">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
