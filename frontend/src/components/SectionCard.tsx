import { NavLink } from 'react-router-dom';

import type { AdminNavItem } from '../data/adminNavigation';

type SectionCardProps = {
  item: AdminNavItem;
};

export function SectionCard({ item }: SectionCardProps) {
  const Icon = item.icon;

  return (
    <NavLink className="section-card-link" to={item.path}>
      <article className="section-card">
        <div className="section-icon">
          <Icon size={22} />
        </div>
        <div>
          <div className="section-title-row">
            <h2>{item.label}</h2>
            <span data-status={item.status}>{item.status}</span>
          </div>
          <p>{item.description}</p>
        </div>
      </article>
    </NavLink>
  );
}
