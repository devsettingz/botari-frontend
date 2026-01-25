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
        animation: 'spin 1s linear infinite',
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
            fetch(`/api/dashboard/${businessId}/trends/weekly`, { headers }),
            fetch(`/api/dashboard/${businessId}/trends/messages/weekly`, { headers }),
            fetch(`/api/dashboard/${businessId}/trends/monthly`, { headers }),
            fetch(`/api/dashboard/${businessId}/trends/messages/monthly`, { headers }),
            fetch(`/api/dashboard/${businessId}`, { headers }),
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
  }, [businessId, token]);
  const tabStyle = (isActive: boolean) => ({
    padding: '0.5rem 1rem',
    marginRight: '1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    backgroundColor: isActive ? '#007bff' : '#f8f9fa',
    color: isActive ? '#fff' : '#333',
    cursor: 'pointer',
    fontWeight: isActive ? 'bold' : 'normal',
    transition: 'background-color 0.3s',
  });

  const responseChart = {
    labels: ['Botari', 'Human', 'Overall'],
    datasets: [
      {
        label: 'Avg Response Time (seconds)',
        data: [
          parseFloat(responseTimes?.botari_response_seconds ?? '0'),
          parseFloat(responseTimes?.human_response_seconds ?? '0'),
          parseFloat(responseTimes?.average_response_seconds ?? '0'),
        ],
        backgroundColor: ['#4bc0c0', '#ff6384', '#36a2eb'],
      },
    ],
  };

  if (loading) return <Spinner />;

  return (
    <div style={{ backgroundColor: '#f4f6f8', padding: '2rem', borderRadius: '12px' }}>
      {/* Summary Stats */}
      {summaryStats && (
        <div
          style={{
            marginBottom: '2rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1rem',
          }}
        >
          {[
            { label: '💬 Conversations', value: summaryStats.total_conversations, color: '#007bff' },
            { label: '📨 Messages', value: summaryStats.total_messages, color: '#28a745' },
            { label: '👥 Customers', value: summaryStats.unique_customers, color: '#ff9800' },
            { label: '🔓 Open', value: summaryStats.open_conversations, color: '#ffc107' },
            { label: '✅ Closed', value: summaryStats.closed_conversations, color: '#dc3545' },
          ].map((stat, idx) => (
            <div key={idx} style={{ padding: '1rem', background: '#fff', borderRadius: 8 }}>
              <h3>{stat.label}</h3>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <h2 style={{ marginBottom: '1rem' }}>Dashboard Trends</h2>
      <div style={{ marginBottom: '1rem' }}>
        <button style={tabStyle(activeTab === 'weekly')} onClick={() => setActiveTab('weekly')}>
          Weekly
        </button>
        <button style={tabStyle(activeTab === 'monthly')} onClick={() => setActiveTab('monthly')}>
          Monthly
        </button>
      </div>
      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {activeTab === 'weekly' ? (
          <>
            <div style={{ height: 250 }}>
              <Line
                data={{
                  labels: weeklyConvos.map((item) => item.week_start ?? ''),
                  datasets: [
                    {
                      label: 'Weekly Conversations',
                      data: weeklyConvos.map((item) => item.conversations ?? 0),
                      borderColor: 'blue',
                      backgroundColor: 'rgba(173, 216, 230, 0.4)',
                      fill: true,
                    },
                  ],
                }}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
            <div style={{ height: 250 }}>
              <Bar
                data={{
                  labels: weeklyMsgs.map((item) => item.week_start ?? ''),
                  datasets: [
                    {
                      label: 'Weekly Messages',
                      data: weeklyMsgs.map((item) => item.messages ?? 0),
                      backgroundColor: 'rgba(75,192,192,0.6)',
                    },
                  ],
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
                  labels: monthlyConvos.map((item) => item.month_start ?? ''),
                  datasets: [
                    {
                      label: 'Monthly Conversations',
                      data: monthlyConvos.map((item) => item.conversations ?? 0),
                      borderColor: 'green',
                      backgroundColor: 'rgba(144,238,144,0.4)',
                      fill: true,
                    },
                  ],
                }}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
            <div style={{ height: 250 }}>
              <Bar
                data={{
                  labels: monthlyMsgs.map((item) => item.month_start ?? ''),
                  datasets: [
                    {
                      label: 'Monthly Messages',
                      data: monthlyMsgs.map((item) => item.messages ?? 0),
                      backgroundColor: 'rgba(255,99,132,0.6)',
                    },
                  ],
                }}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
          </>
        )}
      </div>

      {/* Response Time Chart */}
      <div style={{ marginTop: '2rem', height: 250 }}>
        <Bar data={responseChart} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
    </div>
  );
};

export default DashboardWidget;
