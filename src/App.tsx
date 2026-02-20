import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import Sidebar from "./components/Sidebar";
import DashboardWidget from "./components/DashboardWidget";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Calls from "./pages/Calls";
import Team from "./pages/Team";
import Conversations from "./pages/Conversations";
import Analytics from "./pages/Analytics";
import PaymentVerify from "./pages/PaymentVerify";
import PaymentCallback from "./pages/PaymentCallback";
import DemoStatus from "./pages/DemoStatus"; // NEW: Marketing demo page
import OnboardingWizard from "./components/OnboardingWizard";
import { useState, useEffect } from "react";
import type { ReactElement } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

const DashboardLayout = ({ children }: { children: ReactElement }) => (
  <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#0A0A0F" }}>
    <Sidebar />
    <main style={{ flex: 1, padding: "2rem", backgroundColor: "#0A0A0F", color: "#ffffff" }}>
      {children}
    </main>
  </div>
);

// Check if user has completed onboarding
const OnboardingCheck = ({ children }: { children: ReactElement }) => {
  const [loading, setLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkOnboarding = async () => {
      if (location.pathname === '/onboarding') {
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("jwt") || localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const completed = localStorage.getItem('onboarding_complete');
        if (completed === 'true') {
          setLoading(false);
          return;
        }

        const res = await axios.get(`${API_URL}/api/business/context`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data && res.data.analyzed_at) {
          localStorage.setItem('onboarding_complete', 'true');
          setNeedsOnboarding(false);
        } else {
          setNeedsOnboarding(true);
        }
      } catch (error: any) {
        if (error.response?.status === 404) {
          setNeedsOnboarding(true);
        }
      } finally {
        setLoading(false);
      }
    };

    checkOnboarding();
  }, [location]);

  if (loading) {
    return (
      <div style={{ 
        background: "#0A0A0F", 
        color: "#fff", 
        height: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        flexDirection: "column",
        gap: "20px"
      }}>
        <div style={{
          width: "50px",
          height: "50px",
          border: "3px solid rgba(226,114,91,0.3)",
          borderTopColor: "#E2725B",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        Loading Botari...
      </div>
    );
  }

  if (needsOnboarding) {
    return <OnboardingWizard />;
  }

  return children;
};

const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("jwt") || localStorage.getItem("token");
    setIsAuth(!!token);
  }, []);

  if (isAuth === null) return (
    <div style={{ 
      background: "#0A0A0F", 
      color: "#fff", 
      height: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center" 
    }}>
      Loading Botari...
    </div>
  );
  
  return isAuth ? children : <Navigate to="/login" replace />;
};

function App() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("jwt") || localStorage.getItem("token");
    if (stored) setToken(stored);
  }, []);

  const handleLogin = (jwt: string) => {
    localStorage.setItem("jwt", jwt);
    localStorage.setItem("token", jwt);
    setToken(jwt);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("token");
    localStorage.removeItem("business_id");
    localStorage.removeItem("business_name");
    localStorage.removeItem("user_name");
    localStorage.removeItem("onboarding_complete");
    setToken(null);
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout token={token ?? undefined} onLogout={handleLogout}><LandingPage /></Layout>} />
        <Route path="/login" element={<Layout token={token ?? undefined} onLogout={handleLogout}><Login onLogin={handleLogin} /></Layout>} />
        <Route path="/register" element={<Layout token={token ?? undefined} onLogout={handleLogout}><Register /></Layout>} />
        <Route path="/payment/verify" element={<PaymentVerify />} />
        <Route path="/payment/callback" element={<PaymentCallback />} />
        <Route path="/demo" element={<DemoStatus />} /> {/* NEW: Demo page - public access */}

        {/* Protected Routes with Onboarding Check */}
        <Route path="/onboarding" element={
          <ProtectedRoute>
            <OnboardingWizard />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <OnboardingCheck>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </OnboardingCheck>
          </ProtectedRoute>
        } />
        
        <Route path="/team" element={
          <ProtectedRoute>
            <OnboardingCheck>
              <DashboardLayout>
                <Team />
              </DashboardLayout>
            </OnboardingCheck>
          </ProtectedRoute>
        } />
        
        <Route path="/conversations" element={
          <ProtectedRoute>
            <OnboardingCheck>
              <DashboardLayout>
                <Conversations />
              </DashboardLayout>
            </OnboardingCheck>
          </ProtectedRoute>
        } />
        
        <Route path="/calls" element={
          <ProtectedRoute>
            <OnboardingCheck>
              <DashboardLayout>
                <Calls />
              </DashboardLayout>
            </OnboardingCheck>
          </ProtectedRoute>
        } />
        
        <Route path="/analytics" element={
          <ProtectedRoute>
            <OnboardingCheck>
              <DashboardLayout>
                <Analytics />
              </DashboardLayout>
            </OnboardingCheck>
          </ProtectedRoute>
        } />
        
        <Route path="/settings" element={
          <ProtectedRoute>
            <OnboardingCheck>
              <DashboardLayout>
                <Settings />
              </DashboardLayout>
            </OnboardingCheck>
          </ProtectedRoute>
        } />
        
        <Route path="/widget" element={
          <ProtectedRoute>
            <OnboardingCheck>
              <DashboardLayout>
                <DashboardWidget businessId={1} token={token!} />
              </DashboardLayout>
            </OnboardingCheck>
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;