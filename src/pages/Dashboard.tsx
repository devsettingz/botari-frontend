import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Users, LogOut, Plus, CreditCard, X, Smartphone, 
  Mail, MessageSquare, Headphones, Share2, FileText, 
  Shield, Sparkles, TrendingUp, CheckCircle, Clock
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const Dashboard: React.FC = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPayments, setShowPayments] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [showAgentModal, setShowAgentModal] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('jwt') || localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const teamRes = await axios.get(`${API_URL}/api/employees/my-team`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(teamRes.data || []);

      const payRes = await axios.get(`${API_URL}/api/employees/payments/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPayments(payRes.data || []);
      
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get icon based on employee role
  const getAgentIcon = (role: string) => {
    if (role?.includes('Support')) return <MessageSquare size={24} />;
    if (role?.includes('Assistant')) return <Mail size={24} />;
    if (role?.includes('Sales')) return <TrendingUp size={24} />;
    if (role?.includes('Receptionist') || role?.includes('Voice')) return <Headphones size={24} />;
    if (role?.includes('Social')) return <Share2 size={24} />;
    if (role?.includes('Content') || role?.includes('SEO')) return <FileText size={24} />;
    if (role?.includes('Legal')) return <Shield size={24} />;
    return <Users size={24} />;
  };

  // Get gradient based on tier
  const getTierGradient = (tier: string) => {
    switch(tier) {
      case 'enterprise': return 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)';
      case 'premium': return 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)';
      case 'professional': return 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)';
      case 'starter': return 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
      default: return 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)';
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const openAgentDetails = (emp: any) => {
    setSelectedEmployee(emp);
    setShowAgentModal(true);
  };

  if (loading) {
    return (
      <div style={{padding: 50, color: 'white', textAlign: 'center', background: '#0A0A0F', minHeight: '100vh'}}>
        <div style={{fontSize: '24px', marginBottom: '16px'}}>🤖</div>
        Loading your AI team...
      </div>
    );
  }

  return (
    <div style={{minHeight: '100vh', background: '#0A0A0F', color: 'white', padding: '32px'}}>
      
      {/* Header */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px'}}>
        <div>
          <h1 style={{margin: 0, fontSize: '32px', fontWeight: 'bold'}}>Dashboard</h1>
          <p style={{color: '#666', marginTop: '4px'}}>Manage your AI workforce</p>
        </div>
        <div style={{display: 'flex', gap: '12px'}}>
          <button onClick={() => setShowPayments(!showPayments)} style={btnStyle}>
            <CreditCard size={18} /> {showPayments ? 'Hide' : 'Payments'}
          </button>
          <button onClick={() => navigate('/team')} style={primaryBtnStyle}>
            <Plus size={18} /> Hire Employee
          </button>
          <button onClick={handleLogout} style={btnStyle}>
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Trial Status */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(226,114,91,0.1) 0%, rgba(226,114,91,0.05) 100%)',
        border: '1px solid rgba(226,114,91,0.3)',
        padding: '16px 24px',
        borderRadius: '12px',
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
          <Clock size={20} style={{color: '#E2725B'}} />
          <span>7 days left on trial</span>
        </div>
        <button style={{...primaryBtnStyle, padding: '8px 16px', fontSize: '14px'}}>
          Upgrade Now
        </button>
      </div>

      {/* Payments Section */}
      {showPayments && (
        <div style={{background: 'rgba(255,255,255,0.05)', padding: '24px', borderRadius: '12px', marginBottom: '32px'}}>
          <h2>Payment History</h2>
          {payments.length === 0 ? (
            <p style={{color: '#666'}}>No payments yet</p>
          ) : (
            payments.map((p: any) => (
              <div key={p.id} style={{display: 'flex', justifyContent: 'space-between', padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
                <span>{p.employee_name || 'AI Employee'}</span>
                <span style={{color: '#4ADE80'}}>₦{p.amount}</span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Employees Section */}
      {employees.length === 0 ? (
        <div style={{textAlign: 'center', padding: '60px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px'}}>
          <div style={{fontSize: '48px', marginBottom: '16px'}}>🤖</div>
          <h2>No AI Employees Hired Yet</h2>
          <p style={{color: '#888', marginBottom: '24px'}}>Hire Amina to get started with WhatsApp automation</p>
          <button onClick={() => navigate('/team')} style={primaryBtnStyle}>
            Hire Your First Employee
          </button>
        </div>
      ) : (
        <div>
          <h2 style={{marginBottom: '24px', fontSize: '24px'}}>
            Your AI Team <span style={{color: '#666'}}>({employees.length})</span>
          </h2>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px'}}>
            {employees.map((emp: any) => (
              <div 
                key={emp.id} 
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '16px',
                  border: `2px solid ${emp.color_theme || '#E2725B'}30`,
                  overflow: 'hidden',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer'
                }}
                onClick={() => openAgentDetails(emp)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 20px 40px ${emp.color_theme || '#E2725B'}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Card Header with Gradient */}
                <div style={{
                  background: getTierGradient(emp.tier),
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    backdropFilter: 'blur(10px)'
                  }}>
                    {getAgentIcon(emp.employee_role)}
                  </div>
                  <div style={{flex: 1, color: 'white'}}>
                    <h3 style={{margin: 0, fontSize: '20px', fontWeight: 'bold'}}>{emp.display_name}</h3>
                    <p style={{margin: '4px 0', opacity: 0.9, fontSize: '14px'}}>{emp.employee_role}</p>
                  </div>
                  <div style={{
                    background: 'rgba(255,255,255,0.2)',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}>
                    {emp.tier}
                  </div>
                </div>

                {/* Card Body */}
                <div style={{padding: '20px'}}>
                  {/* Status Badge */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '16px'
                  }}>
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: emp.connection_status === 'connected' ? '#4ADE80' : '#F59E0B',
                      animation: emp.connection_status === 'connected' ? 'none' : 'pulse 2s infinite'
                    }} />
                    <span style={{
                      color: emp.connection_status === 'connected' ? '#4ADE80' : '#F59E0B',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>
                      {emp.connection_status === 'connected' ? 'Active & Running' : 'Setup Required'}
                    </span>
                  </div>

                  {/* Features List */}
                  <div style={{marginBottom: '16px'}}>
                    <p style={{color: '#666', fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px'}}>
                      Capabilities
                    </p>
                    {(emp.features || []).slice(0, 3).map((feature: string, idx: number) => (
                      <div key={idx} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '8px',
                        fontSize: '14px',
                        color: '#ccc'
                      }}>
                        <CheckCircle size={14} style={{color: emp.color_theme || '#E2725B', flexShrink: 0}} />
                        <span>{feature}</span>
                      </div>
                    ))}
                    {(emp.features || []).length > 3 && (
                      <p style={{color: '#666', fontSize: '12px', marginTop: '8px'}}>
                        +{(emp.features || []).length - 3} more features
                      </p>
                    )}
                  </div>

                  {/* Price */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 0',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    marginBottom: '12px'
                  }}>
                    <span style={{color: '#666', fontSize: '14px'}}>Monthly Cost</span>
                    <span style={{fontSize: '24px', fontWeight: 'bold', color: emp.color_theme || '#E2725B'}}>
                      ₦{(emp.price_monthly || 4900).toLocaleString()}
                    </span>
                  </div>

                  {/* Action Button */}
                  {emp.connection_status === 'connected' ? (
                    <button style={{
                      width: '100%',
                      padding: '12px',
                      background: 'rgba(74,222,128,0.1)',
                      border: '1px solid #4ADE80',
                      color: '#4ADE80',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}>
                      <CheckCircle size={18} />
                      View Activity
                    </button>
                  ) : (
                    <button style={{
                      width: '100%',
                      padding: '12px',
                      background: emp.color_theme || '#E2725B',
                      border: 'none',
                      color: 'white',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}>
                      <Smartphone size={18} />
                      Setup & Connect
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Agent Details Modal */}
      {showAgentModal && selectedEmployee && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: '#1a1a1a',
            borderRadius: '20px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            border: `2px solid ${selectedEmployee.color_theme || '#E2725B'}`
          }}>
            {/* Modal Header */}
            <div style={{
              background: getTierGradient(selectedEmployee.tier),
              padding: '32px',
              position: 'relative'
            }}>
              <button 
                onClick={() => setShowAgentModal(false)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'white'
                }}
              >
                <X size={20} />
              </button>
              
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '40px'
              }}>
                {getAgentIcon(selectedEmployee.employee_role)}
              </div>
              
              <h2 style={{textAlign: 'center', margin: 0, fontSize: '28px'}}>{selectedEmployee.display_name}</h2>
              <p style={{textAlign: 'center', margin: '8px 0', opacity: 0.9}}>{selectedEmployee.employee_role}</p>
              
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '16px',
                marginTop: '16px'
              }}>
                <span style={{
                  background: 'rgba(255,255,255,0.2)',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  {selectedEmployee.tier?.toUpperCase()}
                </span>
                <span style={{
                  background: 'rgba(255,255,255,0.2)',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  ₦{(selectedEmployee.price_monthly || 4900).toLocaleString()}/mo
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{padding: '32px'}}>
              <h3 style={{marginBottom: '16px', color: '#fff'}}>All Features</h3>
              <div style={{marginBottom: '24px'}}>
                {(selectedEmployee.features || []).map((feature: string, idx: number) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    marginBottom: '12px',
                    padding: '12px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '8px'
                  }}>
                    <Sparkles size={18} style={{color: selectedEmployee.color_theme || '#E2725B', marginTop: '2px', flexShrink: 0}} />
                    <span style={{color: '#ccc', lineHeight: '1.5'}}>{feature}</span>
                  </div>
                ))}
              </div>

              <h3 style={{marginBottom: '16px', color: '#fff'}}>Configuration</h3>
              
              {selectedEmployee.connection_status === 'connected' ? (
                <div style={{
                  background: 'rgba(74,222,128,0.1)',
                  border: '1px solid #4ADE80',
                  padding: '20px',
                  borderRadius: '12px',
                  marginBottom: '20px'
                }}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px'}}>
                    <CheckCircle size={24} style={{color: '#4ADE80'}} />
                    <span style={{fontWeight: 'bold', color: '#4ADE80'}}>WhatsApp Connected</span>
                  </div>
                  <p style={{color: '#666', fontSize: '14px', margin: 0}}>
                    Phone: {selectedEmployee.whatsapp_number || '+234 XXX XXX XXXX'}
                  </p>
                </div>
              ) : (
                <div style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '20px',
                  borderRadius: '12px',
                  marginBottom: '20px'
                }}>
                  <p style={{color: '#666', marginBottom: '16px', lineHeight: '1.6'}}>
                    Connect your WhatsApp Business number to start using {selectedEmployee.display_name}. 
                    The AI will respond to customer messages automatically.
                  </p>
                  <button style={{
                    width: '100%',
                    padding: '16px',
                    background: selectedEmployee.color_theme || '#E2725B',
                    border: 'none',
                    color: 'white',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}>
                    <Smartphone size={20} />
                    Connect WhatsApp Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

const btnStyle = {
  padding: '10px 16px',
  background: 'rgba(255,255,255,0.1)',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: '8px',
  color: 'white',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const primaryBtnStyle = {
  ...btnStyle,
  background: '#E2725B',
  color: 'white',
  fontWeight: 'bold',
  border: 'none'
};

export default Dashboard;