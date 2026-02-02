import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../components/Auth.css';

// All countries - African markets first
const COUNTRIES = [
  { code: 'NG', name: 'Nigeria' },
  { code: 'KE', name: 'Kenya' },
  { code: 'GH', name: 'Ghana' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'EG', name: 'Egypt' },
  { code: 'TZ', name: 'Tanzania' },
  { code: 'UG', name: 'Uganda' },
  { code: 'RW', name: 'Rwanda' },
  { code: 'ET', name: 'Ethiopia' },
  { code: 'SN', name: 'Senegal' },
  { code: 'CI', name: "Côte d'Ivoire" },
  { code: 'CM', name: 'Cameroon' },
  { code: 'ZW', name: 'Zimbabwe' },
  { code: 'ZM', name: 'Zambia' },
  { code: 'BW', name: 'Botswana' },
  { code: 'NA', name: 'Namibia' },
  { code: 'MZ', name: 'Mozambique' },
  { code: 'MW', name: 'Malawi' },
  { code: 'MA', name: 'Morocco' },
  { code: 'TN', name: 'Tunisia' },
  { code: 'DZ', name: 'Algeria' },
  { code: 'LY', name: 'Libya' },
  { code: 'SD', name: 'Sudan' },
  { code: 'SS', name: 'South Sudan' },
  { code: 'AO', name: 'Angola' },
  { code: 'CD', name: 'DR Congo' },
  { code: 'CG', name: 'Congo' },
  { code: 'GA', name: 'Gabon' },
  { code: 'GQ', name: 'Equatorial Guinea' },
  { code: 'TD', name: 'Chad' },
  { code: 'NE', name: 'Niger' },
  { code: 'ML', name: 'Mali' },
  { code: 'BF', name: 'Burkina Faso' },
  { code: 'GN', name: 'Guinea' },
  { code: 'SL', name: 'Sierra Leone' },
  { code: 'LR', name: 'Liberia' },
  { code: 'GM', name: 'Gambia' },
  { code: 'GW', name: 'Guinea-Bissau' },
  { code: 'BJ', name: 'Benin' },
  { code: 'TG', name: 'Togo' },
  { code: 'MR', name: 'Mauritania' },
  { code: 'ER', name: 'Eritrea' },
  { code: 'DJ', name: 'Djibouti' },
  { code: 'SO', name: 'Somalia' },
  { code: 'MG', name: 'Madagascar' },
  { code: 'MU', name: 'Mauritius' },
  { code: 'SC', name: 'Seychelles' },
  { code: 'KM', name: 'Comoros' },
  { code: 'CV', name: 'Cape Verde' },
  { code: 'ST', name: 'São Tomé and Príncipe' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'PT', name: 'Portugal' },
  { code: 'BE', name: 'Belgium' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'AT', name: 'Austria' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'IE', name: 'Ireland' },
  { code: 'IN', name: 'India' },
  { code: 'CN', name: 'China' },
  { code: 'JP', name: 'Japan' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'AE', name: 'UAE' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'TR', name: 'Turkey' },
  { code: 'IL', name: 'Israel' },
  { code: 'RU', name: 'Russia' },
  { code: 'KR', name: 'South Korea' },
  { code: 'SG', name: 'Singapore' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'TH', name: 'Thailand' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'PH', name: 'Philippines' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'LK', name: 'Sri Lanka' },
  { code: 'NP', name: 'Nepal' },
];

const Register: React.FC = () => {
  const [businessName, setBusinessName] = useState('');
  const [country, setCountry] = useState('NG'); // Default Nigeria
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agreeTerms) {
      setError('You must agree to the privacy policy');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: businessName,
          country,
          name: ownerName,
          email,
          password,
          phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Registration failed');

      // Store auth data
      if (data.token) localStorage.setItem('jwt', data.token);
      if (data.business_id) localStorage.setItem('business_id', data.business_id);
      if (data.business_name) localStorage.setItem('business_name', data.business_name);
      if (data.email) localStorage.setItem('user_email', data.email);

      navigate('/team');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Create Your Account</h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>
        Hire AI employees for your business
      </p>
      
      <form onSubmit={handleSubmit} className="auth-form">
        <label>Business Name *</label>
        <input
          type="text"
          placeholder="e.g., Mama's Kitchen Lagos"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          required
        />

        <label>Country *</label>
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '15px',
            borderRadius: '4px',
            border: '1px solid #333',
            backgroundColor: '#1a1a1a',
            color: '#fff',
            fontSize: '14px'
          }}
        >
          <optgroup label="🇳🇬 Major African Markets">
            {COUNTRIES.filter(c => ['NG', 'KE', 'GH', 'ZA', 'EG', 'TZ', 'UG', 'RW'].includes(c.code)).map(c => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </optgroup>
          <optgroup label="🌍 All African Countries">
            {COUNTRIES.filter(c => 
              ['NG','KE','GH','ZA','EG','TZ','UG','RW','ET','SN','CI','CM','ZW','ZM','BW','NA','MZ','MW','MA','TN','DZ','LY','SD','SS','AO','CD','CG','GA','GQ','TD','NE','ML','BF','GN','SL','LR','GM','GW','BJ','TG','MR','ER','DJ','SO','MG','MU','SC','KM','CV','ST'].includes(c.code) && 
              !['NG', 'KE', 'GH', 'ZA', 'EG', 'TZ', 'UG', 'RW'].includes(c.code)
            ).map(c => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </optgroup>
          <optgroup label="🌎 International">
            {COUNTRIES.filter(c => ['US','GB','CA','AU','DE','FR','NL','IT','ES','PT','BE','CH','AT','SE','NO','DK','FI','IE','IN','CN','JP','BR','MX','AE','SA','TR','IL','RU','KR','SG','MY','ID','TH','VN','PH','PK','BD','LK','NP'].includes(c.code)).map(c => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </optgroup>
        </select>

        <label>Your Full Name *</label>
        <input
          type="text"
          placeholder="e.g., John Doe"
          value={ownerName}
          onChange={(e) => setOwnerName(e.target.value)}
          required
        />

        <label>Email Address *</label>
        <input
          type="email"
          placeholder="you@business.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>WhatsApp Number *</label>
        <input
          type="tel"
          placeholder="+234 801 234 5678"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <small style={{ color: '#666', display: 'block', marginTop: '-10px', marginBottom: '15px' }}>
          This will be connected to Amina for customer service
        </small>

        <label>Password *</label>
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />

        <label>Confirm Password *</label>
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <div className="checkbox-row">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          <label>Show Password</label>
        </div>

        <div className="checkbox-row">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={() => setAgreeTerms(!agreeTerms)}
          />
          <label>I agree to the privacy policy and terms</label>
        </div>

        {error && <p className="auth-error" style={{ color: '#E2725B', marginBottom: '10px' }}>{error}</p>}

        <button type="submit" disabled={loading} className="auth-button">
          {loading ? 'Creating Account...' : 'Create Account & Hire Amina'}
        </button>
      </form>

      <div className="auth-footer">
        Already have an account? <Link to="/login">Sign in</Link>
      </div>
    </div>
  );
};

export default Register;