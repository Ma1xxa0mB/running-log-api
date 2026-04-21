import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchRunById, updateRunById } from '../api/runsApi.js';

const initialFormData = {
  date: '',
  run_type: '',
  distance_km: '',
  duration: '',
  elevation_m: '',
  surface: '',
  run_label: '',
  avg_pace_min_km: '',
  avg_hr: '',
  max_hr: '',
  avg_temperature_c: '',
  zone_1: '',
  zone_2: '',
  zone_3: '',
  zone_4: '',
  zone_5: '',
};

function formatSecondsForForm(totalSeconds) {
  const seconds = Number(totalSeconds);

  if (!Number.isFinite(seconds) || seconds <= 0) {
    return '';
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const paddedMinutes = String(minutes).padStart(hours > 0 ? 2 : 1, '0');
  const paddedSeconds = String(remainingSeconds).padStart(2, '0');

  if (hours > 0) {
    return `${hours}:${paddedMinutes}:${paddedSeconds}`;
  }

  return `${minutes}:${paddedSeconds}`;
}

function buildFormDataFromRun(run) {
  return {
    date: run.date || '',
    run_type: run.run_type || '',
    distance_km: run.distance_km?.toString() || '',
    duration: formatSecondsForForm(run.duration_seconds),
    elevation_m: run.elevation_m?.toString() || '',
    surface: run.surface || '',
    run_label: run.run_label || '',
    avg_pace_min_km: run.avg_pace_min_km || '',
    avg_hr: run.avg_hr?.toString() || '',
    max_hr: run.max_hr?.toString() || '',
    avg_temperature_c: run.avg_temperature_c?.toString() || '',
    zone_1: formatSecondsForForm(run.zone_1_seconds),
    zone_2: formatSecondsForForm(run.zone_2_seconds),
    zone_3: formatSecondsForForm(run.zone_3_seconds),
    zone_4: formatSecondsForForm(run.zone_4_seconds),
    zone_5: formatSecondsForForm(run.zone_5_seconds),
  };
}

function EditRunPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadRun() {
      try {
        const run = await fetchRunById(id);
        setFormData(buildFormDataFromRun(run));
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    }

    loadRun();
  }, [id]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      const updatedRun = await updateRunById(id, formData);
      console.log(updatedRun);
      navigate(`/runs/${id}`);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="page-card">
        <div className="form-page-card">
          <p className="runs-page-feedback">Loading run...</p>
        </div>
      </section>
    );
  }

  if (error && !formData.date) {
    return (
      <section className="page-card">
        <div className="form-page-card">
          <p className="form-feedback form-feedback--error">{error}</p>
          <div className="form-actions">
            <Link to="/runs" className="form-button form-button--secondary">
              Back to activities
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page-card">
      <div className="form-page-card">
        <div className="form-page-header">
          <h2>Edit Run</h2>
          <p className="form-page-description">
            Update an existing session with corrected or more complete data.
          </p>
        </div>

        <form className="run-form" noValidate onSubmit={handleSubmit}>
          <section className="form-section">
            <div className="form-grid form-grid--two">
              <label className="form-field">
                <span className="form-label">Date</span>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </label>

              <label className="form-field">
                <span className="form-label">Run Type</span>
                <select
                  name="run_type"
                  value={formData.run_type}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select type
                  </option>
                  <option value="easy">Easy</option>
                  <option value="long">Long</option>
                  <option value="tempo">Tempo</option>
                  <option value="vo2max">VO2 Max</option>
                  <option value="sprint">Sprint</option>
                </select>
              </label>

              <label className="form-field">
                <span className="form-label">Distance (km)</span>
                <input
                  type="number"
                  name="distance_km"
                  placeholder="12.4"
                  value={formData.distance_km}
                  onChange={handleChange}
                />
              </label>

              <label className="form-field">
                <span className="form-label">Duration</span>
                <input
                  type="text"
                  name="duration"
                  placeholder="44:31 or 1:34:45"
                  value={formData.duration}
                  onChange={handleChange}
                />
              </label>

              <label className="form-field">
                <span className="form-label">Elevation Positive (m)</span>
                <input
                  type="number"
                  name="elevation_m"
                  placeholder="420"
                  value={formData.elevation_m}
                  onChange={handleChange}
                />
              </label>

              <label className="form-field">
                <span className="form-label">Surface</span>
                <select
                  name="surface"
                  value={formData.surface}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select surface
                  </option>
                  <option value="outdoor">Outdoor</option>
                  <option value="treadmill">Treadmill</option>
                </select>
              </label>

              <label className="form-field">
                <span className="form-label">Session Detail</span>
                <input
                  type="text"
                  name="run_label"
                  placeholder="5 x 4' / 2' rec"
                  value={formData.run_label}
                  onChange={handleChange}
                />
              </label>

              <label className="form-field">
                <span className="form-label">Avg Pace (min/km)</span>
                <input
                  type="text"
                  name="avg_pace_min_km"
                  placeholder="4:28"
                  value={formData.avg_pace_min_km}
                  onChange={handleChange}
                />
              </label>

              <label className="form-field">
                <span className="form-label">Avg HR</span>
                <input
                  type="number"
                  name="avg_hr"
                  placeholder="154"
                  value={formData.avg_hr}
                  onChange={handleChange}
                />
              </label>

              <label className="form-field">
                <span className="form-label">Max HR</span>
                <input
                  type="number"
                  name="max_hr"
                  placeholder="182"
                  value={formData.max_hr}
                  onChange={handleChange}
                />
              </label>

              <label className="form-field">
                <span className="form-label">Avg Temperature (°C)</span>
                <input
                  type="number"
                  name="avg_temperature_c"
                  placeholder="18"
                  value={formData.avg_temperature_c}
                  onChange={handleChange}
                />
              </label>
            </div>
          </section>

          <section className="form-section">
            <h3 className="form-section-title">Time In Zones</h3>
            <div className="form-grid form-grid--two">
              <label className="form-field">
                <span className="form-label">Zone 1</span>
                <input
                  type="text"
                  name="zone_1"
                  placeholder="10:00"
                  value={formData.zone_1}
                  onChange={handleChange}
                />
              </label>

              <label className="form-field">
                <span className="form-label">Zone 2</span>
                <input
                  type="text"
                  name="zone_2"
                  placeholder="20:00"
                  value={formData.zone_2}
                  onChange={handleChange}
                />
              </label>

              <label className="form-field">
                <span className="form-label">Zone 3</span>
                <input
                  type="text"
                  name="zone_3"
                  placeholder="08:00"
                  value={formData.zone_3}
                  onChange={handleChange}
                />
              </label>

              <label className="form-field">
                <span className="form-label">Zone 4</span>
                <input
                  type="text"
                  name="zone_4"
                  placeholder="04:00"
                  value={formData.zone_4}
                  onChange={handleChange}
                />
              </label>

              <label className="form-field">
                <span className="form-label">Zone 5</span>
                <input
                  type="text"
                  name="zone_5"
                  placeholder="02:31"
                  value={formData.zone_5}
                  onChange={handleChange}
                />
              </label>
            </div>
          </section>

          {error ? <p className="form-feedback form-feedback--error">{error}</p> : null}

          <div className="form-actions form-actions--split">
            <Link to={`/runs/${id}`} className="form-button form-button--secondary">
              Back to run
            </Link>

            <button
              type="submit"
              className="form-button form-button--primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default EditRunPage;
