import { NavLink } from "react-router-dom";

import type { AdminNavItem } from "../data/adminNavigation";

type SectionCardProps = {
  item: AdminNavItem;
};

export function SectionCard({ item }: SectionCardProps) {
  const Icon = item.icon;
  return (
    <article className="section-card">
      <NavLink className="section-card-link" to={item.path} aria-label={item.label} />
      <div className="section-title-row">
        <div className="section-icon">
          <Icon size={16} />
        </div>
        <span className="ui-badge ui-badge-neutral">{item.status}</span>
      </div>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", margin: 0 }}>{item.label}</h3>
      <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>{item.description}</p>
    </article>
  );
}
