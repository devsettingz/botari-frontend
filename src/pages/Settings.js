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
const Settings = () => {
    const [darkMode, setDarkMode] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const saved = localStorage.getItem('darkMode');
        if (saved === 'true') {
            setDarkMode(true);
            document.getElementById('root')?.classList.add('dark-mode');
        }
    }, []);
    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem('darkMode', newMode.toString());
        const root = document.getElementById('root');
        if (root) {
            if (newMode)
                root.classList.add('dark-mode');
            else
                root.classList.remove('dark-mode');
        }
    };
    const handleLogout = () => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('business_id');
        localStorage.removeItem('business_name');
        window.location.href = '/login';
    };
    return (<div style={{ padding: '2rem' }}>
      <h1>⚙️ Settings</h1>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Appearance</h2>
        <button onClick={toggleDarkMode} style={{
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            background: darkMode ? '#007bff' : '#f8f9fa',
            color: darkMode ? '#fff' : '#333',
        }}>
          {darkMode ? '🌙 Dark Mode Enabled' : '☀️ Light Mode Enabled'}
        </button>
      </section>

      <section>
        <h2>Account</h2>
        <button onClick={handleLogout} style={{
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            background: '#dc3545',
            color: '#fff',
        }}>
          Logout
        </button>
      </section>
    </div>);
};
exports.default = Settings;
//# sourceMappingURL=Settings.js.map