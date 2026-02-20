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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const lucide_react_1 = require("lucide-react");
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const Register = () => {
    const [formData, setFormData] = (0, react_1.useState)({
        businessName: '',
        country: 'Ghana',
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false,
    });
    const [showPassword, setShowPassword] = (0, react_1.useState)(false);
    const [showConfirmPassword, setShowConfirmPassword] = (0, react_1.useState)(false);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)('');
    const navigate = (0, react_router_dom_1.useNavigate)();
    const countries = [
        'Ghana', 'Nigeria', 'Kenya', 'South Africa', 'Egypt', 'Morocco',
        'Tunisia', 'Algeria', 'Ethiopia', 'Uganda', 'Tanzania', 'Rwanda',
        'Senegal', 'Ivory Coast', 'Cameroon', 'Zambia', 'Zimbabwe', 'Botswana'
    ];
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? e.target.checked : value
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (!formData.agreeTerms) {
            setError('Please agree to the terms and conditions');
            return;
        }
        setLoading(true);
        // DEBUG: Log what we're sending
        const requestData = {
            business_name: formData.businessName,
            country: formData.country,
            name: formData.fullName, // ✅ FIXED: Changed from full_name to name
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
        };
        console.log('Sending registration data:', requestData);
        try {
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });
            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('Non-JSON response:', text.substring(0, 200));
                throw new Error('Server error: Please try again later');
            }
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }
            // Store token and redirect
            localStorage.setItem('token', data.token);
            localStorage.setItem('business_id', data.business_id);
            localStorage.setItem('business_name', data.business_name);
            navigate('/team');
        }
        catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
        }
        finally {
            setLoading(false);
        }
    };
    return (<div style={{
            minHeight: '100vh',
            backgroundColor: '#0A0A0F',
            color: '#FFFFFF',
            fontFamily: 'Inter, -apple-system, sans-serif',
            display: 'flex',
            flexDirection: 'column'
        }}>
      {/* Animated Background */}
      <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: `
          radial-gradient(ellipse 80% 50% at 20% 40%, rgba(226, 114, 91, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse 60% 40% at 80% 60%, rgba(74, 144, 255, 0.08) 0%, transparent 50%),
          #0A0A0F
        `,
            zIndex: 0,
            pointerEvents: 'none'
        }}/>

      {/* Header */}
      <nav style={{
            position: 'relative',
            zIndex: 1,
            padding: '24px 48px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.05)'
        }}>
        <react_router_dom_1.Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px',
            background: 'linear-gradient(135deg, #E2725B 0%, #FF8E53 100%)',
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '20px'
        }}>
            🤖
          </div>
          <span style={{ fontSize: '24px', fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>
            Botari
          </span>
        </react_router_dom_1.Link>
        <react_router_dom_1.Link to="/login" style={{ textDecoration: 'none' }}>
          <span style={{ color: '#888', fontSize: '14px' }}>Already have an account? </span>
          <span style={{ color: '#E2725B', fontWeight: 600 }}>Sign in</span>
        </react_router_dom_1.Link>
      </nav>

      {/* Main Content */}
      <div style={{
            position: 'relative',
            zIndex: 1,
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 24px'
        }}>
        <div style={{
            width: '100%',
            maxWidth: '480px',
            background: 'rgba(26, 26, 36, 0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '24px',
            padding: '40px'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 700,
            marginBottom: '8px',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #A0A0B0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
        }}>
            Create Your Account
          </h1>
          <p style={{ color: '#888', marginBottom: '32px', fontSize: '15px' }}>
            Hire AI employees for your business
          </p>

          {error && (<div style={{
                padding: '12px 16px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '12px',
                color: '#EF4444',
                fontSize: '14px',
                marginBottom: '24px'
            }}>
              {error}
            </div>)}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Business Name */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px', color: '#fff' }}>
                Business Name *
              </label>
              <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} required style={{
            width: '100%',
            padding: '14px 16px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '15px',
            outline: 'none',
            transition: 'all 0.2s'
        }} onFocus={(e) => e.target.style.borderColor = 'rgba(226,114,91,0.5)'} onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}/>
            </div>

            {/* Country */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px', color: '#fff' }}>
                Country *
              </label>
              <select name="country" value={formData.country} onChange={handleChange} required style={{
            width: '100%',
            padding: '14px 16px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '15px',
            outline: 'none',
            cursor: 'pointer',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg ' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 12px center',
            backgroundSize: '20px',
            paddingRight: '44px'
        }}>
                {countries.map(country => (<option key={country} value={country} style={{ background: '#1a1a24', color: '#fff' }}>
                    {country}
                  </option>))}
              </select>
            </div>

            {/* Full Name */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px', color: '#fff' }}>
                Your Full Name *
              </label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required style={{
            width: '100%',
            padding: '14px 16px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '15px',
            outline: 'none',
            transition: 'all 0.2s'
        }} onFocus={(e) => e.target.style.borderColor = 'rgba(226,114,91,0.5)'} onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}/>
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px', color: '#fff' }}>
                Email Address *
              </label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{
            width: '100%',
            padding: '14px 16px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '15px',
            outline: 'none',
            transition: 'all 0.2s'
        }} onFocus={(e) => e.target.style.borderColor = 'rgba(226,114,91,0.5)'} onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}/>
            </div>

            {/* Phone */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px', color: '#fff' }}>
                WhatsApp Number *
              </label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="e.g., +233 50 123 4567" style={{
            width: '100%',
            padding: '14px 16px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '15px',
            outline: 'none',
            transition: 'all 0.2s'
        }} onFocus={(e) => e.target.style.borderColor = 'rgba(226,114,91,0.5)'} onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}/>
              <p style={{ fontSize: '12px', color: '#666', marginTop: '6px' }}>
                This will be connected to Amina for customer service
              </p>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px', color: '#fff' }}>
                Password *
              </label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required style={{
            width: '100%',
            padding: '14px 16px',
            paddingRight: '48px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '15px',
            outline: 'none',
            transition: 'all 0.2s'
        }} onFocus={(e) => e.target.style.borderColor = 'rgba(226,114,91,0.5)'} onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}/>
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: '#666',
            cursor: 'pointer',
            padding: '4px'
        }}>
                  {showPassword ? <lucide_react_1.EyeOff size={20}/> : <lucide_react_1.Eye size={20}/>}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px', color: '#fff' }}>
                Confirm Password *
              </label>
              <div style={{ position: 'relative' }}>
                <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required style={{
            width: '100%',
            padding: '14px 16px',
            paddingRight: '48px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '15px',
            outline: 'none',
            transition: 'all 0.2s'
        }} onFocus={(e) => e.target.style.borderColor = 'rgba(226,114,91,0.5)'} onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}/>
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: '#666',
            cursor: 'pointer',
            padding: '4px'
        }}>
                  {showConfirmPassword ? <lucide_react_1.EyeOff size={20}/> : <lucide_react_1.Eye size={20}/>}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <input type="checkbox" name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange} id="terms" style={{
            width: '20px',
            height: '20px',
            marginTop: '2px',
            accentColor: '#E2725B',
            cursor: 'pointer'
        }}/>
              <label htmlFor="terms" style={{ fontSize: '14px', color: '#888', cursor: 'pointer' }}>
                I agree to the{' '}
                <react_router_dom_1.Link to="/privacy" style={{ color: '#E2725B', textDecoration: 'none' }}>privacy policy</react_router_dom_1.Link>
                {' '}and{' '}
                <react_router_dom_1.Link to="/terms" style={{ color: '#E2725B', textDecoration: 'none' }}>terms</react_router_dom_1.Link>
              </label>
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={loading} style={{
            width: '100%',
            padding: '16px',
            background: 'linear-gradient(135deg, #E2725B 0%, #FF8E53 100%)',
            border: 'none',
            borderRadius: '12px',
            color: '#000',
            fontWeight: 600,
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s',
            marginTop: '8px'
        }}>
              {loading ? (<>
                  <lucide_react_1.Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }}/>
                  Creating Account...
                </>) : (<>
                  Create Account & Hire Amina
                  <lucide_react_1.ArrowRight size={20}/>
                </>)}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#888' }}>
            Already have an account?{' '}
            <react_router_dom_1.Link to="/login" style={{ color: '#E2725B', textDecoration: 'none', fontWeight: 600 }}>
              Sign in
            </react_router_dom_1.Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>);
};
exports.default = Register;
//# sourceMappingURL=Register.js.map