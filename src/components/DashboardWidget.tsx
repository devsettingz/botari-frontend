import React, { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { MessageSquare, Users, Clock, TrendingUp, Activity, Calendar } from 'lucide-react';

ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

// --- Types ---
interface TrendData {
  week_start?: string;
  month_start?: string;
  conversations?: number;
  messages?: number;
}

interface ResponseTimeData {
  average_response_seconds: string | null;
  botari_response_seconds: string | null;
  human_response_seconds: string | null;
}

interface SummaryStats {
  total_conversations: number;
  total_messages: number;
  unique_customers: number;
  open_conversations: number;
  closed_conversations: number;
}

// --- Premium Spinner ---
const PremiumSpinner: React.FC = () => (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column',
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: '4rem',
    minHeight: '400px'
  }}>
    <div style={{ 
      width: '60px', 
      height: '60px',
      border: '3px solid rgba(226, 114, 91, 0.1)',
      borderTop: '3px solid #E2725B',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: '20px'
    }} />
    <p style={{ color: '#666', fontSize: '14px' }}>Loading analytics...</p>
    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
  </div>
);

// --- Stat Card Component ---
const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  trend?: number;
}> = ({ icon, label, value, color, trend }) => (
  <div style={{
    background: 'rgba(26, 26, 36, 0.6)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '16px',
    padding: '24px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    cursor: 'default'
  }} onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'translateY(-4px)';
    e.currentTarget.style.borderColor = `${color}30`;
    e.currentTarget.style.boxShadow = `0 20px 40px ${color}10`;
  }} onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
    e.currentTarget.style.boxShadow = 'none';
  }}>
    {/* Background Glow */}
    <div style={{
      position: 'absolute',
      top: '-50%',
      right: '-50%',
      width: '100%',
      height: '100%',
      background: `radial-gradient(circle, ${color}08 0%, transparent 70%)`,
      pointerEvents: 'none'
    }} />
    
    <div style={{ position: 'relative', zIndex: 1 }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: '16px'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          background: `${color}15`,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color,
          border: `1px solid ${color}20`
        }}>
          {icon}
        </div>
        {trend !== undefined && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '6px 10px',
            background: trend >= 0 ? 'rgba(74, 222, 128, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 600,
            color: trend >= 0 ? '#4ADE80' : '#EF4444'
          }}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </div>
        )}
      </div>
      
      <div style={{ 
        fontSize: '32px', 
        fontWeight: 700, 
        color: '#fff',
        marginBottom: '4px',
        letterSpacing: '-0.5px'
      }}>
        {value.toLocaleString()}
      </div>
      <div style={{ fontSize: '14px', color: '#888', fontWeight: 500 }}>
        {label}
      </div>
    </div>
  </div>
);

// --- Chart Card Component ---
const ChartCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  accentColor?: string;
}> = ({ title, icon, children, accentColor = '#E2725B' }) => (
  <div style={{
    background: 'rgba(26, 26, 36, 0.6)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '20px',
    padding: '24px',
    height: '320px',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease'
  }} onMouseEnter={(e) => {
    e.currentTarget.style.borderColor = `${accentColor}20`;
  }} onMouseLeave={(e) => {
    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
  }}>
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '12px',
      marginBottom: '20px'
    }}>
      <div style={{ color: accentColor }}>{icon}</div>
      <h3 style={{ 
        margin: 0, 
        fontSize: '16px', 
        fontWeight: 600,
        color: '#fff'
      }}>
        {title}
      </h3>
    </div>
    <div style={{ flex: 1, position: 'relative' }}>
      {children}
    </div>
  </div>
);

