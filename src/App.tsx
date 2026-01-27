import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Sidebar from "./components/Sidebar"; // new sidebar
import DashboardWidget from "./components/DashboardWidget";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Calls from "./pages/Calls";
import { useState, useEffect } from "react";
import type { ReactElement } from "react";

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
      <Routes>
        {/* Public routes with Navbar via Layout */}
        <Route
          path="/"
          element={
            <Layout token={token ?? undefined} onLogout={handleLogout}>
              <LandingPage />
            </Layout>
          }
        />
        <Route
          path="/login"
          element={
            <Layout token={token ?? undefined} onLogout={handleLogout}>
              <Login onLogin={handleLogin} />
            </Layout>
          }
        />
        <Route
          path="/register"
          element={
            <Layout token={token ?? undefined} onLogout={handleLogout}>
              <Register />
            </Layout>
          }
        />

        {/* Protected dashboard routes with Sidebar */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              element={
                <div style={{ display: "flex", minHeight: "100vh" }}>
                  <Sidebar />
                  <main style={{ flex: 1, padding: "2rem", backgroundColor: "#000000", color: "#ffffff" }}>
                    <Dashboard token={token!} />
                  </main>
                </div>
              }
            />
          }
        />

        <Route
          path="/widget"
          element={
            <ProtectedRoute
              element={
                <div style={{ display: "flex", minHeight: "100vh" }}>
                  <Sidebar />
                  <main style={{ flex: 1, padding: "2rem", backgroundColor: "#000000", color: "#ffffff" }}>
                    <DashboardWidget businessId={1} token={token!} />
                  </main>
                </div>
              }
            />
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute
              element={
                <div style={{ display: "flex", minHeight: "100vh" }}>
                  <Sidebar />
                  <main style={{ flex: 1, padding: "2rem", backgroundColor: "#000000", color: "#ffffff" }}>
                    <Settings />
                  </main>
                </div>
              }
            />
          }
        />

        <Route
          path="/calls"
          element={
            <ProtectedRoute
              element={
                <div style={{ display: "flex", minHeight: "100vh" }}>
                  <Sidebar />
                  <main style={{ flex: 1, padding: "2rem", backgroundColor: "#000000", color: "#ffffff" }}>
                    <Calls />
                  </main>
                </div>
              }
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
