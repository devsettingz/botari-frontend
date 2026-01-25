import React, { useState } from 'react';

interface CallFormProps {
  onSubmit: (to: string, text: string, voice: 'male' | 'female') => void;
}

const CallForm: React.FC<CallFormProps> = ({ onSubmit }) => {
  const [to, setTo] = useState('');
  const [text, setText] = useState('');
  const [voice, setVoice] = useState<'male' | 'female'>('male');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(to, text, voice);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1rem' }}>
        <label>Phone Number</label>
        <input
          type="text"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="+233XXXXXXXXX"
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Message</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter message to speak"
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Voice</label>
        <select
          value={voice}
          onChange={(e) => setVoice(e.target.value as 'male' | 'female')}
          style={{ width: '100%', padding: '0.5rem' }}
        >
          <option value="male">Male Voice</option>
          <option value="female">Female Voice</option>
        </select>
      </div>

      <button
        type="submit"
        style={{
          background: '#007bff',
          color: '#fff',
          padding: '0.75rem',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          width: '100%',
        }}
      >
        Make Call
      </button>
    </form>
  );
};

export default CallForm;
