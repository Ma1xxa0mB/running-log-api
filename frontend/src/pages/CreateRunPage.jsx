import { useState } from 'react';
import { API_BASE_URL } from '../api/client.js';

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

function CreateRunPage() {
  const [formData, setFormData] = useState(initialFormData);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const response = await fetch(`${API_BASE_URL}/runs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    console.log(result);
  }

  return (
    <section className="page-card">
      <div className="form-page-card">
        <div className="form-page-header">
          <h2>Add Run</h2>
          <p className="form-page-description">
            Manual entry for one training session. Garmin import will come later.
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
                  <option value="muscu">Muscu</option>
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

          <div className="form-actions">
            <button type="submit" className="form-button form-button--primary">
              Save Run
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default CreateRunPage;
