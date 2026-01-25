import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '2rem', textAlign: 'center' }}>
      {/* Hero Section */}
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#007bff' }}>Botari</h1>
        <p style={{ fontSize: '1.2rem', color: '#555' }}>
          Smart analytics for customer conversations
        </p>
        <Link to="/login">
          <button style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', fontSize: '1rem', background: '#007bff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            Get Started
          </button>
        </Link>
      </header>

      {/* Features Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2>✨ Features</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>📊 Analytics Dashboard</div>
          <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>⚡ Fast Response Tracking</div>
          <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>🌍 Global SaaS Ready</div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ marginTop: '3rem', color: '#777' }}>
        <p>© {new Date().getFullYear()} Botari. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
