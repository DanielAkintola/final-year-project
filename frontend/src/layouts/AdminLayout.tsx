import { Outlet } from "react-router-dom";

import { Sidebar } from "../components/Sidebar";
import { TopAppBar } from "../components/TopAppBar";

export function AdminLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="ml-64 flex-1 h-screen overflow-y-auto bg-surface">
        <TopAppBar />
        <div className="p-gutter max-w-container-max mx-auto space-y-stack-lg pb-stack-lg">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
