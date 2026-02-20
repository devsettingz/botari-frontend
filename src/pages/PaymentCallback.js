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
const lucide_react_1 = require("lucide-react");
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const PaymentCallback = () => {
    const [status, setStatus] = (0, react_1.useState)('processing');
    const [message, setMessage] = (0, react_1.useState)('Processing payment...');
    const navigate = (0, react_router_dom_1.useNavigate)();
    (0, react_1.useEffect)(() => {
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
            const response = await axios_1.default.post(`${API_URL}/api/employees/hire`, {
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
            }
            else {
                throw new Error('Hiring failed');
            }
        }
        catch (err) {
            console.error('Error completing hire:', err);
            setStatus('error');
            setMessage(err.response?.data?.error || 'Failed to activate employee. Contact support.');
        }
    };
    return (<div style={{
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
      {status === 'processing' && (<>
          <lucide_react_1.Loader2 size={48} style={{ animation: 'spin 1s linear infinite', marginBottom: '20px', color: '#E2725B' }}/>
          <h2 style={{ margin: 0, marginBottom: '8px' }}>Completing Setup...</h2>
          <p style={{ color: '#888' }}>{message}</p>
        </>)}
      
      {status === 'success' && (<>
          <lucide_react_1.CheckCircle size={48} style={{ marginBottom: '20px', color: '#4ADE80' }}/>
          <h2 style={{ margin: 0, marginBottom: '8px' }}>Payment Successful!</h2>
          <p style={{ color: '#888' }}>{message}</p>
          <p style={{ color: '#666', fontSize: '14px', marginTop: '20px' }}>Redirecting to dashboard...</p>
        </>)}
      
      {status === 'error' && (<>
          <lucide_react_1.XCircle size={48} style={{ marginBottom: '20px', color: '#EF4444' }}/>
          <h2 style={{ margin: 0, marginBottom: '8px' }}>Setup Incomplete</h2>
          <p style={{ color: '#888' }}>{message}</p>
          <button onClick={() => navigate('/dashboard')} style={{
                marginTop: '20px',
                padding: '12px 24px',
                backgroundColor: '#E2725B',
                color: 'black',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
            }}>
            Go to Dashboard
          </button>
        </>)}
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>);
};
exports.default = PaymentCallback;
//# sourceMappingURL=PaymentCallback.js.map