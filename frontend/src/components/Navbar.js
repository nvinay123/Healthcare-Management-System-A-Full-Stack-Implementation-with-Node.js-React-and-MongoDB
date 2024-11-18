import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-title">
          Healthcare Management System
        </Link>
      </div>

      <button className="navbar-toggle" onClick={toggleNavbar}>
        ☰
      </button>

      <div className={`navbar-links ${isOpen ? 'show' : ''}`}>
        <Link
          to="/register"
          className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`}
          onClick={() => setIsOpen(false)}
        >
          Register Patient
        </Link>
        <Link
          to="/schedule"
          className={`nav-link ${location.pathname === '/schedule' ? 'active' : ''}`}
          onClick={() => setIsOpen(false)}
        >
          Schedule Appointment
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
