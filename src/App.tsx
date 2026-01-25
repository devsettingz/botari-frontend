import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardWidget from './components/DashboardWidget';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Calls from './pages/Calls';   // ✅ new Calls page
import { useState, useEffect } from 'react';

function App() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('jwt');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleLogin = (jwt: string) => {
    localStorage.setItem('jwt', jwt);
    setToken(jwt);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('business_id');
    localStorage.removeItem('business_name');
    setToken(null);
  };

  return (
    <Router>
      {/* ✅ Convert null to undefined when passing to Layout */}
      <Layout token={token ?? undefined} onLogout={handleLogout}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />

          {/* Protected dashboard route */}
          <Route
            path="/dashboard"
            element={
              token ? (
                <Dashboard token={token} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Optional: direct widget route */}
          <Route
            path="/widget"
            element={
              token ? (
                <DashboardWidget businessId={1} token={token} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Settings route */}
          <Route
            path="/settings"
            element={
              token ? (
                <Settings />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* ✅ New Calls route */}
          <Route
            path="/calls"
            element={
              token ? (
                <Calls />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
