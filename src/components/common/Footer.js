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
        </div>
      </footer>
    </div>
  );
}