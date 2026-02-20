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
const react_router_dom_1 = require("react-router-dom");
const axios_1 = __importDefault(require("axios"));
const lucide_react_1 = require("lucide-react");
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const PaymentVerify = () => {
    const [searchParams] = (0, react_router_dom_1.useSearchParams)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [status, setStatus] = (0, react_1.useState)('loading');
    const [message, setMessage] = (0, react_1.useState)('Verifying your payment...');
    (0, react_1.useEffect)(() => {
        const reference = searchParams.get('reference');
        if (!reference) {
            setStatus('failed');
            setMessage('No payment reference found');
            return;
        }
        verifyPayment(reference);
    }, [searchParams]);
    const verifyPayment = async (reference) => {
        try {
            const token = localStorage.getItem('jwt');
            if (!token) {
                setStatus('failed');
                setMessage('Authentication required. Please login again.');
                return;
            }
            const res = await axios_1.default.get(`${API_URL}/api/payments/verify/${reference}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.status === 'success') {
                setStatus('success');
                setMessage('Payment successful! Your AI employee is now active.');
                setTimeout(() => {
                    navigate('/dashboard');
                }, 3000);
            }
            else {
                setStatus('failed');
                setMessage('Payment verification failed.');
            }
        }
        catch (err) {
            console.error('Payment verification error:', err);
            setStatus('failed');
            setMessage(err.response?.data?.error || 'Verification failed. Please try again.');
        }
    };
    return (<div style={{
            minHeight: '100vh',
            backgroundColor: '#0A0A0F',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px'
        }}>
      {status === 'loading' && (<>
          <lucide_react_1.Loader2 size={48} color="#E2725B" className="spin-animation"/>
          <h2 style={{ marginTop: '24px', fontSize: '24px' }}>Verifying Payment...</h2>
          <p style={{ color: '#666', marginTop: '8px' }}>{message}</p>
        </>)}

      {status === 'success' && (<>
          <lucide_react_1.CheckCircle size={64} color="#22c55e"/>
          <h2 style={{ marginTop: '24px', fontSize: '24px', color: '#22c55e' }}>Payment Successful!</h2>
          <p style={{ color: '#666', marginTop: '8px' }}>{message}</p>
          <p style={{ color: '#888', marginTop: '16px', fontSize: '14px' }}>
            Redirecting to dashboard...
          </p>
        </>)}

      {status === 'failed' && (<>
          <lucide_react_1.XCircle size={64} color="#ef4444"/>
          <h2 style={{ marginTop: '24px', fontSize: '24px', color: '#ef4444' }}>Payment Failed</h2>
          <p style={{ color: '#666', marginTop: '8px' }}>{message}</p>
          <button onClick={() => navigate('/team')} style={{
                marginTop: '24px',
                padding: '12px 24px',
                backgroundColor: '#E2725B',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px'
            }}>
            Back to Team
          </button>
        </>)}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin-animation {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>);
};
exports.default = PaymentVerify;
//# sourceMappingURL=PaymentVerify.js.map