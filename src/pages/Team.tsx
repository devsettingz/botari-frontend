import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
      // Initialize Paystack transaction
      const paymentRes = await axios.post(`${API_URL}/api/payments/initialize`, {
        employee_id: selectedEmployee.id,
        amount: selectedEmployee.base_monthly_price,
        email: localStorage.getItem('user_email') || 'user@business.com'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // If Paystack returns an authorization URL, redirect to it
      if (paymentRes.data.authorization_url) {
        window.location.href = paymentRes.data.authorization_url;
        return;
      }

      // Fallback: Direct hire (for testing without Paystack)
      await completeHiring(selectedEmployee);
      
    } catch (err: any) {
      alert(err.response?.data?.error || 'Payment initialization failed');
      setHiring(null);
    }
  };

  const completeHiring = async (employee: Employee) => {
    try {
      let channel = 'whatsapp';
      if (employee.name === 'stan') channel = 'email';
      if (employee.name === 'rachel') channel = 'voice';
      
      await axios.post(`${API_URL}/api/employees/hire`, 
        { employeeName: employee.name, channelType: channel },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      alert(`🎉 ${employee.display_name} has joined your team!`);
      setShowPaymentModal(false);
      fetchTeam();
      navigate('/dashboard'); // Redirect to connect WhatsApp
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
      color: 'white', 
      padding: 40, 
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
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
    <div style={{ padding: '2rem', maxWidth: '1200px' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ margin: '0 0 12px 0', fontSize: '42px', color: '#fff', fontWeight: '800' }}>
          Hire Your AI Team
        </h1>
        <p style={{ color: '#888', fontSize: '18px', maxWidth: '600px', lineHeight: '1.6' }}>
          Specialized AI employees for African businesses. 
          Start with <strong style={{color: '#E2725B'}}>Amina</strong> for WhatsApp sales, 
          then scale with specialists.
        </p>
      </div>

      {/* Launch Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(226, 114, 91, 0.15) 0%, rgba(226, 114, 91, 0.05) 100%)',
        border: '1px solid rgba(226, 114, 91, 0.3)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '40px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
      }}>
        <span style={{ fontSize: '40px' }}>🚀</span>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 6px 0', color: '#E2725B', fontSize: '20px' }}>Thursday Launch Special</h3>
          <p style={{ margin: 0, color: '#aaa', fontSize: '15px', lineHeight: '1.5' }}>
            First 50 businesses get <strong>50% OFF</strong> first month. 
            Use code <span style={{ 
              backgroundColor: 'rgba(226, 114, 91, 0.2)', 
              color: '#E2725B', 
              padding: '2px 8px', 
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontWeight: 'bold'
            }}>FOUNDER50</span>
          </p>
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
              backgroundColor: emp.is_hired ? '#0a1f0a' : '#111',
              border: `2px solid ${emp.is_hired ? '#22c55e' : isLaunchEmployee ? '#E2725B' : '#222'}`,
              borderRadius: '16px',
              padding: '28px',
              position: 'relative',
              transition: 'all 0.3s ease',
              opacity: isComingSoon ? 0.6 : 1,
              transform: isLaunchEmployee && !emp.is_hired ? 'scale(1.02)' : 'scale(1)',
              boxShadow: isLaunchEmployee && !emp.is_hired ? '0 4px 20px rgba(226, 114, 91, 0.1)' : 'none'
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
                    backgroundColor: emp.is_hired ? '#1a3a1a' : '#1a1a1a',
                    color: emp.is_hired ? '#22c55e' : '#666',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    fontWeight: '600',
                    letterSpacing: '0.5px',
                    border: `1px solid ${emp.is_hired ? '#2a5a2a' : '#333'}`
                  }}>
                    {ch}
                  </span>
                ))}
              </div>

              {/* Action Button */}
              {emp.is_hired ? (
                <button disabled style={{
                  width: '100%',
                  backgroundColor: '#0f2f0f',
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
                  <span>✓</span> Already Hired
                </button>
              ) : (
                <button 
                  onClick={() => isComingSoon ? null : initPayment(emp)}
                  disabled={!!hiring || isComingSoon}
                  style={{
                    width: '100%',
                    backgroundColor: isComingSoon ? '#1a1a1a' : '#E2725B',
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
                      <span className="spinner" style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid #000',
                        borderTop: '2px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite'
                      }} />
                      Processing...
                    </>
                  ) : isComingSoon ? (
                    <>🔒 Coming Next Week</>
                  ) : (
                    <>Hire {emp.display_name.split(' ')[0]}</>
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Help Section */}
      <div style={{
        marginTop: '48px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px'
      }}>
        <div style={{
          backgroundColor: '#0f0f0f',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #222'
        }}>
          <h4 style={{ margin: '0 0 12px 0', color: '#E2725B', fontSize: '16px' }}>
            💡 Which one should I pick?
          </h4>
          <p style={{ margin: 0, color: '#666', fontSize: '14px', lineHeight: '1.7' }}>
            <strong style={{ color: '#fff' }}>Start with Amina ($49)</strong> if you get customer inquiries on WhatsApp. 
            She answers questions, qualifies leads, and takes orders 24/7 in English, Swahili, or Pidgin.
          </p>
        </div>

        <div style={{
          backgroundColor: '#0f0f0f',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #222'
        }}>
          <h4 style={{ margin: '0 0 12px 0', color: '#E2725B', fontSize: '16px' }}>
            🚀 Launch Day Special
          </h4>
          <p style={{ margin: 0, color: '#666', fontSize: '14px', lineHeight: '1.7' }}>
            Use code <strong style={{ color: '#fff', fontFamily: 'monospace' }}>FOUNDER50</strong> at checkout 
            for 50% off your first month. Valid for the next 48 hours only.
          </p>
        </div>
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
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '400px',
            width: '100%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
          }}>
            <h2 style={{ margin: '0 0 8px 0', color: '#fff' }}>Hire {selectedEmployee.display_name}</h2>
            <p style={{ color: '#666', marginBottom: '24px' }}>
              You will be charged ${selectedEmployee.base_monthly_price / 100} monthly. 
              Cancel anytime.
            </p>

            <div style={{
              backgroundColor: '#0f0f0f',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '24px',
              border: '1px solid #333'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#666' }}>Monthly fee</span>
                <span style={{ color: '#fff' }}>${selectedEmployee.base_monthly_price / 100}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid #333' }}>
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
                  border: '1px solid #333',
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
  );
};

export default Team;