import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Users, MessageCircle, TrendingUp, Zap, ArrowRight, 
  Settings, Plus, Activity, BarChart3, LogOut, User, CreditCard
} from 'lucide-react';
import DashboardWidget from '../components/DashboardWidget';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const Dashboard: React.FC = () => {
  const [businessName, setBusinessName] = useState('Founder');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [activeEmployees, setActiveEmployees] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPayments, setShowPayments] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem('business_name');
    if (storedName && storedName !== 'undefined') setBusinessName(storedName);
    
    fetchTeam();
    fetchPayments();
  }, []);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('jwt') || localStorage.getItem('token');
      
      const res = await axios.get(`${API_URL}/api/employees/my-team`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Team fetched:', res.data);
      // Use data as-is - backend already filters for hired employees
      setActiveEmployees(res.data || []);
    } catch (err) {
      console.error('Failed to fetch team:', err);
      setActiveEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('jwt') || localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/employees/payments/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPayments(res.data || []);
    } catch (err) {
      console.error('Failed to fetch payments:', err);
    }
  };

  const connectWhatsApp = async (employeeId: number) => {
    try {
      const token = localStorage.getItem('jwt') || localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/api/whatsapp/connect`, 
        { employee_id: employeeId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setQrCode(res.data.qrCode);
      setPairingCode(res.data.pairingCode || null);
    } catch (err: any) {
      alert('Failed to generate QR: ' + (err.response?.data?.error || err.message));
    }
  };

  const verifyConnection = async (employeeId: number) => {
    try {
      const token = localStorage.getItem('jwt') || localStorage.getItem('token');
      await axios.post(`${API_URL}/api/whatsapp/verify`, 
        { employee_id: employeeId, phone_number: '+2348012345678' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('WhatsApp connected successfully!');
      fetchTeam(); // Refresh to show connected status
      setQrCode(null);
      setPairingCode(null);
    } catch (err) {
      alert('Verification failed');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) {
    return <div style={{padding: 50, color: 'white', textAlign: 'center', background: '#0A0A0F', minHeight: '100vh'}}>Loading...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0A0A0F', color: '#FFFFFF', padding: '32px', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <p style={{ color: '#666', marginBottom: '8px' }}>Welcome back,</p>
          <h1 style={{ margin: 0, fontSize: '36px', fontWeight: 700 }}>{businessName}</h1>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setShowAnalytics(!showAnalytics)} style={buttonStyle}>
            <BarChart3 size={16} /> Analytics
          </button>
          <button onClick={() => setShowPayments(!showPayments)} style={buttonStyle}>
            <CreditCard size={16} /> {showPayments ? 'Hide' : 'Payments'}
          </button>
          <button onClick={() => navigate('/team')} style={primaryButtonStyle}>
            <Plus size={16} /> Hire
          </button>
          <button onClick={handleLogout} style={buttonStyle}>
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* PAYMENT HISTORY SECTION */}
      {showPayments && (
        <div style={{ background: 'rgba(26,26,36,0.8)', borderRadius: '20px', padding: '24px', marginBottom: '32px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h3 style={{ marginBottom: '20px', marginTop: 0 }}>Transaction History</h3>
          {payments.length === 0 ? (
            <p style={{color: '#666'}}>No transactions yet</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {payments.map((pay: any) => (
                <div key={pay.id} style={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' 
                }}>
                  <div>
                    <div style={{fontWeight: 600, color: '#fff'}}>{pay.employee_name || 'AI Employee'}</div>
                    <div style={{fontSize: '12px', color: '#666', marginTop: '4px'}}>{new Date(pay.created_at).toLocaleDateString()}</div>
                  </div>
                  <div style={{color: '#4ADE80', fontWeight: 600}}>
                    ₦{pay.amount} <span style={{fontSize: '12px', color: '#888', marginLeft: '8px'}}>{pay.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ANALYTICS VIEW */}
      {showAnalytics ? (
        <DashboardWidget businessId={1} token={localStorage.getItem('jwt') || ''} />
      ) : (
        <>
          {/* AI EMPLOYEES SECTION */}
          {activeEmployees.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', background: 'rgba(26,26,36,0.5)', borderRadius: '20px', border: '1px solid rgba(226,114,91,0.2)' }}>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>🤖</div>
              <h2 style={{margin: '0 0 12px 0'}}>No AI Employees Yet</h2>
              <p style={{ color: '#888', marginBottom: '32px', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
                You haven't hired any AI employees yet. Hire Amina to start automating your WhatsApp sales.
              </p>
              <button onClick={() => navigate('/team')} style={primaryButtonStyle}>
                Hire Your First Employee
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '24px' }}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h2 style={{ margin: 0 }}>Your AI Team ({activeEmployees.length})</h2>
                <span style={{color: '#4ADE80', fontSize: '14px'}}>Active</span>
              </div>
              
              {activeEmployees.map((emp) => (
                <div key={emp.id} style={{ 
                  background: 'rgba(26,26,36,0.8)', borderRadius: '20px', padding: '24px',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: emp.connection_status !== 'connected' ? '20px' : '0' }}>
                    <div style={{ 
                      width: '60px', height: '60px', borderRadius: '50%', 
                      background: emp.avatar_url ? 'transparent' : 'rgba(226,114,91,0.2)', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '24px', overflow: 'hidden', border: '2px solid rgba(226,114,91,0.3)'
                    }}>
                      {emp.avatar_url ? (
                        <img src={emp.avatar_url} alt={emp.display_name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                      ) : (
                        <User size={28} color="#E2725B" />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: '0 0 4px 0', fontSize: '20px' }}>{emp.display_name}</h3>
                      <p style={{ margin: '0 0 8px 0', color: '#888', fontSize: '14px' }}>{emp.employee_role}</p>
                      <span style={{ 
                        padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 500,
                        background: emp.connection_status === 'connected' ? 'rgba(74,222,128,0.1)' : 'rgba(243,156,18,0.1)',
                        color: emp.connection_status === 'connected' ? '#4ADE80' : '#F39C12',
                        border: `1px solid ${emp.connection_status === 'connected' ? 'rgba(74,222,128,0.3)' : 'rgba(243,156,18,0.3)'}`
                      }}>
                        {emp.connection_status === 'connected' ? '● Active & Connected' : '⏳ Setup Required - Connect WhatsApp'}
                      </span>
                    </div>
                  </div>

                  {/* WhatsApp Connection */}
                  {emp.connection_status !== 'connected' && (
                    <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px' }}>
                      {!qrCode ? (
                        <button onClick={() => connectWhatsApp(emp.id)} style={{...primaryButtonStyle, width: '100%'}}>
                          Connect WhatsApp Business
                        </button>
                      ) : (
                        <div style={{ textAlign: 'center' }}>
                          <img src={qrCode} alt="WhatsApp QR" style={{ width: '200px', marginBottom: '16px', borderRadius: '8px' }} />
                          {pairingCode && (
                            <div style={{marginBottom: '12px', padding: '12px', background: 'rgba(226,114,91,0.1)', borderRadius: '8px'}}>
                              <p style={{margin: '0 0 4px 0', color: '#888', fontSize: '12px'}}>Pairing Code:</p>
                              <p style={{margin: 0, color: '#E2725B', fontWeight: 'bold', fontSize: '18px', letterSpacing: '2px'}}>{pairingCode}</p>
                            </div>
                          )}
                          <p style={{ fontSize: '13px', color: '#666', marginBottom: '16px' }}>
                            Open WhatsApp → Settings → Linked Devices → Link a Device
                          </p>
                          <div style={{display: 'flex', gap: '12px', justifyContent: 'center'}}>
                            <button onClick={() => verifyConnection(emp.id)} style={primaryButtonStyle}>
                              I've Scanned It
                            </button>
                            <button onClick={() => setQrCode(null)} style={buttonStyle}>
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Stats Grid */}
          <div style={{ 
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '20px', marginTop: '32px'
          }}>
            <StatCard icon={<Users size={24} color="#E2725B" />} label="AI Employees" value={activeEmployees.length} />
            <StatCard icon={<MessageCircle size={24} color="#4A90FF" />} label="Today's Conversations" value="127" trend="+12%" />
            <StatCard icon={<Activity size={24} color="#9B59B6" />} label="Messages Handled" value="842" trend="+23%" />
            <StatCard icon={<Zap size={24} color="#F39C12" />} label="Response Time" value="2.3s" subtext="Faster than 94%" />
          </div>
        </>
      )}
    </div>
  );
};

// Helper components
const StatCard = ({ icon, label, value, trend, subtext }: any) => (
  <div style={{ background: 'rgba(26,26,36,0.8)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
    <div style={{ marginBottom: '12px' }}>{icon}</div>
    <div style={{ color: '#888', fontSize: '14px', marginBottom: '8px' }}>{label}</div>
    <div style={{ fontSize: '32px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{value}</div>
    {trend && <div style={{ fontSize: '12px', color: '#4ADE80' }}>{trend}</div>}
    {subtext && <div style={{ fontSize: '12px', color: '#666' }}>{subtext}</div>}
  </div>
);

const buttonStyle = {
  padding: '12px 20px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  color: '#fff',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '14px',
  fontWeight: 500
};

const primaryButtonStyle = {
  ...buttonStyle,
  background: 'linear-gradient(135deg, #E2725B 0%, #FF8E53 100%)',
  color: '#000',
  fontWeight: 600,
  border: 'none'
};

export default Dashboard;