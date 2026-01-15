import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from "react-icons/hi";
import "../styles/Footer.css"; // Import the CSS file

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
            Empowering individuals and organizations to track, reduce, and earn rewards for their environmental impact through sustainable practices.
          </p>
          <div className="footer__socials">
            <a href="#" className="footer__social-icon"><FaFacebookF /></a>
            <a href="#" className="footer__social-icon"><FaTwitter /></a>
            <a href="#" className="footer__social-icon"><FaLinkedinIn /></a>
            <a href="#" className="footer__social-icon"><FaInstagram /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer_section footer_links">
          <h3 className="footer__heading">Quick Links</h3>
          <ul className="footer__list">
            <li className="footer__item"><a href="#">About</a></li>
            <li className="footer__item"><a href="#">Services</a></li>
            <li className="footer__item"><a href="#">Blog</a></li>
            <li className="footer__item"><a href="#">Contact</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer_section footer_contact">
          <h3 className="footer__heading">Contact</h3>
          <ul className="footer__list">
            <li className="footer__item"><HiOutlineMail /> support@carboncredit.com</li>
            <li className="footer__item"><HiOutlinePhone /> +91 8018246346</li>
            <li className="footer__item"><HiOutlineLocationMarker /> STPI, Bhubaneswar, India</li>
          </ul>
        </div>
      </div>

      {/* Newsletter */}
      <div className="footer__newsletter">
        <h3 className="footer__heading">Stay Updated</h3>
        <p className="footer__text">Get the latest updates on sustainability and carbon credits</p>
        <div className="footer__newsletter-form">
          <input type="email" placeholder="Enter your email" />
          <button className="footer__newsletter-btn">Subscribe</button>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer__bottom">
        © 2025 CarbonCredit Dashboard. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;