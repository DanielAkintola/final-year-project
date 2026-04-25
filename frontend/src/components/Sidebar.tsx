import { NavLink } from 'react-router-dom';

import { adminNavigation } from '../data/adminNavigation';

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">OV</span>
        <div>
          <strong>OndoVote</strong>
          <span>Election Admin</span>
        </div>
      </div>

      <nav className="nav-list" aria-label="Admin sections">
        {adminNavigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              className={({ isActive }) => (isActive ? 'active' : undefined)}
              key={item.path}
              to={item.path}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
