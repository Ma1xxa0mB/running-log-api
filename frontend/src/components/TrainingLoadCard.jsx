import MetricItem from './MetricItem.jsx';

function TrainingLoadCard({ fatigueValue, formValue, fitnessValue, loadValue }) {
  return (
    <section className="dashboard-card">
      <h3 className="card-title">Training Load</h3>

      <div className="metrics-grid metrics-grid--four metrics-panel">
        <MetricItem label="Fatigue" prefix="ATL" value={fatigueValue} />
        <MetricItem label="Form" prefix="TSB" value={formValue} />
        <MetricItem label="Fitness" prefix="CTL" value={fitnessValue} />
        <MetricItem label="Load" value={loadValue} />
      </div>
    </section>
  );
}

export default TrainingLoadCard;
