import { Outlet } from "react-router-dom";

import { Sidebar } from "../components/Sidebar";
import { TopAppBar } from "../components/TopAppBar";

export function AdminLayout() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="app-content">
        <TopAppBar />
        <div className="app-content-inner">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
