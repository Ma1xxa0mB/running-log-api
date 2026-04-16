import { useEffect, useState } from 'react';
import { fetchCurrentUser, updateCurrentUser } from '../api/userApi.js';

const initialFormData = {
  username: '',
  email: '',
  hr_rest: '',
  hr_max: '',
};

function AccountPage() {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const currentUser = await fetchCurrentUser();

        setFormData({
          username: currentUser.username || '',
          email: currentUser.email || '',
          hr_rest: currentUser.hr_rest ? String(currentUser.hr_rest) : '',
          hr_max: currentUser.hr_max ? String(currentUser.hr_max) : '',
        });
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    }

    loadCurrentUser();
  }, []);

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
    setSuccessMessage('');

    try {
      const updatedUser = await updateCurrentUser(formData);

      setFormData({
        username: updatedUser.username || '',
        email: updatedUser.email || '',
        hr_rest: updatedUser.hr_rest ? String(updatedUser.hr_rest) : '',
        hr_max: updatedUser.hr_max ? String(updatedUser.hr_max) : '',
      });
      setSuccessMessage('Account updated successfully.');
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
          <p className="runs-page-feedback">Loading account...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="page-card">
      <div className="form-page-card">
        <div className="form-page-header">
          <p className="page-kicker">Protected page</p>
          <h2>My Account</h2>
          <p className="form-page-description">
            Update your identity fields and the heart-rate profile data used later by the training load feature.
          </p>
        </div>

        <form className="run-form" noValidate onSubmit={handleSubmit}>
          <section className="form-section">
            <h3 className="form-section-title">Identity</h3>
            <div className="form-grid form-grid--two">
              <label className="form-field">
                <span className="form-label">Username</span>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </label>

              <label className="form-field">
                <span className="form-label">Email</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </label>
            </div>
          </section>

          <section className="form-section">
            <h3 className="form-section-title">Heart Rate Profile</h3>
            <div className="form-grid form-grid--two">
              <label className="form-field">
                <span className="form-label">Resting HR</span>
                <input
                  type="number"
                  name="hr_rest"
                  min="1"
                  placeholder="50"
                  value={formData.hr_rest}
                  onChange={handleChange}
                />
              </label>

              <label className="form-field">
                <span className="form-label">Max HR</span>
                <input
                  type="number"
                  name="hr_max"
                  min="1"
                  placeholder="190"
                  value={formData.hr_max}
                  onChange={handleChange}
                />
              </label>
            </div>
          </section>

          {error ? <p className="form-feedback form-feedback--error">{error}</p> : null}
          {successMessage ? <p className="form-feedback form-feedback--success">{successMessage}</p> : null}

          <div className="form-actions">
            <button type="submit" className="form-button form-button--primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default AccountPage;
