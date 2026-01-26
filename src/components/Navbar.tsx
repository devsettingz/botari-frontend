import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('jwt');
  const businessName = localStorage.getItem('business_name');

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('business_id');
    localStorage.removeItem('business_name');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <h3 className="navbar-brand">Botari</h3>
      <div className="navbar-links">
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
      </div>
    </nav>
  );
};

export default Navbar;
