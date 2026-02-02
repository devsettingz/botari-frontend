import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

interface Conversation {
  id: number;
  customer_name: string;
  customer_phone: string;
  status: 'open' | 'closed';
  last_message_at: string;
  employee_name?: string;
  preview?: string;
}

const Conversations: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('jwt');

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/conversations/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversations(res.data);
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'open' ? '#22c55e' : '#666';
  };

  if (loading) return (
    <div style={{ color: '#fff', padding: '40px', textAlign: 'center' }}>
      Loading conversations...
    </div>
  );

  return (
    <div>
      <h1 style={{ margin: '0 0 8px 0', fontSize: '32px' }}>Conversations</h1>
      <p style={{ color: '#888', marginBottom: '32px' }}>
        All WhatsApp chats handled by your Botari AI team
      </p>

      {conversations.length === 0 ? (
        <div style={{
          backgroundColor: '#1a1a1a',
          border: '2px dashed #333',
          borderRadius: '12px',
          padding: '60px 40px',
          textAlign: 'center',
          color: '#666'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
          <h3 style={{ color: '#fff', marginBottom: '8px' }}>No conversations yet</h3>
          <p style={{ maxWidth: '400px', margin: '0 auto', lineHeight: '1.6' }}>
            Once you hire <strong style={{ color: '#E2725B' }}>Amina</strong> and connect your WhatsApp, 
            customer chats will appear here automatically.
          </p>
          <a 
            href="/team" 
            style={{
              display: 'inline-block',
              marginTop: '20px',
              backgroundColor: '#E2725B',
              color: '#000',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            Hire Amina Now →
          </a>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {conversations.map((conv) => (
            <div key={conv.id} style={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transition: 'transform 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
            >
              <div style={{ flex: 1 }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  marginBottom: '8px' 
                }}>
                  <h3 style={{ margin: 0, color: '#fff', fontSize: '18px' }}>
                    {conv.customer_name || 'Unknown Customer'}
                  </h3>
                  <span style={{
                    backgroundColor: getStatusColor(conv.status),
                    color: '#000',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}>
                    {conv.status}
                  </span>
                  {conv.employee_name && (
                    <span style={{ 
                      color: '#E2725B', 
                      fontSize: '12px',
                      backgroundColor: 'rgba(226, 114, 91, 0.1)',
                      padding: '4px 8px',
                      borderRadius: '4px'
                    }}>
                      🤖 {conv.employee_name}
                    </span>
                  )}
                </div>
                
                <p style={{ margin: '0 0 4px 0', color: '#666', fontSize: '14px' }}>
                  {conv.customer_phone}
                </p>
                
                {conv.preview && (
                  <p style={{ 
                    margin: '8px 0 0 0', 
                    color: '#888', 
                    fontSize: '13px',
                    fontStyle: 'italic'
                  }}>
                    "{conv.preview.substring(0, 60)}..."
                  </p>
                )}
              </div>
              
              <div style={{ textAlign: 'right', marginLeft: '20px' }}>
                <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '12px' }}>
                  {new Date(conv.last_message_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                <button style={{
                  backgroundColor: 'transparent',
                  border: '1px solid #444',
                  color: '#fff',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#E2725B';
                  e.currentTarget.style.borderColor = '#E2725B';
                  e.currentTarget.style.color = '#000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = '#444';
                  e.currentTarget.style.color = '#fff';
                }}
                >
                  View Chat
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Conversations;