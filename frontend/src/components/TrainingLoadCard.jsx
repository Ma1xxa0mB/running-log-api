import MetricItem from './MetricItem.jsx';

function TrainingLoadCard({ fatigueValue, formValue, fitnessValue }) {
  return (
    <section className="dashboard-card">
      <h3 className="card-title">Training Load</h3>

      <div className="metrics-grid metrics-grid--three metrics-panel metrics-panel--training-load">
        <MetricItem label="Fatigue" value={fatigueValue} />
        <MetricItem label="Form" value={formValue} />
        <MetricItem label="Fitness" value={fitnessValue} />
      </div>
    </section>
  );
}

export default TrainingLoadCard;
