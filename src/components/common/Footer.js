import React from 'react';
import './common.css';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa";
import { Link } from 'react-router-dom';

const SocialIcon = ({ link, Icon }) => (
  <Link
    to={link}
    target="_blank"
    rel="noopener noreferrer"
    className="social-icon"
  >
    <Icon />
  </Link>
);

export default function Footer() {
  return (
    <div id='footer'>
      <footer className="footer-container">
        <div className="footer-content">

          <div className="social-icons">
            <h4>CONNECT WITH US</h4>
            <div className='icons'>
            <SocialIcon link="https://facebook.com/biola" Icon={FaFacebook} />
            <SocialIcon link="https://twitter.com/biolau" Icon={FaTwitter} />
            <SocialIcon link="https://instagram.com/biolauniversity" Icon={FaInstagram} />
            <SocialIcon link="https://youtube.com/BiolaUniversity" Icon={FaYoutube} />
            <SocialIcon link="https://www.linkedin.com/school/biola-university/" Icon={FaLinkedin} />
            </div>
          </div>

          <hr></hr>

          <div className="footer-links">
            <p>
              <Link to="https://www.biola.edu/" className="footer-menu-link">About Us</Link>
              <span className="footer-divider">|</span>
              <Link to="https://www.biola.edu/" className="footer-menu-link">Our Partners</Link>
              <span className="footer-divider">|</span>
              <Link to="https://www.biola.edu/" className="footer-menu-link">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}