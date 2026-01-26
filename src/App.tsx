import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import DashboardWidget from "./components/DashboardWidget";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Calls from "./pages/Calls";
import { useState, useEffect, type ReactElement } from "react";

function App() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("jwt");
    if (storedToken) {
      setToken(storedToken);
    }
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

  const ProtectedRoute = ({ element }: { element: ReactElement }) =>
    token ? element : <Navigate to="/login" replace />;

  return (
    <Router>
      <Layout token={token ?? undefined} onLogout={handleLogout}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard token={token!} />} />} />
          <Route path="/widget" element={<ProtectedRoute element={<DashboardWidget businessId={1} token={token!} />} />} />
          <Route path="/settings" element={<ProtectedRoute element={<Settings />} />} />
          <Route path="/calls" element={<ProtectedRoute element={<Calls />} />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
