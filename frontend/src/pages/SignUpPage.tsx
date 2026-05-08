import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Phone,
  User,
  ShieldCheck,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { useAuth } from "../contexts/AuthContext";
import type { AdminRole } from "../types";

type AuthMode = "signin" | "signup";

export function SignUpPage() {
  const navigate = useNavigate();
  const { isAuthenticated, login, signup, setRoleForSession } = useAuth();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedRole, setSelectedRole] = useState<AdminRole>("SUPER_ADMIN");

  const isSignUp = mode === "signup";

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/app/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        if (password !== confirmPassword)
          throw new Error("Passwords do not match");
        if (password.length < 8)
          throw new Error("Password must be at least 8 characters");
        await signup(email, fullName, password, phoneNumber);
      } else if (mode === "signin") {
        await login(email, password);
      }

      setRoleForSession(selectedRole);
      navigate("/app/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-[#F0F4F8] overflow-hidden font-sans">
      {/* --- THEME-COLORED EXTERNAL BACKGROUND SHAPES (Edge of Screen) --- */}
      {/* Top Right Lighter Blue Accent */}
      <div className="absolute -top-10 -right-10 w-72 h-72 bg-[#2E5AAC] opacity-15 rotate-45 pointer-events-none z-0" />

      {/* Bottom Left Dark Blue Circle */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#1B365D] rounded-full opacity-10 pointer-events-none z-0" />

      {/* Subtle Floating Accents */}
      <div className="absolute top-20 left-20 w-16 h-16 border-4 border-[#1B365D]/5 rounded-xl rotate-12 z-0" />
      <div className="absolute bottom-1/4 right-10 w-24 h-24 border-2 border-[#2E5AAC]/10 rounded-full z-0" />

      {/* --- 75% SCALE WRAPPER --- */}
      <div className="scale-[0.75] transform z-10 flex items-center justify-center">
        {/* MAIN CARD */}
        <div className="relative w-[850px] h-[600px] bg-white rounded-[32px] shadow-2xl overflow-hidden flex border border-white/20">
          {/* ADMIN SIGN UP FORM (Left Side) */}
          <div
            className={`absolute top-0 left-0 w-1/2 h-full flex flex-col justify-center p-12 transition-all duration-700 ease-in-out ${isSignUp ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10 pointer-events-none"}`}
          >
            <form
              onSubmit={handleSubmit}
              className="space-y-4 w-full max-w-[320px] mx-auto text-center"
            >
              <h1 className="text-3xl font-extrabold text-[#1B365D] mb-2">
                Admin Registry
              </h1>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-6">
                Internal Access Authorization
              </p>

              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full pl-10 pr-4 py-3 bg-[#F8FAFC] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#2E5AAC] outline-none"
                  required
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Phone Number"
                  className="w-full pl-10 pr-4 py-3 bg-[#F8FAFC] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#2E5AAC] outline-none"
                  required
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Admin Email"
                  className="w-full pl-10 pr-4 py-3 bg-[#F8FAFC] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#2E5AAC] outline-none"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-10 pr-4 py-3 bg-[#F8FAFC] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#2E5AAC] outline-none"
                  required
                />
              </div>

              <select
                className="w-full px-4 py-3 bg-[#F8FAFC] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#2E5AAC] outline-none"
                onChange={(event) => setSelectedRole(event.target.value as AdminRole)}
                value={selectedRole}
              >
                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                <option value="ELECTION_ADMIN">ELECTION_ADMIN</option>
                <option value="REGISTRATION_OFFICER">REGISTRATION_OFFICER</option>
                <option value="MONITORING_OFFICER">MONITORING_OFFICER</option>
                <option value="RESULTS_OFFICER">RESULTS_OFFICER</option>
              </select>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-full px-4 py-3 bg-[#F8FAFC] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#2E5AAC] outline-none"
                required
              />

              <Button
                disabled={loading}
                className="w-full h-12 bg-[#2E5AAC] hover:bg-[#1B365D] rounded-full font-bold uppercase text-xs tracking-widest mt-4 shadow-lg transition-transform active:scale-95"
              >
                {loading ? "Registering..." : "Create Admin Account"}
              </Button>
            </form>
          </div>

          {/* ADMIN SIGN IN FORM (Right Side) */}
          <div
            className={`absolute top-0 right-0 w-1/2 h-full flex flex-col justify-center p-12 transition-all duration-700 ease-in-out ${isSignUp ? "opacity-0 translate-x-10 pointer-events-none" : "opacity-100 translate-x-0"}`}
          >
            <form
              onSubmit={handleSubmit}
              className="space-y-6 w-full max-w-[300px] mx-auto text-center"
            >
              <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-[#1B365D] mb-2">
                  Admin Portal
                </h1>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">
                  Secure Dashboard Entry
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-100 flex items-center gap-2 text-left">
                  <ShieldCheck className="w-4 h-4 text-red-500" />
                  <p className="text-[10px] text-red-600 font-bold">{error}</p>
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Admin Email"
                  className="w-full pl-10 pr-4 py-3.5 bg-[#F8FAFC] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#2E5AAC] outline-none"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-10 pr-12 py-3.5 bg-[#F8FAFC] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#2E5AAC] outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-[#1B365D]"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              <select
                className="w-full px-4 py-3.5 bg-[#F8FAFC] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#2E5AAC] outline-none"
                onChange={(event) => setSelectedRole(event.target.value as AdminRole)}
                value={selectedRole}
              >
                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                <option value="ELECTION_ADMIN">ELECTION_ADMIN</option>
                <option value="REGISTRATION_OFFICER">REGISTRATION_OFFICER</option>
                <option value="MONITORING_OFFICER">MONITORING_OFFICER</option>
                <option value="RESULTS_OFFICER">RESULTS_OFFICER</option>
              </select>

              <button
                type="button"
                onClick={() => navigate("/auth/forgot-password")}
                className="text-xs text-slate-400 hover:text-[#2E5AAC] font-bold uppercase tracking-wider transition-colors"
              >
                Recover Access
              </button>

              <Button
                disabled={loading}
                className="w-full h-12 bg-[#2E5AAC] hover:bg-[#1B365D] rounded-full font-bold uppercase text-xs tracking-widest mt-2 shadow-lg transition-transform active:scale-95"
              >
                {loading ? "Authenticating..." : "Login to Console"}
              </Button>
            </form>
          </div>

          {/* MOVING OVERLAY PANEL (Blue Section) */}
          <div
            className={`absolute top-0 left-0 h-full w-1/2 bg-[#1B365D] text-white z-20 transition-transform duration-700 ease-in-out flex flex-col items-center justify-center p-12 text-center ${isSignUp ? "translate-x-full" : "translate-x-0"}`}
          >
            {/* Shapes inside the Blue Panel */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#2E5AAC] opacity-20 rotate-45 translate-x-16 -translate-y-16 pointer-events-none" />
            <div className="absolute bottom-10 left-10 w-12 h-12 border-4 border-white/10 rotate-12 pointer-events-none" />
            <div className="absolute top-1/4 right-8 w-4 h-4 bg-white/10 rounded-full pointer-events-none" />

            <div className="relative z-30">
              <h2 className="text-4xl font-extrabold mb-4">
                {isSignUp ? "Authorized Access" : "System Admin"}
              </h2>
              <p className="text-sm opacity-80 mb-10 leading-relaxed max-w-[260px] mx-auto">
                {isSignUp
                  ? "Welcome back. Log in with your administrative credentials to access the console."
                  : "First time here? Register your administrative account to manage the ecosystem."}
              </p>
              <button
                onClick={() => setMode(isSignUp ? "signin" : "signup")}
                className="px-12 py-3 border-2 border-white rounded-full font-bold uppercase text-xs tracking-widest hover:bg-white hover:text-[#1B365D] transition-all duration-300 active:scale-95"
              >
                {isSignUp ? "Go to Sign In" : "Register Admin"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
