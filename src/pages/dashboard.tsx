import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('jwt'); // 👈 store this after login
    const businessId = localStorage.getItem('business_id'); // 👈 store this after login

    if (!token || !businessId) return;

    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch(`http://localhost:4000/api/dashboard/${businessId}/summary`, { headers }).then(res => res.json()),
      fetch(`http://localhost:4000/api/subscriptions/current`, { headers }).then(res => res.json())
    ])
      .then(([summaryData, subscriptionData]) => {
        setSummary(summaryData);
        setSubscription(subscriptionData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Dashboard fetch error:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>📊 Business Dashboard</h1>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Summary Stats</h2>
        <ul>
          <li>Total Messages: {summary?.total_messages}</li>
          <li>Total Conversations: {summary?.total_conversations}</li>
          <li>Total Subscriptions: {summary?.total_subscriptions}</li>
        </ul>
      </section>

      <section>
        <h2>Current Plan</h2>
        <ul>
          <li>Plan: {subscription?.plan}</li>
          <li>Expires At: {subscription?.expires_at}</li>
        </ul>
      </section>
    </div>
  );
}
