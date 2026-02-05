import React, { useState } from 'react';
import axios from 'axios';
import { 
    Globe, Mail, Share2, FileText, CheckCircle, 
    ArrowRight, Sparkles, Zap, Target
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

interface OnboardingData {
    useCase: string;
    industry: string;
    websiteUrl: string;
    businessSize: string;
    emailVolume: string;
    socialFrequency: string;
    contentFrequency: string;
    painPoints: string[];
    goals: string[];
    brandVoice: string;
}

const industries = [
    "E-commerce", "SaaS", "Agency", "Consulting", "Healthcare", 
    "Real Estate", "Education", "Finance", "Restaurant", "Retail",
    "Technology", "Marketing", "Legal", "Construction", "Other"
];

const painPointsList = [
    "Too many repetitive customer inquiries",
    "Missing leads while sleeping/offline",
    "Inconsistent social media presence",
    "Overwhelmed by email volume",
    "No time for content creation",
    "Slow customer response times",
    "Can't keep up with competitors"
];

const OnboardingWizard: React.FC = () => {
    const [step, setStep] = useState(1);
    const [analysisComplete, setAnalysisComplete] = useState(false);
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [error, setError] = useState('');
    
    const [data, setData] = useState<OnboardingData>({
        useCase: '',
        industry: '',
        websiteUrl: '',
        businessSize: '',
        emailVolume: '',
        socialFrequency: '',
        contentFrequency: '',
        painPoints: [],
        goals: [],
        brandVoice: 'professional'
    });

    const handleNext = () => {
        if (step < 5) {
            setStep(step + 1);
        } else {
            handleAnalyze();
        }
    };

    const handleAnalyze = async () => {
        setStep(6); // Move to analysis step
        
        try {
            const token = localStorage.getItem('jwt') || localStorage.getItem('token');
            
            if (!token) {
                throw new Error('No authentication token found');
            }
            
            // Save context
            await axios.post(`${API_URL}/api/business/context`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Trigger analysis
            const analysisRes = await axios.post(`${API_URL}/api/business/analyze`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setRecommendations(analysisRes.data.recommendations || []);
            setAnalysisComplete(true);
            
            // Mark onboarding complete
            localStorage.setItem('onboarding_complete', 'true');
            
            // Force full page reload to trigger OnboardingCheck properly
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 3000);
            
        } catch (error: any) {
            console.error('Onboarding error:', error);
            setError(error.response?.data?.error || error.message || 'Failed to complete setup');
        }
    };

    const togglePainPoint = (point: string) => {
        const current = data.painPoints;
        if (current.includes(point)) {
            setData({...data, painPoints: current.filter(p => p !== point)});
        } else {
            setData({...data, painPoints: [...current, point]});
        }
    };

    const renderStep = () => {
        switch(step) {
            case 1:
                return (
                    <div style={{textAlign: 'center', animation: 'fadeIn 0.5s'}}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #E2725B 0%, #B91C1C 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px',
                            boxShadow: '0 0 40px rgba(226,114,91,0.3)'
                        }}>
                            <Zap size={40} color="white" />
                        </div>
                        <h2 style={{fontSize: '36px', marginBottom: '16px', fontWeight: 'bold'}}>
                            Let's build your AI team
                        </h2>
                        <p style={{color: '#888', fontSize: '18px', marginBottom: '40px', maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto'}}>
                            We'll analyze your business and configure each AI employee to match your specific needs.
                        </p>
                        
                        <div style={{display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '500px', margin: '0 auto'}}>
                            {[
                                {id: 'business', icon: '🏢', title: 'Business Operations', desc: 'Customer support, sales, and admin automation'},
                                {id: 'personal', icon: '👤', title: 'Personal Productivity', desc: 'Email, scheduling, and task management'},
                                {id: 'agency', icon: '🚀', title: 'Agency Scale', desc: 'Client work, content, and lead generation'}
                            ].map(option => (
                                <div
                                    key={option.id}
                                    onClick={() => {setData({...data, useCase: option.id}); handleNext();}}
                                    style={{
                                        padding: '28px',
                                        borderRadius: '16px',
                                        border: data.useCase === option.id ? '2px solid #E2725B' : '2px solid rgba(255,255,255,0.1)',
                                        background: data.useCase === option.id ? 'rgba(226,114,91,0.1)' : 'rgba(255,255,255,0.03)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '20px',
                                        transition: 'all 0.3s',
                                        textAlign: 'left'
                                    }}
                                >
                                    <span style={{fontSize: '40px'}}>{option.icon}</span>
                                    <div style={{flex: 1}}>
                                        <h3 style={{margin: '0 0 6px 0', fontSize: '20px'}}>{option.title}</h3>
                                        <p style={{margin: 0, color: '#888', fontSize: '15px'}}>{option.desc}</p>
                                    </div>
                                    <ArrowRight style={{opacity: 0.5}} />
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div style={{textAlign: 'center'}}>
                        <h2 style={{fontSize: '32px', marginBottom: '12px'}}>What industry are you in?</h2>
                        <p style={{color: '#888', marginBottom: '40px'}}>This helps us tune the AI's language and knowledge base</p>
                        
                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', maxWidth: '700px', margin: '0 auto'}}>
                            {industries.map(industry => (
                                <button
                                    key={industry}
                                    onClick={() => {setData({...data, industry}); handleNext();}}
                                    style={{
                                        padding: '20px',
                                        borderRadius: '12px',
                                        border: data.industry === industry ? '2px solid #E2725B' : '1px solid rgba(255,255,255,0.1)',
                                        background: data.industry === industry ? 'rgba(226,114,91,0.2)' : 'rgba(255,255,255,0.03)',
                                        color: 'white',
                                        cursor: 'pointer',
                                        fontSize: '15px',
                                        fontWeight: data.industry === industry ? 'bold' : 'normal',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {industry}
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div style={{textAlign: 'center', maxWidth: '500px', margin: '0 auto'}}>
                        <Globe size={48} style={{marginBottom: '24px', color: '#E2725B'}} />
                        <h2 style={{fontSize: '32px', marginBottom: '12px'}}>What's your website?</h2>
                        <p style={{color: '#888', marginBottom: '32px'}}>
                            We'll scan your site to understand your brand voice, products, and current content
                        </p>
                        
                        <div style={{position: 'relative', marginBottom: '24px'}}>
                            <span style={{
                                position: 'absolute',
                                left: '16px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#666'
                            }}>https://</span>
                            <input
                                type="text"
                                placeholder="yourbusiness.com"
                                value={data.websiteUrl}
                                onChange={(e) => setData({...data, websiteUrl: e.target.value})}
                                style={{
                                    width: '100%',
                                    padding: '18px 16px 18px 80px',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    background: 'rgba(255,255,255,0.05)',
                                    color: 'white',
                                    fontSize: '18px',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <button
                            onClick={handleNext}
                            disabled={!data.websiteUrl}
                            style={{
                                width: '100%',
                                padding: '18px',
                                background: data.websiteUrl ? '#E2725B' : 'rgba(255,255,255,0.1)',
                                border: 'none',
                                borderRadius: '12px',
                                color: 'white',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                cursor: data.websiteUrl ? 'pointer' : 'not-allowed',
                                transition: 'all 0.2s'
                            }}
                        >
                            {data.websiteUrl ? 'Analyze My Business' : 'Enter your website'}
                        </button>
                        
                        <button
                            onClick={() => {setData({...data, websiteUrl: 'none'}); handleNext();}}
                            style={{
                                marginTop: '16px',
                                background: 'none',
                                border: 'none',
                                color: '#666',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            I don't have a website yet
                        </button>
                    </div>
                );

            case 4:
                return (
                    <div style={{textAlign: 'center', maxWidth: '600px', margin: '0 auto'}}>
                        <h2 style={{fontSize: '32px', marginBottom: '12px'}}>What's your biggest challenge?</h2>
                        <p style={{color: '#888', marginBottom: '40px'}}>Select all that apply - we'll prioritize these</p>
                        
                        <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                            {painPointsList.map(point => (
                                <div
                                    key={point}
                                    onClick={() => togglePainPoint(point)}
                                    style={{
                                        padding: '20px 24px',
                                        borderRadius: '12px',
                                        border: data.painPoints.includes(point) ? '2px solid #E2725B' : '1px solid rgba(255,255,255,0.1)',
                                        background: data.painPoints.includes(point) ? 'rgba(226,114,91,0.1)' : 'rgba(255,255,255,0.03)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '16px',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '6px',
                                        border: data.painPoints.includes(point) ? 'none' : '2px solid rgba(255,255,255,0.3)',
                                        background: data.painPoints.includes(point) ? '#E2725B' : 'transparent',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {data.painPoints.includes(point) && <CheckCircle size={14} />}
                                    </div>
                                    <span style={{fontSize: '16px'}}>{point}</span>
                                </div>
                            ))}
                        </div>
                        
                        <button
                            onClick={handleNext}
                            disabled={data.painPoints.length === 0}
                            style={{
                                marginTop: '32px',
                                padding: '16px 48px',
                                background: data.painPoints.length > 0 ? '#E2725B' : 'rgba(255,255,255,0.1)',
                                border: 'none',
                                borderRadius: '12px',
                                color: 'white',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                cursor: data.painPoints.length > 0 ? 'pointer' : 'not-allowed'
                            }}
                        >
                            Continue ({data.painPoints.length} selected)
                        </button>
                    </div>
                );

            case 5:
                return (
                    <div style={{textAlign: 'center', maxWidth: '600px', margin: '0 auto'}}>
                        <Target size={48} style={{marginBottom: '24px', color: '#E2725B'}} />
                        <h2 style={{fontSize: '32px', marginBottom: '40px'}}>Current workload</h2>
                        
                        <div style={{display: 'flex', flexDirection: 'column', gap: '32px'}}>
                            
                            <div style={{textAlign: 'left'}}>
                                <label style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', fontSize: '16px'}}>
                                    <Mail size={20} color="#8B5CF6" /> 
                                    Daily email volume?
                                </label>
                                <div style={{display: 'flex', gap: '12px'}}>
                                    {['< 10', '10-50', '50-200', '200+'].map(option => (
                                        <button
                                            key={option}
                                            onClick={() => setData({...data, emailVolume: option})}
                                            style={{
                                                flex: 1,
                                                padding: '16px',
                                                borderRadius: '10px',
                                                border: data.emailVolume === option ? '2px solid #8B5CF6' : '1px solid rgba(255,255,255,0.1)',
                                                background: data.emailVolume === option ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.03)',
                                                color: 'white',
                                                cursor: 'pointer',
                                                fontWeight: data.emailVolume === option ? 'bold' : 'normal'
                                            }}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={{textAlign: 'left'}}>
                                <label style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', fontSize: '16px'}}>
                                    <Share2 size={20} color="#EC4899" /> 
                                    Social media frequency?
                                </label>
                                <div style={{display: 'flex', gap: '12px'}}>
                                    {['Never', 'Weekly', 'Daily', 'Multiple/day'].map(option => (
                                        <button
                                            key={option}
                                            onClick={() => setData({...data, socialFrequency: option})}
                                            style={{
                                                flex: 1,
                                                padding: '16px',
                                                borderRadius: '10px',
                                                border: data.socialFrequency === option ? '2px solid #EC4899' : '1px solid rgba(255,255,255,0.1)',
                                                background: data.socialFrequency === option ? 'rgba(236,72,153,0.2)' : 'rgba(255,255,255,0.03)',
                                                color: 'white',
                                                cursor: 'pointer',
                                                fontWeight: data.socialFrequency === option ? 'bold' : 'normal'
                                            }}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={{textAlign: 'left'}}>
                                <label style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', fontSize: '16px'}}>
                                    <FileText size={20} color="#06B6D4" /> 
                                    Content creation?
                                </label>
                                <div style={{display: 'flex', gap: '12px'}}>
                                    {['Never', 'Monthly', 'Weekly', 'Daily'].map(option => (
                                        <button
                                            key={option}
                                            onClick={() => setData({...data, contentFrequency: option})}
                                            style={{
                                                flex: 1,
                                                padding: '16px',
                                                borderRadius: '10px',
                                                border: data.contentFrequency === option ? '2px solid #06B6D4' : '1px solid rgba(255,255,255,0.1)',
                                                background: data.contentFrequency === option ? 'rgba(6,182,212,0.2)' : 'rgba(255,255,255,0.03)',
                                                color: 'white',
                                                cursor: 'pointer',
                                                fontWeight: data.contentFrequency === option ? 'bold' : 'normal'
                                            }}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>

                        </div>
                        
                        <button
                            onClick={handleNext}
                            style={{
                                marginTop: '40px',
                                padding: '18px 64px',
                                background: '#E2725B',
                                border: 'none',
                                borderRadius: '12px',
                                color: 'white',
                                fontSize: '18px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                boxShadow: '0 4px 20px rgba(226,114,91,0.3)'
                            }}
                        >
                            Configure My AI Team
                        </button>
                    </div>
                );

            case 6:
                return (
                    <div style={{textAlign: 'center'}}>
                        {error ? (
                            <div style={{color: '#ef4444', padding: '20px'}}>
                                <h3>Error</h3>
                                <p>{error}</p>
                                <button onClick={() => setStep(5)} style={{marginTop: '20px', padding: '10px 20px', background: '#E2725B', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer'}}>
                                    Go Back
                                </button>
                            </div>
                        ) : !analysisComplete ? (
                            <>
                                <div style={{
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: '50%',
                                    background: 'rgba(226,114,91,0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 32px',
                                    position: 'relative'
                                }}>
                                    <div style={{
                                        position: 'absolute',
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: '50%',
                                        border: '3px solid transparent',
                                        borderTopColor: '#E2725B',
                                        animation: 'spin 1s linear infinite'
                                    }} />
                                    <Sparkles size={48} color="#E2725B" />
                                </div>
                                <h2 style={{fontSize: '32px', marginBottom: '16px'}}>
                                    Configuring your AI team...
                                </h2>
                                <p style={{color: '#888', marginBottom: '48px', fontSize: '18px'}}>
                                    Based on {data.industry} businesses with similar challenges
                                </p>
                                
                                <div style={{
                                    maxWidth: '400px',
                                    margin: '0 auto',
                                    textAlign: 'left'
                                }}>
                                    {[
                                        {text: `Analyzing ${data.industry} industry patterns`, done: true},
                                        {text: 'Scraping website for brand voice', done: true, skip: data.websiteUrl === 'none'},
                                        {text: 'Calculating optimal email response times', done: true},
                                        {text: 'Generating content calendar template', done: false},
                                        {text: 'Configuring agent handoff protocols', done: false}
                                    ].filter(item => !item.skip).map((item, idx) => (
                                        <div key={idx} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '16px',
                                            marginBottom: '20px',
                                            opacity: item.done ? 1 : 0.5
                                        }}>
                                            <div style={{
                                                width: '24px',
                                                height: '24px',
                                                borderRadius: '50%',
                                                background: item.done ? '#4ADE80' : 'rgba(255,255,255,0.1)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                {item.done ? <CheckCircle size={14} /> : <div style={{width: '8px', height: '8px', borderRadius: '50%', background: '#666'}} />}
                                            </div>
                                            <span style={{fontSize: '16px'}}>{item.text}</span>
                                        </div>
                                    ))}
                                </div>
                                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                            </>
                        ) : (
                            <div style={{animation: 'fadeIn 0.5s'}}>
                                <div style={{
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: '50%',
                                    background: '#4ADE80',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 32px'
                                }}>
                                    <CheckCircle size={56} color="white" />
                                </div>
                                <h2 style={{fontSize: '36px', marginBottom: '16px'}}>Your AI team is ready!</h2>
                                <p style={{color: '#888', marginBottom: '32px', fontSize: '18px'}}>
                                    Based on {data.industry} businesses like yours, you could save <strong>42 hours/month</strong>
                                </p>
                                
                                {recommendations.length > 0 && (
                                    <div style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        padding: '24px',
                                        borderRadius: '16px',
                                        maxWidth: '500px',
                                        margin: '0 auto 32px',
                                        textAlign: 'left'
                                    }}>
                                        <h3 style={{margin: '0 0 16px 0', color: '#E2725B'}}>Recommended First Hire:</h3>
                                        <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                                            <div style={{
                                                width: '50px',
                                                height: '50px',
                                                borderRadius: '12px',
                                                background: recommendations[0].color || '#E2725B',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '24px'
                                            }}>
                                                {recommendations[0].icon}
                                            </div>
                                            <div>
                                                <h4 style={{margin: '0 0 4px 0'}}>{recommendations[0].name}</h4>
                                                <p style={{margin: 0, color: '#888', fontSize: '14px'}}>{recommendations[0].reason}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                <p style={{color: '#666'}}>Redirecting to dashboard...</p>
                                <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
                            </div>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0A0A0F',
            color: 'white',
            padding: '40px 20px',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Progress Bar */}
            {step < 6 && (
                <div style={{maxWidth: '600px', margin: '0 auto 60px', width: '100%'}}>
                    <div style={{display: 'flex', gap: '8px'}}>
                        {[1,2,3,4,5].map(i => (
                            <div
                                key={i}
                                style={{
                                    flex: 1,
                                    height: '4px',
                                    borderRadius: '2px',
                                    background: i <= step ? '#E2725B' : 'rgba(255,255,255,0.1)',
                                    transition: 'background 0.3s'
                                }}
                            />
                        ))}
                    </div>
                    <div style={{textAlign: 'center', marginTop: '16px', color: '#666', fontSize: '14px'}}>
                        Step {step} of 5
                    </div>
                </div>
            )}

            {/* Content */}
            <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{maxWidth: '800px', width: '100%'}}>
                    {renderStep()}
                </div>
            </div>
        </div>
    );
};

export default OnboardingWizard;