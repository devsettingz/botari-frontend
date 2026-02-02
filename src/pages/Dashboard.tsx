import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

interface DashboardProps {
  token: string;
}

const Dashboard: React.FC<DashboardProps> = ({ token }) => {
  const [businessId, setBusinessId] = useState<number | null>(null);
  const [businessName, setBusinessName] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [whatsappStatus, setWhatsappStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [activeEmployees, setActiveEmployees] = useState<any[]>([]);
  const [stats, setStats] = useState({ conversations: 0, messages: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const storedId = localStorage.getItem('business_id');
    const storedName = localStorage.getItem('business_name');
    
    if (storedId) {
      setBusinessId(parseInt(storedId, 10));
      fetchDashboardData(parseInt(storedId, 10));
    }
    if (storedName) setBusinessName(storedName);
  }, []);

  useEffect(() => {
    if (whatsappStatus === 'connecting') {
      const interval = setInterval(checkWhatsAppStatus, 3000);
      return () => clearInterval(interval);
    }
  }, [whatsappStatus]);

  const fetchDashboardData = async (bid: number) => {
    try {
      // Get active employees
      const empRes = await axios.get(`${API_URL}/api/employees/my-team`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActiveEmployees(empRes.data.filter((e: any) => e.is_hired));

      // Get stats (mock for now - replace with real endpoint)
      setStats({ conversations: 12, messages: 48 });
    } catch (err) {
      console.error('Dashboard load error:', err);
    }
  };

  const connectWhatsApp = async () => {
    setWhatsappStatus('connecting');
    try {
      const res = await axios.post(`${API_URL}/api/whatsapp/connect`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.qrCode) {
        setQrCode(res.data.qrCode);
      }
    } catch (err) {
      alert('Failed to start WhatsApp connection');
      setWhatsappStatus('disconnected');
    }
  };

  const checkWhatsAppStatus = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/whatsapp/status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.connected) {
        setWhatsappStatus('connected');
        setQrCode(null);
      }
    } catch (e) {}
  };

  if (!businessId) {
    return (
      <div style={{ padding: '2rem', color: 'white' }}>
        <h2>Setting up your workspace...</h2>
        <p style={{ color: '#666' }}>Please refresh if this persists.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '36px', color: '#fff' }}>
          Welcome back, {businessName ?? 'Founder'}
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Here's what's happening with your AI workforce today.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2a1f1f 100%)',
          border: '1px solid #333',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <div style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>AI Employees Active</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#E2725B' }}>
            {activeEmployees.length}
          </div>
          <div style={{ color: '#22c55e', fontSize: '12px', marginTop: '8px' }}>
            {activeEmployees.length > 0 ? '✓ Operational' : '⚠ Hire your first employee'}
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #1f2a1f 100%)',
          border: '1px solid #333',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <div style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>Conversations Today</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#fff' }}>{stats.conversations}</div>
          <div style={{ color: '#666', fontSize: '12px', marginTop: '8px' }}>Across WhatsApp channels</div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #1f1f2a 100%)',
          border: '1px solid #333',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <div style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>Messages Handled</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#fff' }}>{stats.messages}</div>
          <div style={{ color: '#22c55e', fontSize: '12px', marginTop: '8px' }}>↑ 12% from yesterday</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* WhatsApp Connection Card */}
        <div style={{
          backgroundColor: '#1a1a1a',
          border: `1px solid ${whatsappStatus === 'connected' ? '#22c55e' : '#333'}`,
          borderRadius: '12px',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ fontSize: '24px' }}>💬</span>
            <h3 style={{ margin: 0, color: '#fff' }}>WhatsApp Business</h3>
            {whatsappStatus === 'connected' && (
              <span style={{ 
                backgroundColor: '#22c55e', 
                color: '#000', 
                padding: '4px 8px', 
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 'bold'
              }}>
                CONNECTED
              </span>
            )}
          </div>

          {whatsappStatus === 'disconnected' && (
            <>
              <p style={{ color: '#888', marginBottom: '20px', lineHeight: '1.5' }}>
                Connect your business WhatsApp to enable Amina to handle customer messages automatically.
              </p>
              <button
                onClick={connectWhatsApp}
                style={{
                  width: '100%',
                  backgroundColor: '#E2725B',
                  color: '#000',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Connect WhatsApp Business
              </button>
            </>
          )}

          {whatsappStatus === 'connecting' && (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              {!qrCode ? (
                <>
                  <div style={{ 
                    border: '3px solid #333', 
                    borderTop: '3px solid #E2725B', 
                    borderRadius: '50%', 
                    width: '40px', 
                    height: '40px', 
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 16px'
                  }} />
                  <p style={{ color: '#888' }}>Generating secure connection...</p>
                </>
              ) : (
                <>
                  <div style={{ 
                    backgroundColor: '#fff', 
                    padding: '16px', 
                    borderRadius: '8px', 
                    display: 'inline-block',
                    marginBottom: '16px'
                  }}>
                    <img src={qrCode} alt="WhatsApp QR" style={{ width: '200px', height: '200px' }} />
                  </div>
                  <p style={{ color: '#888', fontSize: '14px' }}>
                    Open WhatsApp → Settings → Linked Devices → Link a Device
                  </p>
                </>
              )}
            </div>
          )}

          {whatsappStatus === 'connected' && (
            <div>
              <p style={{ color: '#22c55e', marginBottom: '16px' }}>
                ✓ Your WhatsApp is connected and Amina is monitoring messages.
              </p>
              <div style={{ 
                backgroundColor: '#0f1f0f', 
                padding: '12px', 
                borderRadius: '8px',
                border: '1px solid #1f3f1f'
              }}>
                <div style={{ color: '#888', fontSize: '12px' }}>Connected Number</div>
                <div style={{ color: '#fff', fontWeight: 'bold' }}>+234 8XX XXX XXXX</div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div style={{
          backgroundColor: '#1a1a1a',
          border: '1px solid #333',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#fff' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={() => navigate('/team')}
              style={{
                backgroundColor: '#222',
                color: '#fff',
                border: '1px solid #333',
                padding: '16px',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#222'}
            >
              <span style={{ fontSize: '20px' }}>👥</span>
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>Hire Team Members</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Add Amina or other AI employees</div>
              </div>
            </button>

            <button
              onClick={() => navigate('/conversations')}
              style={{
                backgroundColor: '#222',
                color: '#fff',
                border: '1px solid #333',
                padding: '16px',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#222'}
            >
              <span style={{ fontSize: '20px' }}>💬</span>
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>View Conversations</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Check messages handled by AI</div>
              </div>
            </button>

            <button
              style={{
                backgroundColor: '#222',
                color: '#fff',
                border: '1px solid #333',
                padding: '16px',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#222'}
            >
              <span style={{ fontSize: '20px' }}>⚙️</span>
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>AI Settings</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Customize responses & tone</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Active Employees Preview */}
      {activeEmployees.length > 0 && (
        <div style={{ marginTop: '32px' }}>
          <h3 style={{ color: '#fff', marginBottom: '16px' }}>Your Active Workforce</h3>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {activeEmployees.map((emp) => (
              <div key={emp.id} style={{
                backgroundColor: '#0f1f0f',
                border: '1px solid #1f3f1f',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                minWidth: '250px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#E2725B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px'
                }}>
                  {emp.name[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ color: '#fff', fontWeight: 'bold' }}>{emp.display_name}</div>
                  <div style={{ color: '#22c55e', fontSize: '12px' }}>● Online</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;