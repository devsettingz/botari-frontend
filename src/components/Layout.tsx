import React, { useState, useEffect } from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize from localStorage if available
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });

  // Apply/remove dark mode class on root and persist choice
  useEffect(() => {
    const root = document.getElementById('root');
    if (!root) return;
    if (darkMode) {
      root.classList.add('dark-mode');
    } else {
      root.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const layoutStyle = {
    display: 'flex',
    minHeight: '100vh',
    transition: 'background 0.3s, color 0.3s'
  };

  const sidebarStyle = {
    width: '220px',
    background: darkMode ? '#1f1f1f' : '#343a40',
    color: '#fff',
    padding: '1rem'
  };

  const mainStyle = {
    flex: 1,
    padding: '2rem'
  };

  return (
    <div style={layoutStyle}>
      {/* Sidebar */}
      <aside style={sidebarStyle}>
        <h2>Botari</h2>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><a href="/" style={{ color: '#fff', textDecoration: 'none' }}>Dashboard</a></li>
            <li><a href="/settings" style={{ color: '#fff', textDecoration: 'none' }}>Settings</a></li>
          </ul>
        </nav>
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            marginTop: '2rem',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            background: darkMode ? '#007bff' : '#f8f9fa',
            color: darkMode ? '#fff' : '#333'
          }}
        >
          {darkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
      </aside>

      {/* Main content */}
      <main style={mainStyle}>
        <header style={{ marginBottom: '2rem' }}>
          <h1>Analytics Dashboard</h1>
        </header>
        {children}
      </main>
    </div>
  );
};

export default Layout;
