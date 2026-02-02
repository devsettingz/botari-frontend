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
import { useState, useEffect } from "react";
import type { ReactElement } from "react";

const DashboardLayout = ({ children }: { children: ReactElement }) => (
  <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#000000" }}>
    <Sidebar />
    <main style={{ flex: 1, padding: "2rem", backgroundColor: "#000000", color: "#ffffff" }}>
      {children}
    </main>
  </div>
);

const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("jwt");
    if (stored) setToken(stored);
    setLoading(false);
  }, []);

  if (loading) return <div style={{ background: "#000", color: "#fff", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading Botari...</div>;
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("jwt");
    if (stored) setToken(stored);
  }, []);

  const handleLogin = (jwt: string) => {
    localStorage.setItem("jwt", jwt);
    setToken(jwt);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("business_id");
    localStorage.removeItem("business_name");
    setToken(null);
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout token={token ?? undefined} onLogout={handleLogout}><LandingPage /></Layout>} />
        <Route path="/login" element={<Layout token={token ?? undefined} onLogout={handleLogout}><Login onLogin={handleLogin} /></Layout>} />
        <Route path="/register" element={<Layout token={token ?? undefined} onLogout={handleLogout}><Register /></Layout>} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><Dashboard token={token!} /></DashboardLayout></ProtectedRoute>} />
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