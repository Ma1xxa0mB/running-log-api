import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../api/client.js';

const initialFormData = {
  email: '',
  password: '',
};

function LoginPage() {
  const [formData, setFormData] = useState(initialFormData);
  const navigate = useNavigate();

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    console.log(result);

    if (response.ok) {
      navigate('/dashboard');
    }
  }

  return (
    <section className="page-card">
      <div className="auth-page-card">
        <div className="auth-page-header">
          <p className="page-kicker">Public page</p>
          <h2>Log In</h2>
          <p className="auth-page-description">
            Access your account to create runs, sync the session, and unlock the protected pages.
          </p>
        </div>

        <form className="auth-form" noValidate onSubmit={handleSubmit}>
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
              Log In
            </button>
          </div>
        </form>

        <p className="auth-page-footer">
          No account yet? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </section>
  );
}

export default LoginPage;
