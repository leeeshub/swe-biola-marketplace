import React from 'react';
import { Link } from 'react-router-dom';
import './common.css';

const Header = () => {
  return (
    <header className="p-4">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <Link to="/" className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
            <img src="/images/biola-logo.png" alt="Logo" width="200" className="me-4" />
          </Link>

          <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
            <li><Link to="/profile" className="nav-link px-2 me-4 tab">Profile</Link></li>
            <li><Link to="/add-post" className="nav-link px-2 tab">Add Post</Link></li>
          </ul>

          <div className="text-end">
            <Link to="/login" className="btn me-2 login-btn">Login</Link>
            <Link to="/signup" className="btn signup-btn">Sign up</Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;