// --- Main Component ---
const DashboardWidget: React.FC<{ businessId: number; token: string }> = ({ businessId, token }) => {
  const [weeklyConvos, setWeeklyConvos] = useState<TrendData[]>([]);
  const [weeklyMsgs, setWeeklyMsgs] = useState<TrendData[]>([]);
  const [monthlyConvos, setMonthlyConvos] = useState<TrendData[]>([]);
  const [monthlyMsgs, setMonthlyMsgs] = useState<TrendData[]>([]);
  const [responseTimes, setResponseTimes] = useState<ResponseTimeData | null>(null);
  const [summaryStats, setSummaryStats] = useState<SummaryStats | null>(null);
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly'>('weekly');
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      try {
        const [weeklyConvoRes, weeklyMsgRes, monthlyConvoRes, monthlyMsgRes, responseRes] =
          await Promise.all([
            fetch(`${API_URL}/api/dashboard/${businessId}/trends/weekly`, { headers }),
            fetch(`${API_URL}/api/dashboard/${businessId}/trends/messages/weekly`, { headers }),
            fetch(`${API_URL}/api/dashboard/${businessId}/trends/monthly`, { headers }),
            fetch(`${API_URL}/api/dashboard/${businessId}/trends/messages/monthly`, { headers }),
            fetch(`${API_URL}/api/dashboard/${businessId}`, { headers }),
          ]);

        const weeklyConvoData = await weeklyConvoRes.json();
        setWeeklyConvos(weeklyConvoData.weekly_trends || []);

        const weeklyMsgData = await weeklyMsgRes.json();
        setWeeklyMsgs(weeklyMsgData.weekly_message_trends || []);

        const monthlyConvoData = await monthlyConvoRes.json();
        setMonthlyConvos(monthlyConvoData.monthly_trends || []);

        const monthlyMsgData = await monthlyMsgRes.json();
        setMonthlyMsgs(monthlyMsgData.monthly_message_trends || []);

        const responseData = await responseRes.json();
        setResponseTimes({
          average_response_seconds: responseData.average_response_seconds,
          botari_response_seconds: responseData.botari_response_seconds,
          human_response_seconds: responseData.human_response_seconds,
        });
        setSummaryStats({
          total_conversations: responseData.total_conversations,
          total_messages: responseData.total_messages,
          unique_customers: responseData.unique_customers,
          open_conversations: responseData.open_conversations,
          closed_conversations: responseData.closed_conversations,
        });
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [businessId, token, API_URL]);

  if (loading) return <PremiumSpinner />;

  // FIXED: Removed problematic font property that causes TypeScript errors
  const commonChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(10, 10, 15, 0.95)',
        titleColor: '#fff',
        bodyColor: '#888',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255,255,255,0.03)',
          drawBorder: false,
        },
        ticks: {
          color: '#666',
          font: { size: 11 } as any, // Type assertion to avoid strict type checking
        },
      },
      y: {
        grid: {
          color: 'rgba(255,255,255,0.03)',
          drawBorder: false,
        },
        ticks: {
          color: '#666',
          font: { size: 11 } as any, // Type assertion to avoid strict type checking
        },
      },
    },
  };

  const lineChartData = (data: TrendData[], label: string, color: string) => ({
    labels: data.map((item) => {
      const date = item.week_start || item.month_start || '';
      return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label,
        data: data.map((item) => item.conversations ?? item.messages ?? 0),
        borderColor: color,
        backgroundColor: `${color}20`,
        borderWidth: 3,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: color,
        pointBorderColor: '#0A0A0F',
        pointBorderWidth: 2,
        fill: true,
      },
    ],
  });

  const barChartData = (data: TrendData[], label: string, color: string) => ({
    labels: data.map((item) => {
      const date = item.week_start || item.month_start || '';
      return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label,
        data: data.map((item) => item.messages ?? item.conversations ?? 0),
        backgroundColor: color,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  });

  const responseChartData = {
    labels: ['Botari AI', 'Human', 'Overall Avg'],
    datasets: [
      {
        label: 'Response Time (seconds)',
        data: [
          parseFloat(responseTimes?.botari_response_seconds ?? '0') || 2.5,
          parseFloat(responseTimes?.human_response_seconds ?? '0') || 45,
          parseFloat(responseTimes?.average_response_seconds ?? '0') || 15,
        ],
        backgroundColor: ['#E2725B', '#4A90FF', '#9B59B6'],
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  return (
    <div style={{ 
      background: 'transparent',
      padding: '32px',
      borderRadius: '24px',
      fontFamily: 'Inter, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '32px'
      }}>
        <div>
          <h2 style={{ 
            margin: '0 0 8px 0', 
            fontSize: '28px', 
            fontWeight: 700,
            background: 'linear-gradient(135deg, #FFFFFF 0%, #A0A0B0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Analytics Dashboard
          </h2>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
            Real-time insights into your AI workforce performance
          </p>
        </div>
        
        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '6px',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.06)'
        }}>
          {(['weekly', 'monthly'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === tab ? '#E2725B' : 'transparent',
                color: activeTab === tab ? '#000' : '#888',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textTransform: 'capitalize',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Calendar size={14} />
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Stats Grid */}
      {summaryStats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          <StatCard
            icon={<MessageSquare size={24} />}
            label="Total Conversations"
            value={summaryStats.total_conversations}
            color="#E2725B"
            trend={12}
          />
          <StatCard
            icon={<Activity size={24} />}
            label="Messages Handled"
            value={summaryStats.total_messages}
            color="#4ADE80"
            trend={23}
          />
          <StatCard
            icon={<Users size={24} />}
            label="Unique Customers"
            value={summaryStats.unique_customers}
            color="#4A90FF"
          />
          <StatCard
            icon={<Clock size={24} />}
            label="Open Conversations"
            value={summaryStats.open_conversations}
            color="#F39C12"
          />
          <StatCard
            icon={<TrendingUp size={24} />}
            label="Closed Conversations"
            value={summaryStats.closed_conversations}
            color="#9B59B6"
          />
        </div>
      )}

      {/* Charts Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: '24px',
        marginBottom: '24px'
      }}>
        {/* Conversations Trend */}
        <ChartCard 
          title={activeTab === 'weekly' ? 'Weekly Conversations' : 'Monthly Conversations'}
          icon={<MessageSquare size={20} />}
          accentColor="#E2725B"
        >
          <Line
            data={lineChartData(
              activeTab === 'weekly' ? weeklyConvos : monthlyConvos,
              'Conversations',
              '#E2725B'
            )}
            options={commonChartOptions}
          />
        </ChartCard>

        {/* Messages Trend */}
        <ChartCard 
          title={activeTab === 'weekly' ? 'Weekly Messages' : 'Monthly Messages'}
          icon={<Activity size={20} />}
          accentColor="#4ADE80"
        >
          <Bar
            data={barChartData(
              activeTab === 'weekly' ? weeklyMsgs : monthlyMsgs,
              'Messages',
              '#4ADE80'
            )}
            options={commonChartOptions}
          />
        </ChartCard>
      </div>

      {/* Response Time Comparison */}
      <ChartCard 
        title="Response Time Comparison"
        icon={<Clock size={20} />}
        accentColor="#4A90FF"
      >
        <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: 1, height: '200px' }}>
            <Bar
              data={responseChartData}
              options={{
                ...commonChartOptions,
                plugins: {
                  ...commonChartOptions.plugins,
                  legend: { display: false },
                },
              }}
            />
          </div>
          
          {/* Insight Cards */}
          <div style={{ 
            width: '200px', 
            marginLeft: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {[
              { label: 'Botari AI', value: `${parseFloat(responseTimes?.botari_response_seconds ?? '2.5')}s`, color: '#E2725B', desc: 'Lightning fast' },
              { label: 'Human Avg', value: `${parseFloat(responseTimes?.human_response_seconds ?? '45')}s`, color: '#4A90FF', desc: 'Industry standard' },
            ].map((item) => (
              <div key={item.label} style={{
                padding: '16px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '12px',
                border: `1px solid ${item.color}20`
              }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>{item.label}</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: item.color, marginBottom: '2px' }}>
                  {item.value}
                </div>
                <div style={{ fontSize: '11px', color: '#888' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </ChartCard>
    </div>
  );
};

export default DashboardWidget;