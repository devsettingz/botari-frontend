import React, { useState, useEffect } from 'react';

const Settings: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved === 'true') {
      setDarkMode(true);
      document.getElementById('root')?.classList.add('dark-mode');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
    const root = document.getElementById('root');
    if (root) {
      if (newMode) root.classList.add('dark-mode');
      else root.classList.remove('dark-mode');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('business_id');
    localStorage.removeItem('business_name');
    window.location.href = '/login';
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>⚙️ Settings</h1>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Appearance</h2>
        <button
          onClick={toggleDarkMode}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            background: darkMode ? '#007bff' : '#f8f9fa',
            color: darkMode ? '#fff' : '#333',
          }}
        >
          {darkMode ? '🌙 Dark Mode Enabled' : '☀️ Light Mode Enabled'}
        </button>
      </section>

      <section>
        <h2>Account</h2>
        <button
          onClick={handleLogout}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            background: '#dc3545',
            color: '#fff',
          }}
        >
          Logout
        </button>
      </section>
    </div>
  );
};

export default Settings;
