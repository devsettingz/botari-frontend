import React, { useState } from 'react';
import CallForm from '../components/CallForm';

const Calls: React.FC = () => {
  const [status, setStatus] = useState<string | null>(null);

  const handleCallSubmit = async (to: string, text: string, voice: 'male' | 'female') => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/api/calls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Optional auth
          // 'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        },
        body: JSON.stringify({ to, text, voice }),
      });

      const data = await response.json();
      if (response.ok) {
        setStatus(`✅ Call placed successfully: ${JSON.stringify(data.result)}`);
      } else {
        setStatus(`❌ Error: ${data.error}`);
      }
    } catch (err: any) {
      setStatus(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Voice Calls</h2>
      <p>Trigger a voice call with Botari AI using Vonage TTS.</p>
      <CallForm onSubmit={handleCallSubmit} />
      {status && (
        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f8d7da', color: '#721c24' }}>
          {status}
        </div>
      )}
    </div>
  );
};

export default Calls;
