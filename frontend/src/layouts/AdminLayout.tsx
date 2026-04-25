import { Outlet } from 'react-router-dom';

import { Sidebar } from '../components/Sidebar';

export function AdminLayout() {
  return (
    <main className="admin-shell">
      <Sidebar />
      <section className="content">
        <Outlet />
      </section>
    </main>
  );
}
