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
const react_router_dom_1 = require("react-router-dom");
const lucide_react_1 = require("lucide-react");
const LandingPage = () => {
    const [scrolled, setScrolled] = (0, react_1.useState)(false);
    const [activeFeature, setActiveFeature] = (0, react_1.useState)(0);
    const features = [
        { icon: <lucide_react_1.MessageCircle size={24}/>, title: "Answers WhatsApp 24/7", desc: "Customers ask about prices? Amina checks your inventory and replies instantly. Even at 2 AM." },
        { icon: <lucide_react_1.Calendar size={24}/>, title: "Books Appointments", desc: "She checks your calendar and schedules customers. Sends reminders. Reduces no-shows by 80%." },
        { icon: <lucide_react_1.TrendingUp size={24}/>, title: "Speaks Local Languages", desc: "English, Swahili, Yoruba, Pidgin. She understands 'How much?' and 'E get work?'" },
        { icon: <lucide_react_1.Phone size={24}/>, title: "Takes Voice Notes", desc: "Customers send voice messages? She transcribes, understands, and responds. Perfect for busy traders." }
    ];
    (0, react_1.useEffect)(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        const interval = setInterval(() => {
            setActiveFeature(prev => (prev + 1) % features.length);
        }, 4000);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearInterval(interval);
        };
    }, []);
    return (<div style={{
            minHeight: '100vh',
            backgroundColor: '#0A0A0F',
            color: '#FFFFFF',
            fontFamily: 'Inter, -apple-system, sans-serif',
            overflowX: 'hidden'
        }}>
      {/* Animated Background */}
      <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: `
          radial-gradient(ellipse 80% 50% at 20% 40%, rgba(226, 114, 91, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse 60% 40% at 80% 60%, rgba(226, 114, 91, 0.08) 0%, transparent 50%),
          linear-gradient(180deg, #0A0A0F 0%, #111118 100%)
        `,
            zIndex: 0,
            pointerEvents: 'none'
        }}/>

      {/* Navigation */}
      <nav style={{
            position: 'fixed',
            top: 0, left: 0, right: 0,
            zIndex: 100,
            padding: scrolled ? '16px 48px' : '24px 48px',
            background: scrolled ? 'rgba(10, 10, 15, 0.95)' : 'transparent',
            backdropFilter: scrolled ? 'blur(20px)' : 'none',
            borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
            transition: 'all 0.3s ease',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px',
            background: 'linear-gradient(135deg, #E2725B 0%, #FF8E53 100%)',
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '20px'
        }}>
            🤖
          </div>
          <span style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.5px' }}>
            Botari
          </span>
        </div>
        
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <a href="#features" style={{ color: '#888', textDecoration: 'none', fontSize: '14px', fontWeight: 500, transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = '#888'}>Features</a>
          <a href="#pricing" style={{ color: '#888', textDecoration: 'none', fontSize: '14px', fontWeight: 500, transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = '#888'}>Pricing</a>
          <react_router_dom_1.Link to="/login" style={{ color: '#888', textDecoration: 'none', fontSize: '14px', fontWeight: 500, transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = '#888'}>Sign In</react_router_dom_1.Link>
          <react_router_dom_1.Link to="/register">
            <button style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #E2725B 0%, #FF8E53 100%)',
            border: 'none',
            borderRadius: '8px',
            color: '#000',
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        }} onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(226, 114, 91, 0.3)';
        }} onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
        }}>
              Start Hiring <lucide_react_1.ArrowRight size={16}/>
            </button>
          </react_router_dom_1.Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
            position: 'relative',
            zIndex: 1,
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            padding: '0 48px',
            paddingTop: '100px'
        }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          
          {/* Left: Copy */}
          <div>
            <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: 'rgba(226, 114, 91, 0.1)',
            border: '1px solid rgba(226, 114, 91, 0.2)',
            borderRadius: '100px',
            marginBottom: '32px'
        }}>
              <span style={{ width: '8px', height: '8px', background: '#E2725B', borderRadius: '50%', animation: 'pulse 2s infinite' }}/>
              <span style={{ fontSize: '13px', color: '#E2725B', fontWeight: 500 }}>Now Live in Lagos & Nairobi 🚀</span>
            </div>
            
            <h1 style={{
            fontSize: '64px',
            lineHeight: '1.1',
            fontWeight: 800,
            margin: '0 0 24px 0',
            letterSpacing: '-2px',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #A0A0B0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
        }}>
              Hire Amina for $49/month.<br />
              She Answers Your WhatsApp,<br />
              While You Sleep.
            </h1>
            
            <p style={{
            fontSize: '20px',
            lineHeight: '1.6',
            color: '#888',
            margin: '0 0 40px 0',
            maxWidth: '540px'
        }}>
              Botari is the first AI employee built for African businesses. She speaks English, Swahili, and Pidgin. Works on WhatsApp. No training needed.
            </p>
            
            <div style={{ display: 'flex', gap: '16px', marginBottom: '48px' }}>
              <react_router_dom_1.Link to="/register" style={{ textDecoration: 'none' }}>
                <button style={{
            padding: '18px 36px',
            background: 'linear-gradient(135deg, #E2725B 0%, #FF8E53 100%)',
            border: 'none',
            borderRadius: '12px',
            color: '#000',
            fontWeight: 600,
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        }} onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(226, 114, 91, 0.4)';
        }} onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
        }}>
                  Hire Amina Now <lucide_react_1.ArrowRight size={20}/>
                </button>
              </react_router_dom_1.Link>
              
              <button style={{
            padding: '18px 36px',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '12px',
            color: '#fff',
            fontWeight: 600,
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        }} onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
        }} onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
        }}>
                <lucide_react_1.Play size={18} fill="currentColor"/> See Demo
              </button>
            </div>
            
            {/* Trust Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex' }}>
                  {[1, 2, 3, 4, 5].map(i => (<span key={i} style={{ color: '#FFD700', fontSize: '14px' }}>★</span>))}
                </div>
                <span style={{ fontSize: '14px', color: '#666' }}>Trusted by 50+ shops</span>
              </div>
              <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)' }}/>
              <span style={{ fontSize: '14px', color: '#666' }}>Yaba Market & Westlands</span>
            </div>
          </div>

          {/* Right: Interactive Feature Preview */}
          <div style={{ position: 'relative' }}>
            {/* Main Preview Card */}
            <div style={{
            width: '100%',
            maxWidth: '480px',
            background: 'linear-gradient(145deg, #1A1A24 0%, #0F0F14 100%)',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 50px 100px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
            margin: '0 auto',
            position: 'relative',
            zIndex: 2,
            border: '1px solid rgba(255,255,255,0.05)'
        }}>
              {/* Phone Mockup Header */}
              <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px',
            background: 'linear-gradient(180deg, rgba(226,114,91,0.15) 0%, transparent 100%)',
            borderRadius: '16px',
            marginBottom: '24px'
        }}>
                <div style={{
            width: '48px', height: '48px',
            background: 'linear-gradient(135deg, #E2725B 0%, #FF8E53 100%)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px'
        }}>
                  💬
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '16px' }}>Botari Amina</div>
                  <div style={{ fontSize: '13px', color: '#4ADE80', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', background: '#4ADE80', borderRadius: '50%', animation: 'pulse 2s infinite' }}/>
                    Online now — Typically replies instantly
                  </div>
                </div>
              </div>
              
              {/* Chat Preview */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{
            maxWidth: '85%',
            padding: '16px',
            background: 'rgba(226, 114, 91, 0.15)',
            borderRadius: '16px 16px 16px 4px',
            marginBottom: '12px',
            fontSize: '15px',
            lineHeight: '1.5',
            color: '#fff'
        }}>
                  Habari! 👋 I'm Amina, your WhatsApp sales assistant. I can check inventory, take orders, and book appointments. How can I help you today?
                </div>
                
                <div style={{
            maxWidth: '70%',
            marginLeft: 'auto',
            padding: '12px 16px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '16px 16px 4px 16px',
            fontSize: '15px',
            color: '#fff',
            marginBottom: '12px'
        }}>
                  How much is the rice?
                </div>

                <div style={{
            maxWidth: '85%',
            padding: '16px',
            background: 'rgba(226, 114, 91, 0.15)',
            borderRadius: '16px 16px 16px 4px',
            fontSize: '15px',
            lineHeight: '1.5',
            color: '#fff'
        }}>
                  Our premium rice is ₦2,500 per bag. We have 45 bags in stock. Would you like me to reserve one for you? I can also arrange delivery within Lagos for ₦500.
                </div>
              </div>

              {/* Feature Selector */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {features.map((feature, idx) => (<button key={idx} onClick={() => setActiveFeature(idx)} onMouseEnter={() => setActiveFeature(idx)} style={{
                padding: '10px 16px',
                background: activeFeature === idx ? 'rgba(226, 114, 91, 0.2)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${activeFeature === idx ? 'rgba(226, 114, 91, 0.4)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '10px',
                color: activeFeature === idx ? '#E2725B' : '#888',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                    {feature.icon}
                    {feature.title.split(' ')[0]}
                  </button>))}
              </div>

              {/* Active Feature Description */}
              <div style={{
            marginTop: '20px',
            padding: '16px',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.05)'
        }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#E2725B', fontSize: '14px' }}>{features[activeFeature].title}</h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#888', lineHeight: '1.5' }}>{features[activeFeature].desc}</p>
              </div>
            </div>
            
            {/* Floating Stats */}
            <div style={{
            position: 'absolute',
            top: '10%',
            right: '-20px',
            padding: '16px 20px',
            background: 'rgba(26, 26, 36, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            zIndex: 3,
            animation: 'float 3s ease-in-out infinite'
        }}>
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Response time</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#4ADE80' }}>&lt; 3s</div>
            </div>
            
            <div style={{
            position: 'absolute',
            bottom: '20%',
            left: '-40px',
            padding: '16px 20px',
            background: 'rgba(26, 26, 36, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            zIndex: 3,
            animation: 'float 3s ease-in-out infinite 0.5s'
        }}>
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Languages</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#E2725B' }}>4+</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="features" style={{
            position: 'relative',
            zIndex: 1,
            padding: '120px 48px',
            background: 'linear-gradient(180deg, transparent 0%, rgba(226,114,91,0.03) 50%, transparent 100%)'
        }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{
            fontSize: '48px',
            fontWeight: 700,
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #A0A0B0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
        }}>
              She Works While You Sleep
            </h2>
            <p style={{ fontSize: '18px', color: '#888', maxWidth: '600px', margin: '0 auto' }}>
              Amina handles the repetitive tasks so you can focus on growing your business.
            </p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
        }}>
            {features.map((feature, idx) => (<div key={idx} style={{
                padding: '32px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '20px',
                transition: 'all 0.3s',
                cursor: 'default'
            }} onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(226,114,91,0.05)';
                e.currentTarget.style.borderColor = 'rgba(226,114,91,0.2)';
                e.currentTarget.style.transform = 'translateY(-4px)';
            }} onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
            }}>
                <div style={{
                width: '56px', height: '56px',
                background: 'linear-gradient(135deg, rgba(226,114,91,0.2) 0%, rgba(226,114,91,0.05) 100%)',
                borderRadius: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#E2725B',
                marginBottom: '24px'
            }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px', color: '#fff' }}>{feature.title}</h3>
                <p style={{ color: '#888', lineHeight: '1.6', fontSize: '15px' }}>{feature.desc}</p>
              </div>))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{
            position: 'relative',
            zIndex: 1,
            padding: '120px 48px',
            textAlign: 'center'
        }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '48px',
            fontWeight: 700,
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #A0A0B0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
        }}>
            One Price. No Hidden Fees.
          </h2>
          <p style={{ fontSize: '18px', color: '#888', marginBottom: '60px' }}>
            Start with Amina. Upgrade as you grow.
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            maxWidth: '1000px',
            margin: '0 auto'
        }}>
            {/* Starter */}
            <div style={{
            padding: '40px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '24px',
            textAlign: 'left'
        }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>Starter</h3>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>Perfect for solopreneurs</p>
              <div style={{ marginBottom: '32px' }}>
                <span style={{ fontSize: '56px', fontWeight: 700, color: '#fff' }}>$49</span>
                <span style={{ color: '#666' }}>/month</span>
              </div>
              <react_router_dom_1.Link to="/register" style={{ textDecoration: 'none' }}>
                <button style={{
            width: '100%',
            padding: '16px',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '12px',
            color: '#fff',
            fontWeight: 600,
            fontSize: '15px',
            cursor: 'pointer',
            transition: 'all 0.3s',
            marginBottom: '32px'
        }} onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
        }} onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
        }}>
                  Start with Amina
                </button>
              </react_router_dom_1.Link>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['Amina (WhatsApp sales)', '500 conversations/mo', 'Basic inventory tracking', 'Swahili & Pidgin support', 'Email support'].map(feature => (<li key={feature} style={{ fontSize: '14px', color: '#aaa', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: '#4ADE80', fontSize: '16px' }}>✓</span> {feature}
                  </li>))}
              </ul>
            </div>

            {/* Professional - Featured */}
            <div style={{
            padding: '40px',
            background: 'linear-gradient(145deg, rgba(226,114,91,0.1) 0%, rgba(226,114,91,0.02) 100%)',
            border: '2px solid #E2725B',
            borderRadius: '24px',
            textAlign: 'left',
            position: 'relative',
            transform: 'scale(1.02)'
        }}>
              <div style={{
            position: 'absolute',
            top: '-14px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '6px 16px',
            background: '#E2725B',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 600,
            color: '#000'
        }}>
                Most Popular
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>Professional</h3>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>For growing businesses</p>
              <div style={{ marginBottom: '32px' }}>
                <span style={{ fontSize: '56px', fontWeight: 700, color: '#fff' }}>$99</span>
                <span style={{ color: '#666' }}>/month</span>
              </div>
              <react_router_dom_1.Link to="/register" style={{ textDecoration: 'none' }}>
                <button style={{
            width: '100%',
            padding: '16px',
            background: 'linear-gradient(135deg, #E2725B 0%, #FF8E53 100%)',
            border: 'none',
            borderRadius: '12px',
            color: '#000',
            fontWeight: 600,
            fontSize: '15px',
            cursor: 'pointer',
            transition: 'all 0.3s',
            marginBottom: '32px'
        }} onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(226, 114, 91, 0.3)';
        }} onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
        }}>
                  Build Your AI Team
                </button>
              </react_router_dom_1.Link>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['Amina + Stan + Eva', 'Unlimited conversations', 'Advanced analytics', 'Priority support', 'Custom AI training'].map(feature => (<li key={feature} style={{ fontSize: '14px', color: '#ccc', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: '#4ADE80', fontSize: '16px' }}>✓</span> {feature}
                  </li>))}
              </ul>
            </div>
          </div>

          <p style={{ fontSize: '14px', color: '#666', marginTop: '32px' }}>
            7-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
            position: 'relative',
            zIndex: 1,
            padding: '120px 48px',
            textAlign: 'center'
        }}>
        <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '80px 60px',
            background: 'linear-gradient(145deg, rgba(226,114,91,0.1) 0%, transparent 100%)',
            borderRadius: '32px',
            border: '1px solid rgba(226,114,91,0.2)'
        }}>
          <h2 style={{
            fontSize: '40px',
            fontWeight: 700,
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #A0A0B0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
        }}>
            Ready to meet your AI team?
          </h2>
          <p style={{ fontSize: '18px', color: '#888', marginBottom: '40px' }}>
            Join 50+ businesses in Lagos and Nairobi already using Botari.
          </p>
          <react_router_dom_1.Link to="/register" style={{ textDecoration: 'none' }}>
            <button style={{
            padding: '20px 48px',
            background: 'linear-gradient(135deg, #E2725B 0%, #FF8E53 100%)',
            border: 'none',
            borderRadius: '16px',
            color: '#000',
            fontWeight: 600,
            fontSize: '18px',
            cursor: 'pointer',
            transition: 'all 0.3s',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px'
        }} onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 20px 60px rgba(226, 114, 91, 0.4)';
        }} onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = 'none';
        }}>
              Start Free Trial <lucide_react_1.ArrowRight size={22}/>
            </button>
          </react_router_dom_1.Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
            position: 'relative',
            zIndex: 1,
            padding: '60px 48px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            background: 'rgba(0,0,0,0.3)'
        }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
            width: '40px', height: '40px',
            background: 'linear-gradient(135deg, #E2725B 0%, #FF8E53 100%)',
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '20px'
        }}>
                🤖
              </div>
              <span style={{ fontSize: '24px', fontWeight: 700 }}>Botari</span>
            </div>
            <p style={{ fontSize: '14px', color: '#666', maxWidth: '300px', lineHeight: '1.6' }}>
              AI employees for African businesses. Work smarter, not harder.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '60px' }}>
            <div>
              <h4 style={{ fontSize: '14px', marginBottom: '16px', color: '#fff', fontWeight: 600 }}>Product</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: '#666' }}>
                {['AI Team', 'Pricing', 'Integrations', 'API'].map(item => (<li key={item} style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = '#666'}>{item}</li>))}
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: '14px', marginBottom: '16px', color: '#fff', fontWeight: 600 }}>Company</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: '#666' }}>
                {['About', 'Blog', 'Careers', 'Contact'].map(item => (<li key={item} style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = '#666'}>{item}</li>))}
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: '14px', marginBottom: '16px', color: '#fff', fontWeight: 600 }}>Legal</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: '#666' }}>
                {['Privacy', 'Terms', 'Security'].map(item => (<li key={item} style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = '#666'}>{item}</li>))}
              </ul>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: '1400px', margin: '40px auto 0', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', fontSize: '13px', color: '#444' }}>
          © 2024 Botari. Built for African businesses.
        </div>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>);
};
exports.default = LandingPage;
//# sourceMappingURL=LandingPage.js.map