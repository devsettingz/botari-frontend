"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const axios_1 = __importDefault(require("axios"));
const react_router_dom_1 = require("react-router-dom");
const lucide_react_1 = require("lucide-react"); // FIXED: Removed unused MessageCircle
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const Conversations = () => {
    const [conversations, setConversations] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const token = localStorage.getItem('jwt');
    const navigate = (0, react_router_dom_1.useNavigate)();
    (0, react_1.useEffect)(() => {
        fetchConversations();
    }, []);
    const fetchConversations = async () => {
        try {
            const res = await axios_1.default.get(`${API_URL}/api/conversations/list`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setConversations(res.data);
        }
        catch (err) {
            console.error('Failed to load conversations:', err);
        }
        finally {
            setLoading(false);
        }
    };
    const getStatusColor = (status) => {
        return status === 'open' ? '#22c55e' : '#666';
    };
    if (loading)
        return (<div style={{
                minHeight: '100vh',
                backgroundColor: '#0A0A0F',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '16px'
            }}>
      <div style={{
                border: '3px solid #333',
                borderTop: '3px solid #E2725B',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                animation: 'spin 1s linear infinite'
            }}/>
      <p>Loading conversations...</p>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>);
    return (<div style={{
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
        }}/>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '40px',
            fontWeight: 700,
            margin: '0 0 8px 0',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #A0A0B0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
        }}>
            Conversations
          </h1>
          <p style={{ color: '#666', fontSize: '16px' }}>
            All WhatsApp chats handled by your Botari AI team
          </p>
        </div>

        {conversations.length === 0 ? (<div style={{
                backgroundColor: 'rgba(26, 26, 36, 0.5)',
                border: '2px dashed rgba(255,255,255,0.1)',
                borderRadius: '20px',
                padding: '80px 40px',
                textAlign: 'center'
            }}>
            <div style={{ fontSize: '60px', marginBottom: '24px' }}>💬</div>
            <h3 style={{
                fontSize: '24px',
                fontWeight: 600,
                color: '#fff',
                margin: '0 0 12px 0'
            }}>
              No conversations yet
            </h3>
            <p style={{
                color: '#666',
                fontSize: '16px',
                maxWidth: '400px',
                margin: '0 auto 32px',
                lineHeight: '1.6'
            }}>
              Once you hire <span style={{ color: '#E2725B', fontWeight: 600 }}>Amina</span> and connect your WhatsApp, customer chats will appear here automatically.
            </p>
            <button onClick={() => navigate('/team')} style={{
                padding: '16px 32px',
                background: 'linear-gradient(135deg, #E2725B 0%, #FF8E53 100%)',
                border: 'none',
                borderRadius: '12px',
                color: '#000',
                fontWeight: 600,
                fontSize: '16px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                boxShadow: '0 8px 32px rgba(226, 114, 91, 0.3)'
            }}>
              Hire Amina Now
              <lucide_react_1.ArrowRight size={18}/>
            </button>
          </div>) : (<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {conversations.map((conv) => (<div key={conv.id} style={{
                    backgroundColor: 'rgba(26, 26, 36, 0.5)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '16px',
                    padding: '20px 24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'transform 0.2s',
                    cursor: 'pointer'
                }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}>
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
                    {conv.employee_name && (<span style={{
                        color: '#E2725B',
                        fontSize: '12px',
                        backgroundColor: 'rgba(226, 114, 91, 0.1)',
                        padding: '4px 8px',
                        borderRadius: '4px'
                    }}>
                        🤖 {conv.employee_name}
                      </span>)}
                  </div>
                  
                  <p style={{ margin: '0 0 4px 0', color: '#666', fontSize: '14px' }}>
                    {conv.customer_phone}
                  </p>
                  
                  {conv.preview && (<p style={{
                        margin: '8px 0 0 0',
                        color: '#888',
                        fontSize: '13px',
                        fontStyle: 'italic'
                    }}>
                      "{conv.preview.substring(0, 60)}..."
                    </p>)}
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
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    transition: 'all 0.2s'
                }} onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#E2725B';
                    e.currentTarget.style.borderColor = '#E2725B';
                    e.currentTarget.style.color = '#000';
                }} onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                    e.currentTarget.style.color = '#fff';
                }}>
                    View Chat
                  </button>
                </div>
              </div>))}
          </div>)}
      </div>
    </div>);
};
exports.default = Conversations;
//# sourceMappingURL=Conversations.js.map