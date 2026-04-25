import type { AdminNavItem } from '../data/adminNavigation';

type SectionCardProps = {
  item: AdminNavItem;
};

export function SectionCard({ item }: SectionCardProps) {
  const Icon = item.icon;

  return (
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
  );
}
