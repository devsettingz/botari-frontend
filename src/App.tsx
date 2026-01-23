import Layout from './components/Layout';
import DashboardWidget from './components/DashboardWidget';

function App() {
  const token = "YOUR_JWT_TOKEN"; // Replace with a real token later

  return (
    <Layout>
      <DashboardWidget businessId={1} token={token} />
    </Layout>
  );
}

export default App;
