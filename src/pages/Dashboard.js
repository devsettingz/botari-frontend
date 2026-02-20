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
const Dashboard = () => {
    const [employees, setEmployees] = (0, react_1.useState)([]);
    const [payments, setPayments] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [showPayments, setShowPayments] = (0, react_1.useState)(false);
    const [selectedEmployee, setSelectedEmployee] = (0, react_1.useState)(null);
    const [showAgentModal, setShowAgentModal] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)('');
    const navigate = (0, react_router_dom_1.useNavigate)();
    (0, react_1.useEffect)(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        const token = localStorage.getItem('jwt') || localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            const teamRes = await axios_1.default.get(`${API_URL}/api/employees/my-team`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Team data:', teamRes.data);
            setEmployees(teamRes.data || []);
            const payRes = await axios_1.default.get(`${API_URL}/api/employees/payments/history`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPayments(payRes.data || []);
        }
        catch (err) {
            console.error('Error:', err);
            setError('Failed to load your AI team');
        }
        finally {
            setLoading(false);
        }
    };
    // Get icon based on employee role
    const getAgentIcon = (role, size = 24) => {
        if (role?.includes('Support'))
            return <lucide_react_1.MessageSquare size={size}/>;
        if (role?.includes('Assistant'))
            return <lucide_react_1.Mail size={size}/>;
        if (role?.includes('Sales'))
            return <lucide_react_1.TrendingUp size={size}/>;
        if (role?.includes('Receptionist') || role?.includes('Voice'))
            return <lucide_react_1.Headphones size={size}/>;
        if (role?.includes('Social'))
            return <lucide_react_1.Share2 size={size}/>;
        if (role?.includes('Content') || role?.includes('SEO'))
            return <lucide_react_1.FileText size={size}/>;
        if (role?.includes('Legal'))
            return <lucide_react_1.Shield size={size}/>;
        return <lucide_react_1.Users size={size}/>;
    };
    // Get gradient based on tier
    const getTierGradient = (tier) => {
        switch (tier) {
            case 'enterprise': return 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)';
            case 'premium': return 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)';
            case 'professional': return 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)';
            case 'starter': return 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
            default: return 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)';
        }
    };
    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };
    const openAgentDetails = (emp) => {
        setSelectedEmployee(emp);
        setShowAgentModal(true);
    };
    // Calculate total monthly cost
    const totalMonthlyCost = employees.reduce((sum, emp) => sum + (emp.price_monthly || 0), 0);
    if (loading) {
        return (<div style={{ padding: 50, color: 'white', textAlign: 'center', background: '#0A0A0F', minHeight: '100vh' }}>
        <div style={{ fontSize: '24px', marginBottom: '16px' }}>🤖</div>
        Loading your AI team...
      </div>);
    }
    if (error) {
        return (<div style={{ padding: 50, color: 'white', textAlign: 'center', background: '#0A0A0F', minHeight: '100vh' }}>
        <lucide_react_1.AlertCircle size={48} color="#E2725B" style={{ marginBottom: '16px' }}/>
        <h3>{error}</h3>
        <button onClick={fetchData} style={{ ...primaryBtnStyle, marginTop: '20px' }}>
          Retry
        </button>
      </div>);
    }
    return (<div style={{ minHeight: '100vh', background: '#0A0A0F', color: 'white', padding: '32px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>Dashboard</h1>
          <p style={{ color: '#666', marginTop: '4px' }}>Manage your AI workforce</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setShowPayments(!showPayments)} style={btnStyle}>
            <lucide_react_1.CreditCard size={18}/> {showPayments ? 'Hide' : 'Payments'}
          </button>
          <button onClick={() => navigate('/team')} style={primaryBtnStyle}>
            <lucide_react_1.Plus size={18}/> Hire Employee
          </button>
          <button onClick={handleLogout} style={btnStyle}>
            <lucide_react_1.LogOut size={18}/>
          </button>
        </div>
      </div>

      {/* Trial Status - NOW CLICKABLE */}
      <div onClick={() => navigate('/team')} style={{
            background: 'linear-gradient(135deg, rgba(226,114,91,0.2) 0%, rgba(226,114,91,0.05) 100%)',
            border: '2px solid rgba(226,114,91,0.5)',
            padding: '20px 24px',
            borderRadius: '16px',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 4px 20px rgba(226,114,91,0.1)'
        }} onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(226,114,91,0.2)';
        }} onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(226,114,91,0.1)';
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'rgba(226,114,91,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <lucide_react_1.Clock size={24} style={{ color: '#E2725B' }}/>
          </div>
          <div>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '18px' }}>7 days left on trial</h3>
            <p style={{ margin: 0, color: '#888', fontSize: '14px' }}>Click to upgrade and unlock full features</p>
          </div>
        </div>
        <button style={{
            padding: '12px 24px',
            background: '#E2725B',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '16px'
        }}>
          Upgrade Now <lucide_react_1.ArrowRight size={18}/>
        </button>
      </div>

      {/* Payments Section */}
      {showPayments && (<div style={{ background: 'rgba(255,255,255,0.05)', padding: '24px', borderRadius: '12px', marginBottom: '32px' }}>
          <h2>Payment History</h2>
          {payments.length === 0 ? (<p style={{ color: '#666' }}>No payments yet</p>) : (payments.map((p) => (<div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <span>{p.employee_name || 'AI Employee'}</span>
                <span style={{ color: '#4ADE80' }}>₦{p.amount?.toLocaleString()}</span>
              </div>)))}
        </div>)}

      {/* Total Cost Summary */}
      {employees.length > 0 && (<div style={{
                background: 'rgba(255,255,255,0.03)',
                padding: '20px 24px',
                borderRadius: '12px',
                marginBottom: '32px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
          <div>
            <h3 style={{ margin: '0 0 4px 0', color: '#888', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Total Monthly Investment
            </h3>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
              For {employees.length} AI employee{employees.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#E2725B' }}>
              ₦{totalMonthlyCost.toLocaleString()}
            </span>
            <span style={{ color: '#666', marginLeft: '8px' }}>/month</span>
          </div>
        </div>)}

      {/* Employees Section */}
      {employees.length === 0 ? (<div style={{ textAlign: 'center', padding: '60px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤖</div>
          <h2>No AI Employees Hired Yet</h2>
          <p style={{ color: '#888', marginBottom: '24px' }}>Hire Amina to get started with WhatsApp automation</p>
          <button onClick={() => navigate('/team')} style={primaryBtnStyle}>
            Hire Your First Employee
          </button>
        </div>) : (<div>
          <h2 style={{ marginBottom: '24px', fontSize: '24px' }}>
            Your AI Team <span style={{ color: '#666' }}>({employees.length})</span>
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '24px' }}>
            {employees.map((emp) => (<div key={emp.id} style={{
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '20px',
                    border: `2px solid ${emp.color_theme || '#E2725B'}40`,
                    overflow: 'hidden',
                    transition: 'all 0.3s',
                    cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                }} onClick={() => openAgentDetails(emp)} onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = `0 20px 40px ${emp.color_theme || '#E2725B'}30`;
                }} onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
                }}>
                {/* Card Header with Gradient */}
                <div style={{
                    background: getTierGradient(emp.tier),
                    padding: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                  {/* Background pattern */}
                  <div style={{
                    position: 'absolute',
                    top: '-50%',
                    right: '-20%',
                    width: '200px',
                    height: '200px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%',
                    filter: 'blur(40px)'
                }}/>
                  
                  <div style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '16px',
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    position: 'relative',
                    zIndex: 1
                }}>
                    {emp.icon_emoji || getAgentIcon(emp.employee_role)}
                  </div>
                  <div style={{ flex: 1, color: 'white', position: 'relative', zIndex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{emp.display_name}</h3>
                    <p style={{ margin: '6px 0 0 0', opacity: 0.9, fontSize: '14px' }}>{emp.employee_role}</p>
                  </div>
                  <div style={{
                    background: 'rgba(255,255,255,0.25)',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    border: '1px solid rgba(255,255,255,0.3)',
                    position: 'relative',
                    zIndex: 1
                }}>
                    {emp.tier || 'Standard'}
                  </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: '24px' }}>
                  {/* Status Badge */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '20px',
                    padding: '10px 14px',
                    background: emp.connection_status === 'connected' ? 'rgba(74,222,128,0.1)' : 'rgba(245,158,11,0.1)',
                    borderRadius: '8px',
                    border: `1px solid ${emp.connection_status === 'connected' ? '#4ADE80' : '#F59E0B'}40`
                }}>
                    <span style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: emp.connection_status === 'connected' ? '#4ADE80' : '#F59E0B',
                    animation: emp.connection_status === 'connected' ? 'none' : 'pulse 2s infinite',
                    boxShadow: `0 0 10px ${emp.connection_status === 'connected' ? '#4ADE80' : '#F59E0B'}`
                }}/>
                    <span style={{
                    color: emp.connection_status === 'connected' ? '#4ADE80' : '#F59E0B',
                    fontSize: '14px',
                    fontWeight: '600'
                }}>
                      {emp.connection_status === 'connected' ? 'Active & Running' : 'Setup Required - Click to Configure'}
                    </span>
                  </div>

                  {/* Capabilities List - NO LONGER EMPTY! */}
                  <div style={{ marginBottom: '20px' }}>
                    <p style={{
                    color: '#666',
                    fontSize: '11px',
                    marginBottom: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    fontWeight: 'bold'
                }}>
                      What {emp.display_name?.split(' ')[1] || 'this AI'} does for you:
                    </p>
                    
                    {/* Display actual features from database */}
                    {(emp.features || []).slice(0, 4).map((feature, idx) => (<div key={idx} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        marginBottom: '10px',
                        fontSize: '14px',
                        color: '#ccc',
                        lineHeight: '1.4'
                    }}>
                        <lucide_react_1.CheckCircle size={16} style={{
                        color: emp.color_theme || '#E2725B',
                        flexShrink: 0,
                        marginTop: '2px'
                    }}/>
                        <span>{feature}</span>
                      </div>))}
                    
                    {/* Show empty state if no features */}
                    {(!emp.features || emp.features.length === 0) && (<div style={{ color: '#666', fontSize: '14px', fontStyle: 'italic' }}>
                        Loading capabilities...
                      </div>)}
                    
                    {(emp.features || []).length > 4 && (<p style={{ color: emp.color_theme || '#E2725B', fontSize: '13px', marginTop: '10px', cursor: 'pointer' }}>
                        +{(emp.features || []).length - 4} more capabilities...
                      </p>)}
                  </div>

                  {/* Price - BIGGER AND BOLDER */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 0',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    marginBottom: '16px'
                }}>
                    <span style={{ color: '#888', fontSize: '14px' }}>Monthly Investment</span>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '32px', fontWeight: 'bold', color: emp.color_theme || '#E2725B' }}>
                        ₦{(emp.price_monthly || 0).toLocaleString()}
                      </span>
                      <span style={{ color: '#666', fontSize: '14px', marginLeft: '4px' }}>/mo</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  {emp.connection_status === 'connected' ? (<button onClick={(e) => {
                        e.stopPropagation();
                        openAgentDetails(emp);
                    }} style={{
                        width: '100%',
                        padding: '14px',
                        background: 'rgba(74,222,128,0.1)',
                        border: '2px solid #4ADE80',
                        color: '#4ADE80',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.2s'
                    }} onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(74,222,128,0.2)';
                    }} onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(74,222,128,0.1)';
                    }}>
                      <lucide_react_1.CheckCircle size={20}/>
                      View Activity & Configure
                    </button>) : (<button onClick={(e) => {
                        e.stopPropagation();
                        openAgentDetails(emp);
                    }} style={{
                        width: '100%',
                        padding: '14px',
                        background: emp.color_theme || '#E2725B',
                        border: 'none',
                        color: 'white',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: `0 4px 20px ${emp.color_theme || '#E2725B'}40`,
                        transition: 'all 0.2s'
                    }} onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.02)';
                        e.currentTarget.style.boxShadow = `0 6px 30px ${emp.color_theme || '#E2725B'}60`;
                    }} onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = `0 4px 20px ${emp.color_theme || '#E2725B'}40`;
                    }}>
                      <lucide_react_1.Smartphone size={20}/>
                      Setup & Connect Now
                    </button>)}
                </div>
              </div>))}
          </div>
        </div>)}

      {/* Agent Details Modal - NOW SHOWS ACTUAL FEATURES */}
      {showAgentModal && selectedEmployee && (<div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.85)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '20px',
                backdropFilter: 'blur(10px)'
            }} onClick={() => setShowAgentModal(false)}>
          <div style={{
                background: '#1a1a1a',
                borderRadius: '24px',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'auto',
                border: `3px solid ${selectedEmployee.color_theme || '#E2725B'}`,
                boxShadow: `0 0 60px ${selectedEmployee.color_theme || '#E2725B'}30`
            }} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={{
                background: getTierGradient(selectedEmployee.tier),
                padding: '40px 32px',
                position: 'relative',
                textAlign: 'center'
            }}>
              <button onClick={() => setShowAgentModal(false)} style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
                transition: 'all 0.2s',
                backdropFilter: 'blur(10px)'
            }} onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                e.currentTarget.style.transform = 'rotate(90deg)';
            }} onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.transform = 'rotate(0deg)';
            }}>
                <lucide_react_1.X size={24}/>
              </button>
              
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '24px',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '48px',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255,255,255,0.3)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
            }}>
                {selectedEmployee.icon_emoji || getAgentIcon(selectedEmployee.employee_role, 40)}
              </div>
              
              <h2 style={{ textAlign: 'center', margin: 0, fontSize: '32px', fontWeight: 'bold', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                {selectedEmployee.display_name}
              </h2>
              <p style={{ textAlign: 'center', margin: '8px 0 0 0', opacity: 0.9, fontSize: '16px' }}>
                {selectedEmployee.employee_role}
              </p>
              
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '12px',
                marginTop: '20px',
                flexWrap: 'wrap'
            }}>
                <span style={{
                background: 'rgba(255,255,255,0.2)',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                border: '1px solid rgba(255,255,255,0.3)'
            }}>
                  {selectedEmployee.tier?.toUpperCase() || 'STANDARD'} TIER
                </span>
                <span style={{
                background: 'rgba(255,255,255,0.2)',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: 'bold',
                border: '1px solid rgba(255,255,255,0.3)'
            }}>
                  ₦{(selectedEmployee.price_monthly || 0).toLocaleString()}/mo
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '32px' }}>
              {/* All Features Section - NO LONGER EMPTY! */}
              <h3 style={{ marginBottom: '16px', color: '#fff', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <lucide_react_1.Sparkles size={20} style={{ color: selectedEmployee.color_theme || '#E2725B' }}/>
                All Capabilities
              </h3>
              
              <div style={{ marginBottom: '32px' }}>
                {(selectedEmployee.features || []).length > 0 ? ((selectedEmployee.features || []).map((feature, idx) => (<div key={idx} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                    marginBottom: '14px',
                    padding: '14px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    transition: 'all 0.2s',
                    cursor: 'default'
                }} onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.borderColor = `${selectedEmployee.color_theme || '#E2725B'}40`;
                }} onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                }}>
                      <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: `${selectedEmployee.color_theme || '#E2725B'}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                }}>
                        <lucide_react_1.CheckCircle size={14} style={{ color: selectedEmployee.color_theme || '#E2725B' }}/>
                      </div>
                      <span style={{ color: '#ddd', lineHeight: '1.5', fontSize: '15px' }}>{feature}</span>
                    </div>))) : (<div style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
                    No features configured for this agent.
                  </div>)}
              </div>

              {/* Configuration Section */}
              <h3 style={{ marginBottom: '16px', color: '#fff', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <lucide_react_1.Shield size={20} style={{ color: selectedEmployee.color_theme || '#E2725B' }}/>
                Configuration
              </h3>
              
              {selectedEmployee.connection_status === 'connected' ? (<div style={{
                    background: 'rgba(74,222,128,0.1)',
                    border: '2px solid #4ADE80',
                    padding: '24px',
                    borderRadius: '12px',
                    marginBottom: '20px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <lucide_react_1.CheckCircle size={28} style={{ color: '#4ADE80' }}/>
                    <span style={{ fontWeight: 'bold', color: '#4ADE80', fontSize: '18px' }}>WhatsApp Connected</span>
                  </div>
                  <p style={{ color: '#888', fontSize: '15px', margin: 0 }}>
                    Phone: {selectedEmployee.whatsapp_number || '+234 XXX XXX XXXX'}
                  </p>
                  <p style={{ color: '#666', fontSize: '13px', marginTop: '8px' }}>
                    This AI employee is active and handling conversations.
                  </p>
                </div>) : (<div style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '2px solid rgba(255,255,255,0.1)',
                    padding: '24px',
                    borderRadius: '12px',
                    marginBottom: '20px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <lucide_react_1.AlertCircle size={28} style={{ color: '#F59E0B' }}/>
                    <span style={{ fontWeight: 'bold', color: '#F59E0B', fontSize: '18px' }}>Setup Required</span>
                  </div>
                  <p style={{ color: '#888', marginBottom: '16px', lineHeight: '1.6', fontSize: '15px' }}>
                    Connect your WhatsApp Business number to activate {selectedEmployee.display_name}. 
                    The AI will respond to customer messages automatically based on your business configuration.
                  </p>
                  <button style={{
                    width: '100%',
                    padding: '16px',
                    background: selectedEmployee.color_theme || '#E2725B',
                    border: 'none',
                    color: 'white',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: `0 4px 20px ${selectedEmployee.color_theme || '#E2725B'}40`,
                    transition: 'all 0.2s'
                }} onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 6px 30px ${selectedEmployee.color_theme || '#E2725B'}60`;
                }} onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = `0 4px 20px ${selectedEmployee.color_theme || '#E2725B'}40`;
                }}>
                    <lucide_react_1.Smartphone size={22}/>
                    Connect WhatsApp Now
                  </button>
                </div>)}

              {/* Business Context Info */}
              <div style={{
                background: 'rgba(226,114,91,0.1)',
                border: '1px solid rgba(226,114,91,0.3)',
                padding: '16px',
                borderRadius: '10px',
                marginTop: '20px'
            }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#E2725B', fontSize: '14px' }}>Why this pricing?</h4>
                <p style={{ margin: 0, color: '#888', fontSize: '13px', lineHeight: '1.5' }}>
                  {selectedEmployee.display_name} is configured for your specific business needs. 
                  This includes 24/7 availability, custom training, and priority support.
                </p>
              </div>
            </div>
          </div>
        </div>)}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4); }
          50% { opacity: 0.8; box-shadow: 0 0 0 10px rgba(245, 158, 11, 0); }
        }
      `}</style>
    </div>);
};
const btnStyle = {
    padding: '12px 20px',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '10px',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    transition: 'all 0.2s',
    fontWeight: '500'
};
const primaryBtnStyle = {
    ...btnStyle,
    background: '#E2725B',
    color: 'white',
    fontWeight: 'bold',
    border: 'none',
    boxShadow: '0 4px 15px rgba(226,114,91,0.3)'
};
exports.default = Dashboard;
//# sourceMappingURL=Dashboard.js.map