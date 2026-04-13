import { useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../api/client.js';

const initialFormData = {
  username: '',
  email: '',
  password: '',
};

function SignupPage() {
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

    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    console.log(result);
  }

  return (
    <section className="page-card">
      <div className="auth-page-card">
        <div className="auth-page-header">
          <p className="page-kicker">Public page</p>
          <h2>Sign Up</h2>
          <p className="auth-page-description">
            Create your account to start logging runs and feeding the dashboard with real data.
          </p>
        </div>

        <form className="auth-form" noValidate onSubmit={handleSubmit}>
          <label className="form-field">
            <span className="form-label">Username</span>
            <input
              type="text"
              name="username"
              placeholder="maxbouan"
              value={formData.username}
              onChange={handleChange}
            />
          </label>

          <label className="form-field">
            <span className="form-label">Email</span>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </label>

          <label className="form-field">
            <span className="form-label">Password</span>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </label>

          <div className="form-actions">
            <button type="submit" className="form-button form-button--primary">
              Create Account
            </button>
          </div>
        </form>

        <p className="auth-page-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </section>
  );
}

export default SignupPage;
