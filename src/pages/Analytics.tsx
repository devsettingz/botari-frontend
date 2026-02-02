import React from 'react';

const Analytics: React.FC = () => {
  return (
    <div style={{ color: 'white' }}>
      <h1>Analytics</h1>
      <p style={{ color: '#888' }}>Track your AI employee performance (Coming Soon)</p>
      
      <div style={{ 
        marginTop: '40px', 
        padding: '40px', 
        backgroundColor: '#1a1a1a',
        borderRadius: '12px',
        textAlign: 'center',
        border: '2px dashed #333'
      }}>
        <p style={{ color: '#666' }}>
          📊 Performance metrics will appear here once you have active conversations.
        </p>
        <p style={{ color: '#E2725B', marginTop: '20px' }}>
          Hire Amina to start collecting data!
        </p>
      </div>
    </div>
  );
};

export default Analytics;