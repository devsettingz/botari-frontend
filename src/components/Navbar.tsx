import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('jwt');
  const businessName = localStorage.getItem('business_name'); // store this at login/register

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('business_id');
    localStorage.removeItem('business_name');
    navigate('/login');
  };

  const linkStyle = {
    color: '#fff',
    marginRight: '1rem',
    textDecoration: 'none',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px'
  };

  const activeStyle = {
    backgroundColor: '#0056b3'
  };

  return (
    <nav style={{
      padding: '1rem 2rem',
      background: '#007bff',
      color: '#fff',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <h3 style={{ margin: 0 }}>Botari</h3>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <NavLink
          to="/"
          style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
        >
          Home
        </NavLink>

        {token ? (
          <>
            <NavLink
              to="/dashboard"
              style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
            >
              Dashboard
            </NavLink>
            {businessName && (
              <span style={{ marginRight: '1rem', fontWeight: 'bold' }}>
                Welcome, {businessName}
              </span>
            )}
            <button
              onClick={handleLogout}
              style={{
                background: '#fff',
                color: '#007bff',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink
              to="/register"
              style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
            >
              Register
            </NavLink>
            <NavLink
              to="/login"
              style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
            >
              Login
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
