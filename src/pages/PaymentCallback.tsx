import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

const PaymentCallback: React.FC = () => {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing payment...');
  const navigate = useNavigate();

  useEffect(() => {
    completeHiring();
  }, []);

  const completeHiring = async () => {
    try {
      const token = localStorage.getItem('jwt') || localStorage.getItem('token');
      const employeeId = localStorage.getItem('pending_hire_employee_id');
      const employeeName = localStorage.getItem('pending_hire_employee_name') || 'Amina';
      
      if (!token) {
        setStatus('error');
        setMessage('Authentication failed. Please login again.');
        return;
      }

      if (!employeeId) {
        // No pending hire, just redirect
        navigate('/dashboard');
        return;
      }

      setMessage(`Activating ${employeeName}...`);
      
      // CRITICAL: Call the hire endpoint to add employee to business
      const response = await axios.post(`${API_URL}/api/employees/hire`, {
        employee_id: parseInt(employeeId)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        // Clear pending hire
        localStorage.removeItem('pending_hire_employee_id');
        localStorage.removeItem('pending_hire_employee_name');
        
        setStatus('success');
        setMessage(`${employeeName} has been added to your team!`);
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        throw new Error('Hiring failed');
      }
      
    } catch (err: any) {
      console.error('Error completing hire:', err);
      setStatus('error');
      setMessage(err.response?.data?.error || 'Failed to activate employee. Contact support.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0A0A0F',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px',
      textAlign: 'center'
    }}>
      {status === 'processing' && (
        <>
          <Loader2 size={48} style={{ animation: 'spin 1s linear infinite', marginBottom: '20px', color: '#E2725B' }} />
          <h2 style={{ margin: 0, marginBottom: '8px' }}>Completing Setup...</h2>
          <p style={{ color: '#888' }}>{message}</p>
        </>
      )}
      
      {status === 'success' && (
        <>
          <CheckCircle size={48} style={{ marginBottom: '20px', color: '#4ADE80' }} />
          <h2 style={{ margin: 0, marginBottom: '8px' }}>Payment Successful!</h2>
          <p style={{ color: '#888' }}>{message}</p>
          <p style={{ color: '#666', fontSize: '14px', marginTop: '20px' }}>Redirecting to dashboard...</p>
        </>
      )}
      
      {status === 'error' && (
        <>
          <XCircle size={48} style={{ marginBottom: '20px', color: '#EF4444' }} />
          <h2 style={{ margin: 0, marginBottom: '8px' }}>Setup Incomplete</h2>
          <p style={{ color: '#888' }}>{message}</p>
          <button 
            onClick={() => navigate('/dashboard')}
            style={{
              marginTop: '20px',
              padding: '12px 24px',
              backgroundColor: '#E2725B',
              color: 'black',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Go to Dashboard
          </button>
        </>
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

export default PaymentCallback;