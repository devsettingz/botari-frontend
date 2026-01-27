import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('jwt');
  const businessName = localStorage.getItem('business_name');
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightMode, setLightMode] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('business_id');
    localStorage.removeItem('business_name');
    navigate('/login');
  };

  const toggleTheme = () => {
    document.body.classList.toggle('light-mode');
    setLightMode(!lightMode);
  };

  return (
    <nav className="navbar">
      <h3 className="navbar-brand">Botari</h3>

      {/* Hamburger toggle */}
      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation"
      >
        ☰
      </button>

      <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Home
        </NavLink>

        {token ? (
          <>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Dashboard
            </NavLink>
            {businessName && (
              <span className="navbar-welcome">Welcome, {businessName}</span>
            )}
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/register" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Register
            </NavLink>
            <NavLink to="/login" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Login
            </NavLink>
          </>
        )}

        {/* Theme toggle button */}
        <button onClick={toggleTheme} className="logout-button" style={{ marginLeft: '1rem' }}>
          {lightMode ? '🌙 Dark Mode' : '🌞 Light Mode'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
