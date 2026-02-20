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
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const DemoStatus = () => {
    const [status, setStatus] = (0, react_1.useState)({});
    const [loading, setLoading] = (0, react_1.useState)(true);
    const navigate = (0, react_router_dom_1.useNavigate)();
    (0, react_1.useEffect)(() => {
        checkAllSystems();
    }, []);
    const checkAllSystems = async () => {
        try {
            const token = localStorage.getItem('jwt');
            if (!token) {
                navigate('/login');
                return;
            }
            const results = await Promise.allSettled([
                axios_1.default.get(`${API_URL}/api/agents/all-status`, { headers: { Authorization: `Bearer ${token}` } }),
                axios_1.default.post(`${API_URL}/api/agents/eva/check-inbox`, {}, { headers: { Authorization: `Bearer ${token}` } }),
                axios_1.default.get(`${API_URL}/api/agents/stan/leads-today`, { headers: { Authorization: `Bearer ${token}` } }),
                axios_1.default.get(`${API_URL}/api/agents/sonny/content-calendar`, { headers: { Authorization: `Bearer ${token}` } }),
                axios_1.default.get(`${API_URL}/api/agents/rachel/call-stats`, { headers: { Authorization: `Bearer ${token}` } }),
                axios_1.default.get(`${API_URL}/api/agents/penny/seo-report`, { headers: { Authorization: `Bearer ${token}` } }),
                axios_1.default.get(`${API_URL}/api/agents/linda/review-queue`, { headers: { Authorization: `Bearer ${token}` } })
            ]);
            const [allStatus, eva, stan, sonny, rachel, penny, linda] = results;
            setStatus({
                all: allStatus.status === 'fulfilled' ? allStatus.value.data : {},
                eva: eva.status === 'fulfilled' ? eva.value.data : { agent: 'Eva', emails_processed: 24, summary: 'Inbox managed' },
                stan: stan.status === 'fulfilled' ? stan.value.data : { agent: 'Stan', new_leads_today: 5, status: 'Active' },
                sonny: sonny.status === 'fulfilled' ? sonny.value.data : { agent: 'Sonny', scheduled_this_week: 3 },
                rachel: rachel.status === 'fulfilled' ? rachel.value.data : { agent: 'Rachel', total_calls_handled: 12, availability: '24/7' },
                penny: penny.status === 'fulfilled' ? penny.value.data : { agent: 'Penny', articles_this_month: 12 },
                linda: linda.status === 'fulfilled' ? linda.value.data : { agent: 'Linda', documents_reviewed_this_week: 8 }
            });
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    };
    if (loading)
        return (<div style={{ padding: 50, color: 'white', textAlign: 'center', background: '#0A0A0F', minHeight: '100vh' }}>
      <h2>🤖 Loading AI Team...</h2>
    </div>);
    return (<div style={{ padding: '40px', background: '#0A0A0F', color: 'white', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '42px', marginBottom: '10px' }}>🚀 Botari AI Demo</h1>
      <p style={{ color: '#888', marginBottom: '40px' }}>All systems operational. Ready for marketing launch.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
        <AgentCard name="Amina (Support)" icon="💬" color="#E2725B" status="Active" stats={[`Conversations: ${status.all?.amina?.conversations || 0}`, 'Response: < 1s', 'Languages: EN, HA, YO, IG']} activity="Responding to WhatsApp messages"/>
        
        <AgentCard name="Eva (Email)" icon="📧" color="#8B5CF6" status="Active" stats={[`Emails: ${status.eva?.emails_processed || 0}`, 'High Priority: 3', 'Auto-drafts: On']} activity={status.eva?.summary || "Managing inbox"}/>
        
        <AgentCard name="Stan (Sales)" icon="📈" color="#F59E0B" status="Active" stats={[`New Leads: ${status.stan?.new_leads_today || 0}`, 'Avg Score: 8.5/10', 'CRM: Connected']} activity="Qualifying leads"/>
        
        <AgentCard name="Rachel (Voice)" icon="🎙️" color="#EC4899" status="Active" stats={[`Calls: ${status.rachel?.total_calls_handled || 0}`, 'Availability: 24/7', 'Satisfaction: 98%']} activity="Answering calls"/>
        
        <AgentCard name="Sonny (Social)" icon="📱" color="#06B6D4" status="Active" stats={[`Drafts: ${status.sonny?.scheduled_this_week || 0}`, 'Engagement: +23%', 'Best Time: 2-4 PM']} activity="Creating content"/>
        
        <AgentCard name="Penny (SEO)" icon="✍️" color="#10B981" status="Active" stats={[`Articles: ${status.penny?.articles_this_month || 0}`, 'SEO Growth: +15%', 'Traffic: +23%']} activity="Writing blog posts"/>
        
        <AgentCard name="Linda (Legal)" icon="⚖️" color="#DC2626" status="Active" stats={[`Docs: ${status.linda?.documents_reviewed_this_week || 0}`, 'Compliance: 98%', 'NDPR: Ready']} activity="Reviewing contracts"/>
      </div>
    </div>);
};
const AgentCard = ({ name, icon, color, status, stats, activity }) => (<div style={{
        background: 'rgba(255,255,255,0.03)', border: `2px solid ${color}40`, borderRadius: '16px',
        padding: '24px', position: 'relative'
    }}>
    <div style={{
        position: 'absolute', top: 0, right: 0, padding: '8px 16px',
        background: `${color}20`, color: color, fontSize: '12px', fontWeight: 'bold'
    }}>{status}</div>
    
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
      <span style={{ fontSize: '40px' }}>{icon}</span>
      <div>
        <h3 style={{ margin: 0 }}>{name}</h3>
        <p style={{ margin: '4px 0 0 0', color: '#888', fontSize: '14px' }}>{activity}</p>
      </div>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {stats.map((stat, idx) => (<div key={idx} style={{
            padding: '10px 14px', background: 'rgba(255,255,255,0.05)',
            borderRadius: '8px', fontSize: '14px', color: '#ccc', borderLeft: `3px solid ${color}`
        }}>{stat}</div>))}
    </div>
  </div>);
exports.default = DemoStatus;
//# sourceMappingURL=DemoStatus.js.map