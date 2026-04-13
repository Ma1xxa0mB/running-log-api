import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/calendar', label: 'Calendar' },
  { to: '/runs', label: 'Runs' },
  { to: '/runs/new', label: 'Add Run' },
  { to: '/account', label: 'Account' },
];

function PageLayout() {
  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="profile-card">
          <div className="profile-avatar" aria-hidden="true">
            AM
          </div>
          <p className="profile-name">Andrew Bennet</p>
          <p className="profile-role">Short Trail Focus</p>
        </div>

        <nav className="sidebar-nav" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
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
