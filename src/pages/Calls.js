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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const CallForm_1 = __importDefault(require("../components/CallForm"));
const Calls = () => {
    const [status, setStatus] = (0, react_1.useState)(null);
    const handleCallSubmit = async (to, text, voice) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE}/api/calls`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Optional auth
                    // 'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
                },
                body: JSON.stringify({ to, text, voice }),
            });
            const data = await response.json();
            if (response.ok) {
                setStatus(`✅ Call placed successfully: ${JSON.stringify(data.result)}`);
            }
            else {
                setStatus(`❌ Error: ${data.error}`);
            }
        }
        catch (err) {
            setStatus(`❌ Error: ${err.message}`);
        }
    };
    return (<div style={{ padding: '2rem' }}>
      <h2>Voice Calls</h2>
      <p>Trigger a voice call with Botari AI using Vonage TTS.</p>
      <CallForm_1.default onSubmit={handleCallSubmit}/>
      {status && (<div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f8d7da', color: '#721c24' }}>
          {status}
        </div>)}
    </div>);
};
exports.default = Calls;
//# sourceMappingURL=Calls.js.map