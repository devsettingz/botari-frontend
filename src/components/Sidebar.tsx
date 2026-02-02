import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const [lightMode, setLightMode] = useState(false);
  const location = useLocation(); // Hook to highlight active page

  const toggleTheme = () => {
    document.body.classList.toggle('light-mode');
    setLightMode(!lightMode);
  };

  // Navigation items - CRITICAL for Thursday launch
  const navItems = [
    { path: '/dashboard', label: '📊 Dashboard' },
    { path: '/team', label: '👥 Hire Team', badge: 'NEW' }, // MONEY PAGE
    { path: '/conversations', label: '💬 Conversations' }, // Chat history
    { path: '/calls', label: '📞 Voice Calls' },
    { path: '/analytics', label: '⚡ Analytics' },
    { path: '/settings', label: '⚙️ Settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-header" style={{ 
        color: '#E2725B', 
        fontWeight: 'bold', 
        fontSize: '24px',
        marginBottom: '30px'
      }}>
        Botari
        <div style={{ fontSize: '12px', color: '#666', fontWeight: 'normal' }}>
          AI Workforce
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="sidebar-nav" style={{ flex: 1 }}>
        {navItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path} 
            className="sidebar-link"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: isActive(item.path) ? 'rgba(226, 114, 91, 0.1)' : 'transparent',
              borderLeft: isActive(item.path) ? '3px solid #E2725B' : '3px solid transparent',
              padding: '12px 16px',
              marginBottom: '4px',
              borderRadius: '0 8px 8px 0',
              color: isActive(item.path) ? '#fff' : '#aaa',
              fontWeight: isActive(item.path) ? 'bold' : 'normal',
              textDecoration: 'none',
              transition: 'all 0.2s'
            }}
          >
            <span>{item.label}</span>
            {item.badge && (
              <span style={{
                backgroundColor: '#E2725B',
                color: '#000',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '10px',
                fontWeight: 'bold'
              }}>
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Trial Status Box - ADD THIS */}
      <div style={{
        backgroundColor: '#1a1a1a',
        border: '1px solid #333',
        borderRadius: '8px',
        padding: '16px',
        margin: '20px 0',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
          Trial Status
        </div>
        <div style={{ 
          height: '4px', 
          backgroundColor: '#333', 
          borderRadius: '2px',
          marginBottom: '8px'
        }}>
          <div style={{ 
            width: '85%', 
            height: '100%', 
            backgroundColor: '#E2725B',
            borderRadius: '2px'
          }} />
        </div>
        <div style={{ fontSize: '11px', color: '#E2725B' }}>
          7 days left - Hire Amina now
        </div>
      </div>

      {/* Footer */}
      <div className="sidebar-footer" style={{ marginTop: 'auto' }}>
        <button 
          className="sidebar-link" 
          onClick={toggleTheme} 
          style={{ 
            width: '100%',
            backgroundColor: 'transparent',
            border: '1px solid #333',
            padding: '10px',
            borderRadius: '6px',
            color: '#888',
            cursor: 'pointer',
            marginBottom: '16px'
          }}
        >
          {lightMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
        <div style={{ fontSize: '12px', color: '#666' }}>
          © {new Date().getFullYear()} Botari
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;