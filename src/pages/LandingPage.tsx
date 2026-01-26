import React from 'react';
import { Link } from 'react-router-dom';
import Features from '../components/Features';
import '../index.css';

const LandingPage: React.FC = () => {
  return (
    <div className="app-container">
      {/* Hero Section */}
      <header className="app-header">
        <h1 className="app-title">Botari</h1>
        <p className="app-subtitle">Smart analytics for customer conversations</p>
        <Link to="/login">
          <button className="cta-button">Get Started</button>
        </Link>
      </header>

      {/* Features Section */}
      <main className="app-main">
        <section className="features-section">
          <h2 className="features-heading" style={{ color: '#3399ff' }}>✨ Features</h2>
          <Features />
        </section>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Botari. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
