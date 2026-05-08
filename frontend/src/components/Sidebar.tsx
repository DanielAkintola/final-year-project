import { NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

import { getNavigationForRole, type AdminNavItem } from "../data/adminNavigation";
import { useAuth } from "../contexts/AuthContext";

const GROUPS: { label: string; paths: string[] }[] = [
  { label: "Operations", paths: ["/app/dashboard", "/app/elections", "/app/monitoring", "/app/results"] },
  { label: "Identity", paths: ["/app/voters", "/app/biometric-review"] },
  { label: "Governance", paths: ["/app/geography", "/app/parties", "/app/candidates", "/app/ballot-builder"] },
  { label: "System", paths: ["/app/audit-logs", "/app/admin-users", "/app/settings"] },
];

function groupItems(items: AdminNavItem[]) {
  return GROUPS.map((g) => ({
    label: g.label,
    items: g.paths.map((p) => items.find((i) => i.path === p)).filter(Boolean) as AdminNavItem[],
  })).filter((g) => g.items.length > 0);
}

export function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const navigation = getNavigationForRole(user?.role);
  const groups = groupItems(navigation);
  const initial = user?.fullName?.charAt(0).toUpperCase() ?? "A";

  function handleLogout() {
    logout();
    navigate("/auth", { replace: true });
  }

  return (
    <aside className="app-sidebar">
      <div className="app-sidebar-brand">
        <div className="mark">OV</div>
        <div className="flex flex-col leading-tight">
          <span className="name">OndoVote</span>
          <span className="tag">Election Admin</span>
        </div>
      </div>

      <nav className="app-sidebar-nav custom-scrollbar" aria-label="Admin sections">
        {groups.map((group) => (
          <div key={group.label} className="nav-group">
            <div className="nav-group-label">{group.label}</div>
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `nav-item ${isActive ? "nav-item-active" : ""}`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="app-sidebar-foot">
        <div className="app-sidebar-user">
          <div className="avatar">{initial}</div>
          <div className="flex flex-col leading-tight min-w-0">
            <span className="truncate" style={{ fontWeight: 500 }}>
              {user?.fullName ?? "Admin User"}
            </span>
            <span style={{ fontSize: 11, color: "var(--text-subtle)" }}>{user?.role ?? ""}</span>
          </div>
        </div>
        <button onClick={handleLogout} className="ui-button ui-button-ghost" type="button" style={{ justifyContent: "flex-start" }}>
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
