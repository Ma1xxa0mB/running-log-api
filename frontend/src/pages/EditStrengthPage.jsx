import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  fetchStrengthSessionById,
  updateStrengthSessionById,
} from '../api/strengthApi.js';

const initialFormData = {
  date: '',
  duration: '',
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

function buildFormDataFromStrengthSession(strengthSession) {
  return {
    date: strengthSession.date || '',
    duration: formatSecondsForForm(strengthSession.duration_seconds),
  };
}

function EditStrengthPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadStrengthSession() {
      try {
        const strengthSession = await fetchStrengthSessionById(id);
        setFormData(buildFormDataFromStrengthSession(strengthSession));
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    }

    loadStrengthSession();
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
      const updatedStrengthSession = await updateStrengthSessionById(id, formData);
      console.log(updatedStrengthSession);
      navigate(`/strength-sessions/${id}`);
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
          <p className="runs-page-feedback">Loading strength session...</p>
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
          <h2>Edit Strength</h2>
          <p className="form-page-description">
            Update the core data of your strength session.
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
                <span className="form-label">Duration</span>
                <input
                  type="text"
                  name="duration"
                  placeholder="45:00 or 1:10:00"
                  value={formData.duration}
                  onChange={handleChange}
                />
              </label>
            </div>
          </section>

          {error ? <p className="form-feedback form-feedback--error">{error}</p> : null}

          <div className="form-actions form-actions--split">
            <Link to={`/strength-sessions/${id}`} className="form-button form-button--secondary">
              Back to strength
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

export default EditStrengthPage;
