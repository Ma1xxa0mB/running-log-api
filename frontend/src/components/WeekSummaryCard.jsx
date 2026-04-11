import MetricItem from './MetricItem.jsx';

function WeekSummaryCard({
  distanceValue,
  distanceUnit,
  durationValue,
  elevationValue,
  elevationUnit,
}) {
  return (
    <section className="dashboard-card">
      <h3 className="card-title">Week Summary</h3>

      <div className="metrics-grid metrics-grid--three metrics-panel">
        <MetricItem label="Distance" value={distanceValue} suffix={distanceUnit} />
        <MetricItem label="Time" value={durationValue} />
        <MetricItem label="Elevation" value={elevationValue} suffix={elevationUnit} />
      </div>
    </section>
  );
}

export default WeekSummaryCard;
