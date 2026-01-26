import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaCogs,
  FaSignOutAlt,
  FaUserPlus,
  FaSignInAlt,
  FaPhone,
  FaThLarge,
} from "react-icons/fa";

interface LayoutProps {
  children: React.ReactNode;
  token?: string;
  onLogout?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, token, onLogout }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved === "true";
  });

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;
    if (darkMode) {
      root.classList.add("dark-mode");
    } else {
      root.classList.remove("dark-mode");
    }
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const navLinks = token ? (
    <>
      <StyledLink to="/dashboard" icon={<FaTachometerAlt />} onClick={closeMenu}>
        Dashboard
      </StyledLink>
      <StyledLink to="/widget" icon={<FaThLarge />} onClick={closeMenu}>
        Widget
      </StyledLink>
      <StyledLink to="/settings" icon={<FaCogs />} onClick={closeMenu}>
        Settings
      </StyledLink>
      <StyledLink to="/calls" icon={<FaPhone />} onClick={closeMenu}>
        Calls
      </StyledLink>
      {onLogout && (
        <button
          onClick={() => {
            onLogout();
            closeMenu();
          }}
          style={{
            marginTop: "1rem",
            padding: "0.75rem 1rem",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            background: "#dc3545",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontWeight: 500,
          }}
        >
          <FaSignOutAlt /> Logout
        </button>
      )}
    </>
  ) : (
    <>
      <StyledLink to="/login" icon={<FaSignInAlt />} onClick={closeMenu}>
        Login
      </StyledLink>
      <StyledLink to="/register" icon={<FaUserPlus />} onClick={closeMenu}>
        Register
      </StyledLink>
    </>
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <header
        style={{
          background: darkMode ? "#1f1f1f" : "#007bff",
          color: "#fff",
          padding: "1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        }}
      >
        <h2 style={{ margin: 0, fontWeight: 700 }}>Botari</h2>
        <button
          onClick={toggleMenu}
          style={{
            background: "transparent",
            border: "none",
            color: "#fff",
            fontSize: "1.5rem",
            cursor: "pointer",
          }}
        >
          ☰
        </button>
      </header>

      {/* Sidebar */}
      {menuOpen && (
        <aside
          style={{
            background: darkMode ? "#1f1f1f" : "#343a40",
            color: "#fff",
            padding: "1rem",
            position: "absolute",
            top: "60px",
            left: 0,
            width: "240px",
            height: "calc(100% - 60px)",
            zIndex: 1000,
            boxShadow: "2px 0 8px rgba(0,0,0,0.3)",
          }}
        >
          <nav style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {navLinks}
          </nav>
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              marginTop: "2rem",
              padding: "0.75rem 1rem",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              background: darkMode ? "#007bff" : "#f8f9fa",
              color: darkMode ? "#fff" : "#333",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>
        </aside>
      )}

      {/* Main content */}
      <main
        style={{
          flex: 1,
          padding: "2rem",
          background: darkMode ? "#121212" : "#f9f9f9",
          transition: "background 0.3s ease",
        }}
      >
        {children}
      </main>
    </div>
  );
};

// ✅ Styled link with hover effect
const StyledLink: React.FC<{
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}> = ({ to, icon, children, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    style={{
      color: "#fff",
      textDecoration: "none",
      padding: "0.75rem 1rem",
      borderRadius: "6px",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      fontWeight: 500,
    }}
    className="nav-link"
  >
    {icon} {children}
  </Link>
);

export default Layout;
