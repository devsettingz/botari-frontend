import React from 'react';
import { BarChart3, TrendingUp, Users, MessageCircle } from 'lucide-react';

const Analytics: React.FC = () => {
  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#0A0A0F',
      color: '#FFFFFF',
      fontFamily: 'Inter, -apple-system, sans-serif',
      padding: '32px'
    }}>
      {/* Background Gradient */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: `
          radial-gradient(ellipse 60% 40% at 80% 20%, rgba(226, 114, 91, 0.08) 0%, transparent 50%),
          radial-gradient(ellipse 40% 30% at 20% 80%, rgba(226, 114, 91, 0.05) 0%, transparent 50%),
          #0A0A0F
        `,
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1400px' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ 
            fontSize: '40px', 
            fontWeight: 700,
            margin: '0 0 8px 0',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #A0A0B0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Analytics
          </h1>
          <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>
            Track your AI employee performance and business metrics
          </p>
        </div>

        {/* Stats Overview */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px',
          marginBottom: '40px'
        }}>
          {[
            { icon: <MessageCircle size={24} />, label: 'Total Messages', value: '2,847', trend: '+12%', color: '#4A90FF' },
            { icon: <Users size={24} />, label: 'Conversations', value: '156', trend: '+8%', color: '#E2725B' },
            { icon: <TrendingUp size={24} />, label: 'Conversion Rate', value: '24%', trend: '+5%', color: '#4ADE80' },
            { icon: <BarChart3 size={24} />, label: 'Avg Response', value: '1.2s', trend: '-0.3s', color: '#9B59B6' }
          ].map((stat, idx) => (
            <div key={idx} style={{
              background: 'rgba(26, 26, 36, 0.5)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '20px',
              padding: '24px',
              transition: 'all 0.3s'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '16px' 
              }}>
                <div style={{
                  width: '48px', height: '48px',
                  background: `rgba(${stat.color === '#E2725B' ? '226,114,91' : stat.color === '#4A90FF' ? '74,144,255' : stat.color === '#4ADE80' ? '74,222,128' : '155,89,182'}, 0.1)`,
                  borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: stat.color
                }}>
                  {stat.icon}
                </div>
                <span style={{ 
                  fontSize: '13px', 
                  color: stat.trend.includes('+') ? '#4ADE80' : '#E2725B',
                  fontWeight: 500
                }}>
                  {stat.trend}
                </span>
              </div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Main Chart Area Placeholder */}
        <div style={{
          background: 'rgba(26, 26, 36, 0.5)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px',
          padding: '40px',
          minHeight: '400px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'rgba(226,114,91,0.1)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
            fontSize: '40px'
          }}>
            📊
          </div>
          <h3 style={{ 
            fontSize: '24px', 
            fontWeight: 600, 
            color: '#fff', 
            margin: '0 0 12px 0' 
          }}>
            Detailed Analytics Coming Soon
          </h3>
          <p style={{ 
            color: '#666', 
            fontSize: '16px', 
            maxWidth: '500px',
            lineHeight: '1.6',
            margin: 0
          }}>
            We're building comprehensive analytics dashboards to help you track every interaction, 
            response time, and conversion metric. Check back soon!
          </p>
          <div style={{ 
            marginTop: '32px',
            padding: '16px 32px',
            background: 'rgba(226,114,91,0.1)',
            border: '1px solid rgba(226,114,91,0.2)',
            borderRadius: '12px',
            color: '#E2725B',
            fontSize: '14px',
            fontWeight: 500
          }}>
            🚀 Full analytics launching next week
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;