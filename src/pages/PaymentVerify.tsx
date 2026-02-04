import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const PaymentVerify: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('Verifying your payment...');

  useEffect(() => {
    const reference = searchParams.get('reference');
    
    if (!reference) {
      setStatus('failed');
      setMessage('No payment reference found');
      return;
    }

    verifyPayment(reference);
  }, [searchParams]);

  const verifyPayment = async (reference: string) => {
    try {
      const token = localStorage.getItem('jwt');
      if (!token) {
        setStatus('failed');
        setMessage('Authentication required. Please login again.');
        return;
      }

      const res = await axios.get(`${API_URL}/api/payments/verify/${reference}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.status === 'success') {
        setStatus('success');
        setMessage('Payment successful! Your AI employee is now active.');
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } else {
        setStatus('failed');
        setMessage('Payment verification failed.');
      }
    } catch (err: any) {
      console.error('Payment verification error:', err);
      setStatus('failed');
      setMessage(err.response?.data?.error || 'Verification failed. Please try again.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0A0A0F',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px'
    }}>
      {status === 'loading' && (
        <>
          <Loader2 size={48} color="#E2725B" className="spin-animation" />
          <h2 style={{ marginTop: '24px', fontSize: '24px' }}>Verifying Payment...</h2>
          <p style={{ color: '#666', marginTop: '8px' }}>{message}</p>
        </>
      )}

      {status === 'success' && (
        <>
          <CheckCircle size={64} color="#22c55e" />
          <h2 style={{ marginTop: '24px', fontSize: '24px', color: '#22c55e' }}>Payment Successful!</h2>
          <p style={{ color: '#666', marginTop: '8px' }}>{message}</p>
          <p style={{ color: '#888', marginTop: '16px', fontSize: '14px' }}>
            Redirecting to dashboard...
          </p>
        </>
      )}

      {status === 'failed' && (
        <>
          <XCircle size={64} color="#ef4444" />
          <h2 style={{ marginTop: '24px', fontSize: '24px', color: '#ef4444' }}>Payment Failed</h2>
          <p style={{ color: '#666', marginTop: '8px' }}>{message}</p>
          <button
            onClick={() => navigate('/team')}
            style={{
              marginTop: '24px',
              padding: '12px 24px',
              backgroundColor: '#E2725B',
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px'
            }}
          >
            Back to Team
          </button>
        </>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin-animation {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default PaymentVerify;