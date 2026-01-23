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
  Legend
} from 'chart.js';

ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

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

const Spinner: React.FC = () => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
    <div
      style={{
        width: '40px',
        height: '40px',
        border: '4px solid #ccc',
        borderTop: '4px solid #007bff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}
    />
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>
);

const DashboardWidget: React.FC<{ businessId: number; token: string }> = ({ businessId, token }) => {
  const [weeklyConvos, setWeeklyConvos] = useState<TrendData[]>([]);
  const [weeklyMsgs, setWeeklyMsgs] = useState<TrendData[]>([]);
  const [monthlyConvos, setMonthlyConvos] = useState<TrendData[]>([]);
  const [monthlyMsgs, setMonthlyMsgs] = useState<TrendData[]>([]);
  const [responseTimes, setResponseTimes] = useState<ResponseTimeData | null>(null);
  const [summaryStats, setSummaryStats] = useState<SummaryStats | null>(null);
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly'>('weekly');
  const [loading, setLoading] = useState(true);

  // ✅ Use environment variable for backend base URL
  const API_BASE = import.meta.env.VITE_API_BASE;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      };

      try {
        const weeklyConvoRes = await fetch(`${API_BASE}/api/dashboard/${businessId}/trends/weekly`, { headers });
        const weeklyConvoData = await weeklyConvoRes.json();
        setWeeklyConvos(weeklyConvoData.weekly_trends || []);

        const weeklyMsgRes = await fetch(`${API_BASE}/api/dashboard/${businessId}/trends/messages/weekly`, { headers });
        const weeklyMsgData = await weeklyMsgRes.json();
        setWeeklyMsgs(weeklyMsgData.weekly_message_trends || []);

        const monthlyConvoRes = await fetch(`${API_BASE}/api/dashboard/${businessId}/trends/monthly`, { headers });
        const monthlyConvoData = await monthlyConvoRes.json();
        setMonthlyConvos(monthlyConvoData.monthly_trends || []);

        const monthlyMsgRes = await fetch(`${API_BASE}/api/dashboard/${businessId}/trends/messages/monthly`, { headers });
        const monthlyMsgData = await monthlyMsgRes.json();
        setMonthlyMsgs(monthlyMsgData.monthly_message_trends || []);

        const responseRes = await fetch(`${API_BASE}/api/dashboard/${businessId}`, { headers });
        const responseData = await responseRes.json();
        setResponseTimes({
          average_response_seconds: responseData.average_response_seconds,
          botari_response_seconds: responseData.botari_response_seconds,
          human_response_seconds: responseData.human_response_seconds
        });
        setSummaryStats({
          total_conversations: responseData.total_conversations,
          total_messages: responseData.total_messages,
          unique_customers: responseData.unique_customers,
          open_conversations: responseData.open_conversations,
          closed_conversations: responseData.closed_conversations
        });
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [businessId, token, API_BASE]);
  const tabStyle = (isActive: boolean) => ({
    padding: '0.5rem 1rem',
    marginRight: '1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    backgroundColor: isActive ? '#007bff' : '#f8f9fa',
    color: isActive ? '#fff' : '#333',
    cursor: 'pointer',
    fontWeight: isActive ? 'bold' : 'normal',
    transition: 'background-color 0.3s'
  });

  const responseChart = {
    labels: ['Botari', 'Human', 'Overall'],
    datasets: [
      {
        label: 'Avg Response Time (seconds)',
        data: [
          parseFloat(responseTimes?.botari_response_seconds ?? '0'),
          parseFloat(responseTimes?.human_response_seconds ?? '0'),
          parseFloat(responseTimes?.average_response_seconds ?? '0')
        ],
        backgroundColor: ['#4bc0c0', '#ff6384', '#36a2eb']
      }
    ]
  };

  if (loading) return <Spinner />;
  return (
    <div style={{ backgroundColor: '#f4f6f8', padding: '2rem', borderRadius: '12px' }}>
      {/* Summary cards */}
      {summaryStats && (
        <div className="summary-grid" style={{ marginBottom: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: '#fff', borderRadius: 8 }}>
            <h3>💬 Conversations</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#007bff' }}>
              {summaryStats.total_conversations}
            </p>
          </div>
          <div style={{ padding: '1rem', background: '#fff', borderRadius: 8 }}>
            <h3>📨 Messages</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#28a745' }}>
              {summaryStats.total_messages}
            </p>
          </div>
          <div style={{ padding: '1rem', background: '#fff', borderRadius: 8 }}>
            <h3>👥 Customers</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ff9800' }}>
              {summaryStats.unique_customers}
            </p>
          </div>
          <div style={{ padding: '1rem', background: '#fff', borderRadius: 8 }}>
            <h3>🔓 Open</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ffc107' }}>
              {summaryStats.open_conversations}
            </p>
          </div>
          <div style={{ padding: '1rem', background: '#fff', borderRadius: 8 }}>
            <h3>✅ Closed</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc3545' }}>
              {summaryStats.closed_conversations}
            </p>
          </div>
        </div>
      )}

      {/* Trends */}
      <h2 style={{ marginBottom: '1rem' }}>Dashboard Trends</h2>
      <div style={{ marginBottom: '1rem' }}>
        <button style={tabStyle(activeTab === 'weekly')} onClick={() => setActiveTab('weekly')}>
          Weekly
        </button>
        <button style={tabStyle(activeTab === 'monthly')} onClick={() => setActiveTab('monthly')}>
          Monthly
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {activeTab === 'weekly' ? (
          <>
            <div style={{ height: 250 }}>
              <Line
                data={{
                  labels: weeklyConvos.map(item => item.week_start ?? ''),
                  datasets: [
                    {
                      label: 'Weekly Conversations',
                      data: weeklyConvos.map(item => item.conversations ?? 0),
                      borderColor: 'blue',
                      backgroundColor: 'rgba(173, 216, 230, 0.4)',
                      fill: true
                    }
                  ]
                }}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
            <div style={{ height: 250 }}>
              <Bar
                data={{
                  labels: weeklyMsgs.map(item => item.week_start ?? ''),
                  datasets: [
                    {
                      label: 'Weekly Messages',
                      data: weeklyMsgs.map(item => item.messages ?? 0),
                      backgroundColor: 'rgba(75,192,192,0.6)'
                    }
                  ]
                }}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
          </>
        ) : (
          <>
            <div style={{ height: 250 }}>
              <Line
                data={{
                  labels: monthlyConvos.map(item => item.month_start ?? ''),
                  datasets: [
                    {
                      label: 'Monthly Conversations',
                      data: monthlyConvos.map(item => item.conversations ?? 0),
                      borderColor: 'green',
                      backgroundColor: 'rgba(144,238,144,0.4)',
                      fill: true
                    }
                  ]
                }}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
            <div style={{ height: 250 }}>
              <Bar
                data={{
                  labels: monthlyMsgs.map(item => item.month_start ?? ''),
                  datasets: [
                    {
                      label: 'Monthly Messages',
                      data: monthlyMsgs.map(item => item.messages ?? 0),
                      backgroundColor: 'rgba(255,99,132,0.6)'
                    }
                  ]
                }}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
          </>
        )}
      </div>

      <div style={{ marginTop: '2rem', height: 250 }}>
        <Bar data={responseChart} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
    </div>
  );
};

export default DashboardWidget;
