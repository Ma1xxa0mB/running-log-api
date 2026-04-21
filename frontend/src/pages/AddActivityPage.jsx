import { Link } from 'react-router-dom';

function AddActivityPage() {
  return (
    <section className="page-card">
      <div className="activity-choice-card">
        <div className="activity-choice-header">
          <h2>Add Activity</h2>
          <p className="activity-choice-description">
            Choose the type of activity you want to log.
          </p>
        </div>

        <div className="activity-choice-grid">
          <Link to="/activities/new/run" className="activity-choice-option">
            <span className="activity-choice-option__eyebrow">Endurance</span>
            <h3>Add Run</h3>
            <p>Full running session with distance, elevation, heart rate and zones.</p>
          </Link>

          <Link to="/activities/new/strength" className="activity-choice-option">
            <span className="activity-choice-option__eyebrow">Strength</span>
            <h3>Add Strength</h3>
            <p>Simple strength session with only date and duration for now.</p>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default AddActivityPage;
