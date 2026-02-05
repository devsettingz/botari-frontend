import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Users, LogOut, Plus, CreditCard } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const Dashboard: React.FC = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPayments, setShowPayments] = useState(false);
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
      // Fetch team
      const teamRes = await axios.get(`${API_URL}/api/employees/my-team`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('EMPLOYEES LOADED:', teamRes.data);
      setEmployees(teamRes.data || []);

      // Fetch payments
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

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) {
    return <div style={{padding: 50, color: 'white', textAlign: 'center', background: '#0A0A0F', minHeight: '100vh'}}>Loading...</div>;
  }

  return (
    <div style={{minHeight: '100vh', background: '#0A0A0F', color: 'white', padding: '32px'}}>
      
      {/* Header */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px'}}>
        <h1 style={{margin: 0, fontSize: '32px'}}>Dashboard</h1>
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

      {/* CRITICAL SECTION: Show Hired Employees */}
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
          <h2 style={{marginBottom: '20px'}}>Your AI Team ({employees.length})</h2>
          <div style={{display: 'grid', gap: '16px'}}>
            {employees.map((emp: any) => (
              <div key={emp.id} style={{background: 'rgba(255,255,255,0.05)', padding: '24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                  <div style={{
                    width: '50px', 
                    height: '50px', 
                    borderRadius: '50%', 
                    background: emp.avatar_url ? 'transparent' : '#E2725B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    overflow: 'hidden'
                  }}>
                    {emp.avatar_url ? (
                      <img src={emp.avatar_url} style={{width: '100%', height: '100%', objectFit: 'cover'}} alt="" />
                    ) : (
                      <Users size={24} />
                    )}
                  </div>
                  <div style={{flex: 1}}>
                    <h3 style={{margin: 0, fontSize: '20px'}}>{emp.display_name}</h3>
                    <p style={{margin: '4px 0', color: '#888', fontSize: '14px'}}>{emp.employee_role}</p>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      background: emp.connection_status === 'connected' ? 'rgba(74,222,128,0.2)' : 'rgba(243,156,18,0.2)',
                      color: emp.connection_status === 'connected' ? '#4ADE80' : '#F39C12'
                    }}>
                      {emp.connection_status === 'connected' ? '✅ Connected' : '⏳ Setup Required'}
                    </span>
                  </div>
                </div>
                
                {emp.connection_status !== 'connected' && (
                  <button style={{...primaryBtnStyle, width: '100%', marginTop: '16px'}}>
                    Connect WhatsApp
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
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
  color: 'black',
  fontWeight: 'bold',
  border: 'none'
};

export default Dashboard;