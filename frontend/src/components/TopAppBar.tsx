import { Search, Bell, HelpCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export function TopAppBar() {
  const { user } = useAuth();
  const initial = user?.fullName?.charAt(0).toUpperCase() ?? "A";

  return (
    <header className="app-topbar">
      <div className="flex flex-col leading-tight">
        <span className="app-topbar-title">Election Administration</span>
        <span className="app-topbar-meta">
          <span className="dot" /> Live results feed
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="app-topbar-search hidden lg:block">
          <Search size={14} />
          <input placeholder="Search LGA, polling unit, voter…" type="text" />
        </div>

        <button className="app-topbar-icon" type="button" aria-label="Notifications">
          <Bell size={16} />
        </button>
        <button className="app-topbar-icon" type="button" aria-label="Help">
          <HelpCircle size={16} />
        </button>

        <div
          className="ml-1"
          style={{
            width: 28, height: 28, borderRadius: "50%",
            background: "var(--accent-soft)", color: "var(--accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 600,
          }}
          aria-label="Account"
        >
          {initial}
        </div>
      </div>
    </header>
  );
}
