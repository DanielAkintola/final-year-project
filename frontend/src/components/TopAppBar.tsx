import { Search, Bell, Settings, HelpCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export function TopAppBar() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 w-full flex justify-between items-center px-gutter py-unit bg-surface border-b border-outline-variant z-40 backdrop-blur-md bg-opacity-80">
      <div className="flex flex-col">
        <h1 className="font-headline-md text-headline-md font-extrabold text-primary">
          Election Administration Portal
        </h1>
        <span className="font-label-md text-label-md text-on-surface-variant flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
          Live Results Feed
        </span>
      </div>

      <div className="flex items-center gap-stack-md">
        {/* Search */}
        <div className="relative hidden lg:block">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-outline"
          />
          <input
            className="pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-full text-label-lg w-64 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            placeholder="Search LGA or Polling Unit..."
            type="text"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-surface-container rounded-full transition-colors opacity-80 hover:opacity-100">
            <Bell size={20} />
          </button>
          <button className="p-2 hover:bg-surface-container rounded-full transition-colors opacity-80 hover:opacity-100">
            <Settings size={20} />
          </button>
          <button className="p-2 hover:bg-surface-container rounded-full transition-colors opacity-80 hover:opacity-100">
            <HelpCircle size={20} />
          </button>

          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-primary overflow-hidden ml-2 border-2 border-primary-container">
            {user?.avatar ? (
              <img
                alt="User Avatar"
                src={user.avatar}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
                {user?.fullName?.charAt(0) ?? "A"}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
