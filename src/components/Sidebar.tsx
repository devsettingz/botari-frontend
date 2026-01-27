import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const [lightMode, setLightMode] = useState(false);

  const toggleTheme = () => {
    document.body.classList.toggle('light-mode');
    setLightMode(!lightMode);
  };

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-header">Botari</div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <Link to="/dashboard" className="sidebar-link">📊 Dashboard</Link>
        <Link to="/analytics" className="sidebar-link">⚡ Analytics</Link>
        <Link to="/settings" className="sidebar-link">⚙️ Settings</Link>
        <Link to="/login" className="sidebar-link">🔑 Login</Link>
        <Link to="/register" className="sidebar-link">📝 Register</Link>
      </nav>

      {/* Footer with theme toggle */}
      <div className="sidebar-footer">
        © {new Date().getFullYear()} Botari
        <br />
        <button className="sidebar-link" onClick={toggleTheme} style={{ marginTop: '0.5rem' }}>
          {lightMode ? '🌙 Dark Mode' : '🌞 Light Mode'}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
