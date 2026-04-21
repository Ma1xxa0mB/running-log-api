import { Link } from 'react-router-dom';
import MetricItem from './MetricItem.jsx';
import RunTypeBadge from './RunTypeBadge.jsx';

function LastRunCard({
  id,
  type,
  badgeTone,
  cardTone,
  surface,
  date,
  distance,
  duration,
  elevation,
  hr,
  avgPace,
  maxHr,
}) {
  const cardContent = (
    <section className={`dashboard-card dashboard-card--last-run dashboard-card--${cardTone}-run`}>
      <h3 className="card-title">Last Run</h3>

      <div className="last-run-header">
        <RunTypeBadge type={type} tone={badgeTone} />
        <p className="last-run-meta">{surface}</p>
        <p className="last-run-meta">{date}</p>
      </div>

      <div className="metrics-grid metrics-grid--two">
        <MetricItem label="Distance" value={distance} />
        <MetricItem label="Time" value={duration} />
        <MetricItem label="Elevation" value={elevation} />
        <MetricItem label="HR" value={hr} />
        <MetricItem label="Avg pace" value={avgPace} />
        <MetricItem label="Max HR" value={maxHr} />
      </div>
    </section>
  );

  if (!id) {
    return cardContent;
  }

  return (
    <Link to={`/runs/${id}`} className="dashboard-card-link">
      {cardContent}
    </Link>
  );
}

export default LastRunCard;
