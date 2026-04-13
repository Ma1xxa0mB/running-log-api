import { Outlet } from 'react-router-dom';

function AuthLayout() {
  return (
    <div className="auth-shell">
      <main className="auth-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AuthLayout;
