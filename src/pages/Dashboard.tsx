import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Users, MessageCircle, TrendingUp, Zap, ArrowRight, Settings, Plus, Activity, BarChart3 } from 'lucide-react';
import DashboardWidget from '../components/DashboardWidget';

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
  const [stats, setStats] = useState({ conversations: 0, messages: 0, responseTime: 0 });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedId = localStorage.getItem('business_id');
    const storedName = localStorage.getItem('business_name');
    
    if (storedId) {
      const parsedId = parseInt(storedId, 10);
      setBusinessId(parsedId);
      fetchDashboardData(parsedId);
    }
    if (storedName) setBusinessName(storedName);
  }, []);

  useEffect(() => {
    if (whatsappStatus === 'connecting') {
      const interval = setInterval(checkWhatsAppStatus, 3000);
      return () => clearInterval(interval);
    }
  }, [whatsappStatus]);

  // FIXED: Added underscore prefix to indicate intentionally unused parameter
  const fetchDashboardData = async (_bid: number) => {
    try {
      const empRes = await axios.get(`${API_URL}/api/employees/my-team`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActiveEmployees(empRes.data.filter((e: any) => e.is_hired));

      setStats({ conversations: 127, messages: 842, responseTime: 2.3 });
      
      setRecentActivity([
        { type: 'message', text: 'New order from +234 801 234 5678', time: '2 min ago', employee: 'Amina' },
        { type: 'appointment', text: 'Appointment booked for tomorrow 2PM', time: '15 min ago', employee: 'Amina' },
        { type: 'employee', text: 'Stan sent 3 cold emails', time: '1 hour ago', employee: 'Stan' },
      ]);
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (!businessId) {
    return (
      <div style={{ padding: '2rem', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0A0A0F' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '50px', height: '50px',
            border: '3px solid rgba(226,114,91,0.2)',
            borderTop: '3px solid #E2725B',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }} />
          <p style={{ color: '#666' }}>Setting up your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#0A0A0F',
      color: '#FFFFFF',
      fontFamily: 'Inter, -apple-system, sans-serif',
      padding: '32px'
    }}>
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

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto' }}>
        
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>{getGreeting()},</p>
              <h1 style={{ 
                margin: 0, 
                fontSize: '40px', 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #FFFFFF 0%, #A0A0B0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {businessName ?? 'Founder'}
              </h1>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setShowAnalytics(!showAnalytics)}
                style={{
                  padding: '12px 20px',
                  background: showAnalytics ? 'rgba(226,114,91,0.2)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${showAnalytics ? 'rgba(226,114,91,0.4)' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <BarChart3 size={16} /> 
                {showAnalytics ? 'Hide Analytics' : 'View Analytics'}
              </button>

              <button style={{
                padding: '12px 20px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Settings size={16} /> Settings
              </button>
              
              <button onClick={() => navigate('/team')} style={{
                padding: '12px 20px',
                background: 'linear-gradient(135deg, #E2725B 0%, #FF8E53 100%)',
                border: 'none',
                borderRadius: '10px',
                color: '#000',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Plus size={16} /> Hire Employee
              </button>
            </div>
          </div>
          <p style={{ color: '#666', fontSize: '16px' }}>
            {showAnalytics ? 'Deep dive into your performance metrics.' : "Here's your AI workforce performance today."}
          </p>
        </div>

        {showAnalytics && businessId ? (
          <DashboardWidget businessId={businessId} token={token} />
        ) : (
          <>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
              gap: '20px',
              marginBottom: '32px'
            }}>
              <div style={{
                background: 'linear-gradient(145deg, rgba(226,114,91,0.1) 0%, rgba(26,26,36,0.5) 100%)',
                border: '1px solid rgba(226,114,91,0.2)',
                borderRadius: '20px',
                padding: '24px',
                cursor: 'pointer'
              }} onClick={() => navigate('/team')}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{
                    width: '48px', height: '48px',
                    background: 'rgba(226,114,91,0.2)',
                    borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#E2725B'
                  }}>
                    <Users size={24} />
                  </div>
                  {activeEmployees.length > 0 && (
                    <span style={{
                      padding: '6px 12px',
                      background: 'rgba(74,222,128,0.1)',
                      color: '#4ADE80',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 500
                    }}>
                      All Active
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>AI Employees</div>
                <div style={{ fontSize: '36px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                  {activeEmployees.length}
                </div>
                <div style={{ fontSize: '13px', color: activeEmployees.length > 0 ? '#4ADE80' : '#E2725B' }}>
                  {activeEmployees.length > 0 ? '✓ Team operational' : '⚠ Hire your first employee'}
                </div>
              </div>

              <div style={{
                background: 'rgba(26, 26, 36, 0.5)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px',
                padding: '24px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{
                    width: '48px', height: '48px',
                    background: 'rgba(74,144,255,0.1)',
                    borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#4A90FF'
                  }}>
                    <MessageCircle size={24} />
                  </div>
                  <span style={{ fontSize: '12px', color: '#4ADE80', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <TrendingUp size={12} /> +12%
                  </span>
                </div>
                <div style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>Today's Conversations</div>
                <div style={{ fontSize: '36px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                  {stats.conversations}
                </div>
                <div style={{ fontSize: '13px', color: '#666' }}>
                  Across WhatsApp channels
                </div>
              </div>

              <div style={{
                background: 'rgba(26, 26, 36, 0.5)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px',
                padding: '24px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{
                    width: '48px', height: '48px',
                    background: 'rgba(155,89,182,0.1)',
                    borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#9B59B6'
                  }}>
                    <Activity size={24} />
                  </div>
                </div>
                <div style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>Messages Handled</div>
                <div style={{ fontSize: '36px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                  {stats.messages}
                </div>
                <div style={{ fontSize: '13px', color: '#4ADE80' }}>
                  ↑ 23% from yesterday
                </div>
              </div>

              <div style={{
                background: 'rgba(26, 26, 36, 0.5)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px',
                padding: '24px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{
                    width: '48px', height: '48px',
                    background: 'rgba(243,156,18,0.1)',
                    borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#F39C12'
                  }}>
                    <Zap size={24} />
                  </div>
                </div>
                <div style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>Avg Response Time</div>
                <div style={{ fontSize: '36px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                  {stats.responseTime}s
                </div>
                <div style={{ fontSize: '13px', color: '#666' }}>
                  Faster than 94% of humans
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
              <div>
                <div style={{
                  background: 'rgba(26, 26, 36, 0.5)',
                  border: `1px solid ${whatsappStatus === 'connected' ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '20px',
                  padding: '28px',
                  marginBottom: '24px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                    <div style={{
                      width: '56px', height: '56px',
                      background: whatsappStatus === 'connected' ? 'rgba(74,222,128,0.1)' : 'rgba(226,114,91,0.1)',
                      borderRadius: '16px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '28px'
                    }}>
                      {whatsappStatus === 'connected' ? '✅' : '💬'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: '0 0 4px 0', color: '#fff', fontSize: '18px', fontWeight: 600 }}>
                        WhatsApp Business
                      </h3>
                      <p style={{ margin: 0, color: '#888', fontSize: '14px' }}>
                        {whatsappStatus === 'connected' ? 'Connected and monitoring messages' : 'Connect to activate Amina'}
                      </p>
                    </div>
                    {whatsappStatus === 'connected' && (
                      <span style={{
                        padding: '8px 16px',
                        background: 'rgba(74,222,128,0.1)',
                        color: '#4ADE80',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: 500
                      }}>
                        Active
                      </span>
                    )}
                  </div>

                  {whatsappStatus === 'disconnected' && (
                    <button
                      onClick={connectWhatsApp}
                      style={{
                        width: '100%',
                        padding: '16px',
                        background: 'linear-gradient(135deg, #E2725B 0%, #FF8E53 100%)',
                        border: 'none',
                        borderRadius: '12px',
                        color: '#000',
                        fontWeight: 600,
                        fontSize: '15px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      Connect WhatsApp <ArrowRight size={18} />
                    </button>
                  )}

                  {whatsappStatus === 'connecting' && (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                      {!qrCode ? (
                        <>
                          <div style={{ 
                            width: '50px', height: '50px',
                            border: '4px solid rgba(226,114,91,0.2)',
                            borderTop: '4px solid #E2725B',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto 20px'
                          }} />
                          <p style={{ color: '#888' }}>Generating secure connection...</p>
                        </>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <div style={{ 
                            backgroundColor: '#fff', 
                            padding: '20px', 
                            borderRadius: '16px', 
                            marginBottom: '20px'
                          }}>
                            <img src={qrCode} alt="WhatsApp QR" style={{ width: '220px', height: '220px' }} />
                          </div>
                          <p style={{ color: '#888', fontSize: '14px', textAlign: 'center', maxWidth: '300px' }}>
                            Open WhatsApp on your phone → Settings → Linked Devices → Link a Device
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {whatsappStatus === 'connected' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'rgba(74,222,128,0.05)', borderRadius: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: '#4ADE80', fontSize: '14px', marginBottom: '4px' }}>✓ Connected</div>
                        <div style={{ color: '#666', fontSize: '13px' }}>+234 ••• ••• ••45</div>
                      </div>
                      <button style={{
                        padding: '10px 16px',
                        background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#888',
                        fontSize: '13px',
                        cursor: 'pointer'
                      }}>
                        Manage
                      </button>
                    </div>
                  )}
                </div>

                <div style={{
                  background: 'rgba(26, 26, 36, 0.5)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '20px',
                  padding: '28px'
                }}>
                  <h3 style={{ margin: '0 0 24px 0', color: '#fff', fontSize: '18px', fontWeight: 600 }}>
                    Recent Activity
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {recentActivity.map((activity, idx) => (
                      <div key={idx} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '16px',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '12px'
                      }}>
                        <div style={{
                          width: '40px', height: '40px',
                          background: activity.type === 'message' ? 'rgba(74,144,255,0.1)' : 
                                      activity.type === 'appointment' ? 'rgba(74,222,128,0.1)' : 'rgba(226,114,91,0.1)',
                          borderRadius: '10px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: activity.type === 'message' ? '#4A90FF' : 
                                activity.type === 'appointment' ? '#4ADE80' : '#E2725B'
                        }}>
                          {activity.type === 'message' ? <MessageCircle size={18} /> : 
                           activity.type === 'appointment' ? <Activity size={18} /> : <Zap size={18} />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ color: '#fff', fontSize: '14px', marginBottom: '2px' }}>{activity.text}</div>
                          <div style={{ color: '#666', fontSize: '12px' }}>{activity.time} • {activity.employee}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div style={{
                  background: 'rgba(26, 26, 36, 0.5)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '20px',
                  padding: '24px',
                  marginBottom: '24px'
                }}>
                  <h3 style={{ margin: '0 0 20px 0', color: '#fff', fontSize: '16px', fontWeight: 600 }}>
                    Quick Actions
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { icon: <Users size={18} />, label: 'Hire Team Members', desc: 'Add more AI employees', action: () => navigate('/team') },
                      { icon: <MessageCircle size={18} />, label: 'View Conversations', desc: 'Check all messages', action: () => navigate('/conversations') },
                      { icon: <Settings size={18} />, label: 'AI Settings', desc: 'Customize responses', action: () => {} }
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        onClick={item.action}
                        style={{
                          padding: '16px',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          borderRadius: '12px',
                          color: '#fff',
                          cursor: 'pointer',
                          textAlign: 'left',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          width: '100%'
                        }}
                      >
                        <div style={{ color: '#E2725B' }}>{item.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 500, fontSize: '14px', marginBottom: '2px' }}>{item.label}</div>
                          <div style={{ fontSize: '12px', color: '#666' }}>{item.desc}</div>
                        </div>
                        <ArrowRight size={16} color="#666" />
                      </button>
                    ))}
                  </div>
                </div>

                {activeEmployees.length > 0 && (
                  <div style={{
                    background: 'rgba(26, 26, 36, 0.5)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '20px',
                    padding: '24px'
                  }}>
                    <h3 style={{ margin: '0 0 20px 0', color: '#fff', fontSize: '16px', fontWeight: 600 }}>
                      Active Workforce
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {activeEmployees.map((emp) => (
                        <div key={emp.id} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '14px',
                          background: 'rgba(74,222,128,0.05)',
                          border: '1px solid rgba(74,222,128,0.1)',
                          borderRadius: '12px'
                        }}>
                          <div style={{
                            width: '44px', height: '44px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #E2725B 0%, #FF8E53 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '18px', fontWeight: 'bold', color: '#fff'
                          }}>
                            {emp.name[0].toUpperCase()}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ color: '#fff', fontWeight: 500, fontSize: '14px' }}>{emp.display_name}</div>
                            <div style={{ color: '#4ADE80', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span style={{ width: '6px', height: '6px', background: '#4ADE80', borderRadius: '50%' }} />
                              Online
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeEmployees.length === 0 && (
                  <div style={{
                    background: 'linear-gradient(145deg, rgba(226,114,91,0.1) 0%, rgba(26,26,36,0.5) 100%)',
                    border: '1px solid rgba(226,114,91,0.2)',
                    borderRadius: '20px',
                    padding: '24px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>👋</div>
                    <h4 style={{ color: '#fff', marginBottom: '8px', fontSize: '16px' }}>Start with Amina</h4>
                    <p style={{ color: '#888', fontSize: '13px', marginBottom: '16px', lineHeight: '1.5' }}>
                      Your WhatsApp sales specialist. $49/month.
                    </p>
                    <button onClick={() => navigate('/team')} style={{
                      width: '100%',
                      padding: '12px',
                      background: 'linear-gradient(135deg, #E2725B 0%, #FF8E53 100%)',
                      border: 'none',
                      borderRadius: '10px',
                      color: '#000',
                      fontWeight: 600,
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}>
                      Hire Now
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

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