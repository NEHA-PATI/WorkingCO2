// frontend/User/src/common/Footer.jsx

import React from "react";
import { BsInstagram } from "react-icons/bs";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaSeedling } from "react-icons/fa";
import "@shared/ui/styles/Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        {/* About Section */}
        <div className="footer_section footer_about">
          <h2 className="footer__logo">
            <span className="footer__logo-icon">🌿</span> Carbon Positive
          </h2>
          <p className="footer__text">
            Empowering individuals and organizations to track, reduce, and earn
            rewards for their environmental impact through sustainable
            practices.
          </p>
        </div>

        {/* Products */}
        <div className="footer_section footer_links">
          <h3 className="footer__heading">Products</h3>
          <ul className="footer__list">
            <li className="footer__item"><Link to="/engage">Engage</Link></li>
            <li className="footer__item"><Link to="/user/dashboard">Dashboard</Link></li>
            <li className="footer__item"><Link to="/settings">Marketplace</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div className="footer_section footer_links">
          <h3 className="footer__heading">Resources</h3>
          <ul className="footer__list">
            <li className="footer__item"><Link to="/blog">Blog</Link></li>
            <li className="footer__item"><Link to="/case-studies">Case Studies</Link></li>
            <li className="footer__item"><Link to="/community">Community</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div className="footer_section footer_links">
          <h3 className="footer__heading">Company</h3>
          <ul className="footer__list">
            <li className="footer__item">
              <Link to="/about">About Us</Link>
            </li>
            <li className="footer__item">
              <Link to="/case-studies">Sustainability Mission</Link>
            </li>
            <li className="footer__item">
              <Link to="/contact">Contact</Link>
            </li>
             <li className="footer__item">
              <Link to="/faq">FAQs</Link>
            </li>
            
          </ul>
        </div>
      </div>

      {/* ===== FOOTER BOTTOM BAR ===== */}
      <div className="footer__bottom-bar">
        <div className="footer__bottom footer__bottom-layout">

          {/* LEFT: Social Icons */}
          <div className="footer__socials footer__socials-left">
            <a href="https://www.facebook.com/gocarbonpositive" target="_blank" rel="noopener noreferrer" className="footer__social-icon social-facebook">
              <FaFacebookF />
            </a>
            <a href="https://x.com/gocarbonpositive" target="_blank" rel="noopener noreferrer" className="footer__social-icon social-x">
              <FaTwitter />
            </a>
            <a href="https://www.linkedin.com/company/gocarbonpositive" target="_blank" rel="noopener noreferrer" className="footer__social-icon social-linkedin">
              <FaLinkedinIn />
            </a>
            <a href="https://www.instagram.com/gocarbonpositive" target="_blank" rel="noopener noreferrer" className="footer__social-icon social-instagram">
              <BsInstagram />
            </a>
          </div>

          {/* CENTER: Copyright */}
          <div className="footer__copyright">
            © 2025 GoCarbon Positive | All rights reserved.
          </div>

          {/* RIGHT: Legal Links */}
          <div className="footer__legal-links">
            <Link to="/privacypolicy">Privacy Policy</Link>
            <Link to="/termsandconditions">Terms & Conditions</Link>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;

