import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import { useState, useEffect } from "react";
import type { ReactElement } from "react";

const DashboardLayout = ({ children }: { children: ReactElement }) => (
  <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#0A0A0F" }}>
    <Sidebar />
    <main style={{ flex: 1, padding: "2rem", backgroundColor: "#0A0A0F", color: "#ffffff" }}>
      {children}
    </main>
  </div>
);

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

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>} />
        <Route path="/team" element={<ProtectedRoute><DashboardLayout><Team /></DashboardLayout></ProtectedRoute>} />
        <Route path="/conversations" element={<ProtectedRoute><DashboardLayout><Conversations /></DashboardLayout></ProtectedRoute>} />
        <Route path="/calls" element={<ProtectedRoute><DashboardLayout><Calls /></DashboardLayout></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><DashboardLayout><Analytics /></DashboardLayout></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><DashboardLayout><Settings /></DashboardLayout></ProtectedRoute>} />
        <Route path="/widget" element={<ProtectedRoute><DashboardLayout><DashboardWidget businessId={1} token={token!} /></DashboardLayout></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;