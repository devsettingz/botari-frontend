import Layout from './components/Layout';
import DashboardWidget from './components/DashboardWidget';

function App() {
  // In production, replace with a real JWT from your login flow
  const token = "YOUR_JWT_TOKEN";

  return (
    <Layout>
      {/* You can pass businessId dynamically if needed */}
      <DashboardWidget businessId={1} token={token} />
    </Layout>
  );
}

export default App;
