import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createStrengthSession } from '../api/strengthApi.js';

const initialFormData = {
  date: '',
  duration: '',
};

function CreateStrengthPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

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
      const result = await createStrengthSession(formData);
      console.log(result);
      navigate('/activities/new');
    } catch (submitError) {
      setError(submitError.message);
      setSaving(false);
    }
  }

  return (
    <section className="page-card">
      <div className="form-page-card">
        <div className="form-page-header">
          <h2>Add Strength</h2>
          <p className="form-page-description">
            Log a strength session with the minimal data needed for V1.
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
            <Link to="/activities/new" className="form-button form-button--secondary">
              Back to activity choice
            </Link>

            <button
              type="submit"
              className="form-button form-button--primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Strength'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default CreateStrengthPage;
