import { NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

import { getNavigationForRole } from "../data/adminNavigation";
import { useAuth } from "../contexts/AuthContext";

export function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const navigation = getNavigationForRole(user?.role);

  function handleLogout() {
    logout();
    navigate("/auth", { replace: true });
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-on-background shadow-lg flex flex-col py-gutter px-2 z-50">
      {/* Brand */}
      <div className="px-4 mb-stack-lg">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center text-on-primary-container font-bold text-headline-md">
            OV
          </div>
          <span className="font-headline-md text-headline-md font-bold text-on-primary">
            OndoVote
          </span>
        </div>
        <p className="font-body-md text-body-md text-primary-fixed-dim opacity-70 px-1">
          Election Admin
        </p>
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 overflow-y-auto custom-scrollbar"
        aria-label="Admin sections"
      >
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `text-primary-fixed-dim hover:bg-on-primary-fixed-variant rounded-lg mx-2 my-1 flex items-center gap-3 px-4 py-2 transition-all ${
                  isActive
                    ? "bg-primary-container text-on-primary-container font-bold"
                    : ""
                }`
              }
            >
              <Icon size={18} />
              <span className="font-body-md">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto px-2 pt-stack-md border-t border-white/10">
        <div className="flex items-center gap-3 px-4 py-3 mb-4">
          <span className="material-symbols-outlined text-primary-fixed-dim">
            account_circle
          </span>
          <span className="text-primary-fixed-dim font-label-md truncate">
            {user?.fullName ?? "Admin User"}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="w-full bg-primary/20 hover:bg-primary/40 text-on-primary py-3 rounded-lg font-bold transition-all"
          type="button"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
