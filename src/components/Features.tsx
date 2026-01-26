const features = [
  {
    icon: '📊',
    title: 'Analytics Dashboard',
    description: 'Track customer insights and performance in real time.',
  },
  {
    icon: '⚡',
    title: 'Fast Response Tracking',
    description: 'Measure and optimize your team’s response speed.',
  },
  {
    icon: '🌍',
    title: 'Global SaaS Ready',
    description: 'Deploy anywhere with scalable infrastructure.',
  },
];

export default function Features() {
  return (
    <section className="features-section">
      <h2 className="features-heading">✨ Features</h2>
      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
