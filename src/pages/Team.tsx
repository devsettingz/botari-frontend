import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Check, X, Loader2, Users, Sparkles } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

interface Employee {
  id: number;
  name: string;
  display_name: string;
  employee_role: string;
  description: string;
  base_monthly_price: number;
  is_hired?: boolean;
  supported_channels: string[];
}

const Team: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [hiring, setHiring] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const token = localStorage.getItem('jwt');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeam();
    window.scrollTo(0, 0);
  }, []);

  const fetchTeam = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/employees/my-team`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const initPayment = async (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowPaymentModal(true);
  };

  const processPayment = async () => {
    if (!selectedEmployee) return;
    
    setHiring(selectedEmployee.name);
    try {
      const paymentRes = await axios.post(`${API_URL}/api/payments/initialize`, {
        employee_id: selectedEmployee.id,
        amount: selectedEmployee.base_monthly_price,
        email: localStorage.getItem('user_email') || 'user@business.com'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Redirect to Paystack
      if (paymentRes.data.authorization_url) {
        window.location.href = paymentRes.data.authorization_url;
        return;
      }

      // Fallback: Direct hire for testing
      await completeHiring(selectedEmployee);
      
    } catch (err: any) {
      alert(err.response?.data?.error || 'Payment initialization failed');
      setHiring(null);
    }
  };

  const completeHiring = async (employee: Employee) => {
    try {
      await axios.post(`${API_URL}/api/employees/hire`, 
        { employeeName: employee.name, channelType: 'whatsapp' },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      alert(`🎉 ${employee.display_name} has joined your team!`);
      setShowPaymentModal(false);
      fetchTeam();
      navigate('/dashboard');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to activate employee');
    } finally {
      setHiring(null);
    }
  };

  const getChannelIcon = (channels: string[]) => {
    if (channels.includes('whatsapp')) return '💬';
    if (channels.includes('email')) return '📧';
    if (channels.includes('voice')) return '📞';
    return '🤖';
  };

  const getChannelColor = (channels: string[]) => {
    if (channels.includes('whatsapp')) return '#22c55e';
    if (channels.includes('email')) return '#3b82f6';
    if (channels.includes('voice')) return '#f59e0b';
    return '#E2725B';
  };

  if (loading) return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#0A0A0F',
      color: 'white', 
      padding: 40, 
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px'
    }}>
      <div style={{ 
        border: '3px solid #333', 
        borderTop: '3px solid #E2725B', 
        borderRadius: '50%', 
        width: '40px', 
        height: '40px', 
        animation: 'spin 1s linear infinite'
      }} />
      <p>Loading available talent...</p>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0A0A0F',
      color: '#FFFFFF',
      fontFamily: 'Inter, -apple-system, sans-serif',
      padding: '32px',
      boxSizing: 'border-box'
    }}>
      {/* Background */}
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
        
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Users size={32} color="#E2725B" />
            <h1 style={{
              fontSize: '40px',
              fontWeight: 700,
              margin: 0,
              background: 'linear-gradient(135deg, #FFFFFF 0%, #A0A0B0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Hire Your AI Team
            </h1>
          </div>
          <p style={{ color: '#888', fontSize: '18px', maxWidth: '600px', lineHeight: '1.6' }}>
            Specialized AI employees for African businesses. Start with <span style={{ color: '#E2725B', fontWeight: 600 }}>Amina</span> for WhatsApp sales, then scale with specialists.
          </p>
        </div>

        {/* Launch Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(226, 114, 91, 0.15) 0%, rgba(255, 142, 83, 0.1) 100%)',
          border: '1px solid rgba(226, 114, 91, 0.3)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '40px' }}>🚀</div>
            <div>
              <h3 style={{ margin: '0 0 4px 0', color: '#E2725B', fontSize: '20px' }}>Launch Special</h3>
              <p style={{ margin: 0, color: '#aaa', fontSize: '15px', lineHeight: '1.5' }}>
                First 50 businesses get <strong>50% OFF</strong> first month. Use code <span style={{ 
                  backgroundColor: 'rgba(226, 114, 91, 0.2)', 
                  color: '#E2725B', 
                  padding: '2px 8px', 
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontWeight: 'bold'
                }}>FOUNDER50</span>
              </p>
            </div>
          </div>
          <div style={{
            backgroundColor: '#E2725B',
            color: '#000',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            12 spots left
          </div>
        </div>

        {/* Employee Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
          gap: '24px' 
        }}>
          {employees.map((emp) => {
            const isLaunchEmployee = emp.name === 'amina' || emp.name === 'stan';
            const isComingSoon = emp.name === 'linda' || emp.name === 'penny';
            
            return (
              <div key={emp.id} style={{
                backgroundColor: emp.is_hired ? 'rgba(34, 197, 94, 0.1)' : 'rgba(26, 26, 36, 0.6)',
                border: `2px solid ${emp.is_hired ? '#22c55e' : isLaunchEmployee ? '#E2725B' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: '16px',
                padding: '28px',
                position: 'relative',
                transition: 'all 0.3s ease',
                opacity: isComingSoon ? 0.6 : 1,
                transform: isLaunchEmployee && !emp.is_hired ? 'scale(1.02)' : 'scale(1)',
                boxShadow: isLaunchEmployee && !emp.is_hired ? '0 4px 20px rgba(226, 114, 91, 0.1)' : 'none',
                backdropFilter: 'blur(10px)'
              }}>
                {/* Recommended Badge */}
                {isLaunchEmployee && !emp.is_hired && !isComingSoon && (
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    right: '20px',
                    backgroundColor: '#E2725B',
                    color: '#000',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Recommended
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '12px',
                      backgroundColor: emp.is_hired ? '#22c55e' : getChannelColor(emp.supported_channels),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '28px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                    }}>
                      {getChannelIcon(emp.supported_channels)}
                    </div>
                    <div>
                      <h3 style={{ 
                        margin: '0 0 4px 0', 
                        color: '#fff', 
                        fontSize: '22px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        {emp.display_name}
                        {emp.is_hired && (
                          <span style={{
                            backgroundColor: '#22c55e',
                            color: '#000',
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            verticalAlign: 'middle'
                          }}>
                            ACTIVE
                          </span>
                        )}
                      </h3>
                      <p style={{ margin: 0, color: '#666', fontSize: '14px', fontWeight: '500' }}>
                        {emp.employee_role}
                      </p>
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      fontSize: '32px', 
                      fontWeight: '800', 
                      color: '#fff',
                      lineHeight: '1'
                    }}>
                      ${emp.base_monthly_price / 100}
                    </div>
                    <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>per month</div>
                  </div>
                </div>

                <p style={{ 
                  margin: '0 0 20px 0', 
                  color: '#888', 
                  lineHeight: '1.6', 
                  fontSize: '15px',
                  minHeight: '48px'
                }}>
                  {emp.description}
                </p>

                {/* Capabilities */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
                  {emp.supported_channels.map((ch) => (
                    <span key={ch} style={{
                      backgroundColor: emp.is_hired ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255,255,255,0.05)',
                      color: emp.is_hired ? '#22c55e' : '#888',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      fontWeight: '600',
                      letterSpacing: '0.5px',
                      border: `1px solid ${emp.is_hired ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255,255,255,0.1)'}`
                    }}>
                      {ch}
                    </span>
                  ))}
                </div>

                {/* Action Button */}
                {emp.is_hired ? (
                  <button disabled style={{
                    width: '100%',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    color: '#22c55e',
                    border: '2px solid #22c55e',
                    padding: '14px',
                    borderRadius: '10px',
                    cursor: 'default',
                    fontWeight: 'bold',
                    fontSize: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}>
                    <Check size={18} /> Already Hired
                  </button>
                ) : (
                  <button 
                    onClick={() => isComingSoon ? null : initPayment(emp)}
                    disabled={!!hiring || isComingSoon}
                    style={{
                      width: '100%',
                      backgroundColor: isComingSoon ? 'rgba(255,255,255,0.05)' : '#E2725B',
                      color: isComingSoon ? '#444' : '#000',
                      border: 'none',
                      padding: '14px',
                      borderRadius: '10px',
                      cursor: isComingSoon ? 'not-allowed' : 'pointer',
                      fontWeight: 'bold',
                      fontSize: '15px',
                      transition: 'all 0.2s',
                      opacity: hiring === emp.name ? 0.7 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    {hiring === emp.name ? (
                      <>
                        <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                        Processing...
                      </>
                    ) : isComingSoon ? (
                      <><X size={18} /> Coming Next Week</>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        Hire {emp.display_name.split(' ')[0]}
                      </>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Payment Modal */}
        {showPaymentModal && selectedEmployee && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              backgroundColor: 'rgba(26, 26, 36, 0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '400px',
              width: '100%',
              boxShadow: '0 25px 100px rgba(0,0,0,0.5)'
            }}>
              <h2 style={{ margin: '0 0 8px 0', color: '#fff' }}>Hire {selectedEmployee.display_name}</h2>
              <p style={{ color: '#666', marginBottom: '24px' }}>
                You will be charged ${selectedEmployee.base_monthly_price / 100} monthly. 
                Cancel anytime.
              </p>

              <div style={{
                backgroundColor: 'rgba(255,255,255,0.03)',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '24px',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#666' }}>Monthly fee</span>
                  <span style={{ color: '#fff' }}>${selectedEmployee.base_monthly_price / 100}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <span style={{ color: '#fff', fontWeight: 'bold' }}>Total today</span>
                  <span style={{ color: '#E2725B', fontWeight: 'bold' }}>${selectedEmployee.base_monthly_price / 100}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  style={{
                    flex: 1,
                    padding: '14px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    backgroundColor: 'transparent',
                    color: '#fff',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={processPayment}
                  disabled={!!hiring}
                  style={{
                    flex: 2,
                    padding: '14px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#E2725B',
                    color: '#000',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '15px'
                  }}
                >
                  {hiring ? 'Processing...' : 'Pay with Paystack'}
                </button>
              </div>

              <p style={{ 
                marginTop: '16px', 
                fontSize: '12px', 
                color: '#444', 
                textAlign: 'center' 
              }}>
                🔒 Secured by Paystack. 128-bit SSL encryption.
              </p>
            </div>
          </div>
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

export default Team;