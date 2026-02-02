import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageCircle, Calendar, TrendingUp } from 'lucide-react'; // Install: npm install lucide-react

const LandingPage: React.FC = () => {
  return (
    <div style={{ 
      backgroundColor: '#0a0a0a', 
      color: '#ffffff',
      minHeight: '100vh',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Hero Section */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '80px 20px',
        textAlign: 'center'
      }}>
        <div style={{ 
          display: 'inline-block', 
          backgroundColor: '#E2725B', 
          color: '#000',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: 'bold',
          marginBottom: '24px'
        }}>
          Now Live in Lagos & Nairobi 🚀
        </div>
        
        <h1 style={{ 
          fontSize: '56px', 
          fontWeight: '800',
          lineHeight: '1.1',
          marginBottom: '24px',
          background: 'linear-gradient(to right, #fff, #aaa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Hire Amina for $49/month.<br/>
          She Answers Your WhatsApp,<br/>
          Books Appointments, Never Sleeps.
        </h1>
        
        <p style={{ 
          fontSize: '20px', 
          color: '#888',
          maxWidth: '600px',
          margin: '0 auto 40px',
          lineHeight: '1.6'
        }}>
          Botari is the first AI employee built for African businesses. She speaks English, Swahili, and Pidgin. Works on WhatsApp. No training needed.
        </p>
        
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link to="/register">
            <button style={{
              backgroundColor: '#E2725B',
              color: '#000',
              border: 'none',
              padding: '16px 32px',
              fontSize: '18px',
              fontWeight: 'bold',
              borderRadius: '8px',
              cursor: 'pointer'
            }}>
              Hire Amina Now →
            </button>
          </Link>
          <button style={{
            backgroundColor: 'transparent',
            color: '#fff',
            border: '1px solid #333',
            padding: '16px 32px',
            fontSize: '18px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
            See Demo Video
          </button>
        </div>
        
        <div style={{ marginTop: '60px', opacity: 0.6, fontSize: '14px' }}>
          Trusted by 50+ shops in Yaba Market & Westlands
        </div>
      </div>

      {/* How It Works */}
      <div style={{ backgroundColor: '#111', padding: '80px 20px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '36px', marginBottom: '60px' }}>
            She Works While You Sleep
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '40px'
          }}>
            <FeatureCard 
              icon={<MessageCircle size={32} color="#E2725B" />}
              title="Answers WhatsApp 24/7"
              desc="Customers ask about prices? Amina checks your inventory and replies instantly. Even at 2 AM."
            />
            <FeatureCard 
              icon={<Calendar size={32} color="#E2725B" />}
              title="Books Appointments"
              desc="She checks your calendar and schedules customers. Sends reminders. Reduces no-shows by 80%."
            />
            <FeatureCard 
              icon={<TrendingUp size={32} color="#E2725B" />}
              title="Speaks Local Languages"
              desc="English, Swahili, Yoruba, Pidgin. She understands 'How much?' and 'E get work?'"
            />
            <FeatureCard 
              icon={<Phone size={32} color="#E2725B" />}
              title="Takes Voice Notes"
              desc="Customers send voice messages? She transcribes, understands, and responds. Perfect for busy traders."
            />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '36px', marginBottom: '20px' }}>One Price. No Hidden Fees.</h2>
        <div style={{ 
          backgroundColor: '#1a1a1a',
          border: '1px solid #333',
          borderRadius: '16px',
          padding: '40px',
          maxWidth: '400px',
          margin: '0 auto'
        }}>
          <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#E2725B' }}>$49</div>
          <div style={{ color: '#888', marginBottom: '30px' }}>per month</div>
          <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0, color: '#ccc', lineHeight: '2' }}>
            <li>✅ Unlimited WhatsApp messages</li>
            <li>✅ 1,000 customer conversations</li>
            <li>✅ Calendar integration</li>
            <li>✅ Basic inventory tracking</li>
            <li>✅ Swahili & Pidgin support</li>
          </ul>
          <Link to="/register" style={{ display: 'block', marginTop: '30px' }}>
            <button style={{
              width: '100%',
              backgroundColor: '#E2725B',
              color: '#000',
              border: 'none',
              padding: '16px',
              fontSize: '16px',
              fontWeight: 'bold',
              borderRadius: '8px',
              cursor: 'pointer'
            }}>
              Start 7-Day Free Trial
            </button>
          </Link>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '16px' }}>
            No credit card required. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
};

// Simple component
const FeatureCard = ({ icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ marginBottom: '20px' }}>{icon}</div>
    <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>{title}</h3>
    <p style={{ color: '#888', lineHeight: '1.6' }}>{desc}</p>
  </div>
);

export default LandingPage;