import { PageHeader } from '../components/PageHeader';
import { SectionCard } from '../components/SectionCard';
import { StatCard } from '../components/StatCard';
import { adminNavigation, dashboardStats } from '../data/adminNavigation';

export function DashboardPage() {
  return (
    <>
      <PageHeader
        description="This scaffold maps the admin website around the actions we listed: election setup, geography, parties, candidates, voters, biometrics, ballot publishing, monitoring, results, audit logs, and settings."
        eyebrow="Ondo State Governorship Election"
        title="Admin control center for configuring and monitoring the election process."
      />

      <section className="stats-grid" aria-label="Admin setup summary">
        {dashboardStats.map((stat) => (
          <StatCard hint={stat.hint} key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </section>

      <section className="section-grid">
        {adminNavigation.map((item) => (
          <SectionCard item={item} key={item.path} />
        ))}
      </section>
    </>
  );
}
