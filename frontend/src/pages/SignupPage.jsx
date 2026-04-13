import { Link } from 'react-router-dom';

function SignupPage() {
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

        <form className="auth-form" noValidate>
          <label className="form-field">
            <span className="form-label">Username</span>
            <input type="text" name="username" placeholder="maxbouan" />
          </label>

          <label className="form-field">
            <span className="form-label">Email</span>
            <input type="email" name="email" placeholder="you@example.com" />
          </label>

          <label className="form-field">
            <span className="form-label">Password</span>
            <input type="password" name="password" placeholder="••••••••" />
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
