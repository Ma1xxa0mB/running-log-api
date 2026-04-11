import MetricItem from './MetricItem.jsx';
import RunTypeBadge from './RunTypeBadge.jsx';

function LastRunCard({ type, surface, date, distance, duration, elevation, hr }) {
  return (
    <section className="dashboard-card dashboard-card--easy-run">
      <h3 className="card-title">Last Run</h3>

      <div className="last-run-header">
        <RunTypeBadge type={type} tone="easy-dark" />
        <p className="last-run-meta">{surface}</p>
        <p className="last-run-meta">{date}</p>
      </div>

      <div className="metrics-grid metrics-grid--two">
        <MetricItem label="Distance" value={distance} />
        <MetricItem label="Time" value={duration} />
        <MetricItem label="Elevation" value={elevation} />
        <MetricItem label="HR" value={hr} />
      </div>
    </section>
  );
}

export default LastRunCard;
