// frontend/User/src/common/Footer.jsx

import React from "react";
import { BsInstagram } from "react-icons/bs";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
} from "react-icons/hi";
import "../../styles/user/Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        {/* About Section */}
        <div className="footer_section footer_about">
          <h2 className="footer__logo">
            <span className="footer__logo-icon">🌿</span> Carbon Credit
          </h2>
          <p className="footer__text">
            Empowering individuals and organizations to track, reduce, and earn
            rewards for their environmental impact through sustainable
            practices.
          </p>
          <div className="footer__socials">
            <a
              href="https://facebook.com/yourpage"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__social-icon"
            >
              <FaFacebookF />
            </a>

            <a
              href="https://x.com/yourhandle"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__social-icon"
            >
              <FaTwitter />
            </a>

            <a
              href="https://linkedin.com/in/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__social-icon"
            >
              <FaLinkedinIn />
            </a>

            <a
              href="https://www.instagram.com/gocarbonpositive?igsh=MW0waXk1OGFwN2N6cg=="
              target="_blank"
              rel="noopener noreferrer"
              className="footer__social-icon"
            >
              <BsInstagram />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer_section footer_links">
          <h3 className="footer__heading">Quick Links</h3>
          <ul className="footer__list">
            <li className="footer__item">
              <Link to="/about">About</Link>
            </li>
            <li className="footer__item">
              <Link to="/user/dashboard">Services</Link>
            </li>
            <li className="footer__item">
              <Link to="/blog">Blog</Link>
            </li>
            <li className="footer__item">
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer_section footer_contact">
          <h3 className="footer__heading">Contact</h3>
          <ul className="footer__list">
            <li className="footer__item">
              <HiOutlineMail /> support@carboncredit.com
            </li>
            <li className="footer__item">
              <HiOutlinePhone /> +91 8018246346
            </li>
            <li className="footer__item">
              <HiOutlineLocationMarker /> STPI, Bhubaneswar, India
            </li>
          </ul>
        </div>
      </div>

      {/* Newsletter */}
      <div className="footer__newsletter">
        <h3 className="footer__heading">Stay Updated</h3>
        <p className="footer__text">
          Get the latest updates on sustainability and carbon credits
        </p>
        <div className="footer__newsletter-form">
          <input type="email" placeholder="Enter your email" />
          <button className="footer__newsletter-btn">Subscribe</button>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer__bottom">
        © 2025 GoCarbon Positive | All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
