import { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { fetchCurrentUser } from '../api/userApi.js';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', end: true },
  { to: '/calendar', label: 'Calendar', end: true },
  { to: '/statistics', label: 'Statistics', end: true },
  { to: '/runs', label: 'Runs', end: true },
  { to: '/runs/new', label: 'Add Run', end: true },
  { to: '/account', label: 'Account', end: true },
];

function PageLayout() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const user = await fetchCurrentUser();
        setCurrentUser(user);
      } catch {
        setCurrentUser(null);
      }
    }

    loadCurrentUser();
  }, []);

  const username = currentUser?.username || '?';
  const profileInitial = username.charAt(0).toUpperCase();

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="profile-card">
          <div className="profile-avatar" aria-hidden="true">
            {profileInitial}
          </div>
          <p className="profile-name">{username}</p>
        </div>

        <nav className="sidebar-nav" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                isActive ? 'sidebar-link sidebar-link--active' : 'sidebar-link'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="page-content">
        <div className="page-frame">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default PageLayout;
