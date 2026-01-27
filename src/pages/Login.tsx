import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../components/Auth.css';

interface LoginProps {
  onLogin: (jwt: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Invalid credentials');

      localStorage.setItem('jwt', data.token);
      if (data.user?.business_id) localStorage.setItem('business_id', data.user.business_id);
      if (data.user?.business_name) localStorage.setItem('business_name', data.user.business_name);

      onLogin(data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Log In</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />
          <label>Remember me</label>
        </div>

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" disabled={loading} className="auth-button">
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      {/* Social login section */}
      <div className="social-login">
        <p>Or sign in with</p>
        <div className="social-icons">
          <button className="social-button"><i className="fab fa-facebook-f"></i></button>
          <button className="social-button"><i className="fab fa-google"></i></button>
          <button className="social-button"><i className="fab fa-twitter"></i></button>
          <button className="social-button"><i className="fab fa-instagram"></i></button>
        </div>
      </div>

      <div className="auth-footer">
        Don’t have an account? <Link to="/register">Sign up</Link>
      </div>
    </div>
  );
};

export default Login;
