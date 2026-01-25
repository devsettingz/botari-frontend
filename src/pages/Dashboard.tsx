import React, { useEffect, useState } from 'react';
import DashboardWidget from '../components/DashboardWidget';

interface DashboardProps {
  token: string; // ✅ only allow string, not null
}

const Dashboard: React.FC<DashboardProps> = ({ token }) => {
  const [businessId, setBusinessId] = useState<number | null>(null);
  const [businessName, setBusinessName] = useState<string | null>(null);

  useEffect(() => {
    // Load business info from localStorage
    const storedId = localStorage.getItem('business_id');
    const storedName = localStorage.getItem('business_name');

    if (storedId) {
      setBusinessId(parseInt(storedId, 10));
    }
    if (storedName) {
      setBusinessName(storedName);
    }
  }, []);

  if (!businessId) {
    return (
      <div style={{ padding: '2rem' }}>
        <h2>No business selected</h2>
        <p>Please make sure you have a business ID stored in localStorage.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome {businessName ?? 'Business'}</h1>
      <DashboardWidget businessId={businessId} token={token} />
    </div>
  );
};

export default Dashboard;
