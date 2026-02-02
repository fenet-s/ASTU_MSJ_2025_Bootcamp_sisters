"use client";
import { useState } from "react";
import api from "../../lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2, ShieldCheck, Eye, EyeOff } from "lucide-react"; // Added Eye icons

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // New state for visibility
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post("/auth/login", { email, password });
      router.push("/dashboard");
    } catch (err) {
      alert("Invalid credentials. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-12 border border-slate-100">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif italic tracking-tighter mb-2 text-black">
            ASTU Marketplace
          </h1>
          <p className="text-slate-400 text-sm font-light tracking-wide">
            Welcome back to the collection.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
              Email Address
            </label>
            <input
              type="email"
              required
              className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-300"
              placeholder="name@campus.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
              Password
            </label>
            <div className="relative">
              {" "}
              {/* Relative container for the icon */}
              <input
                type={showPassword ? "text" : "password"} // Dynamic type
                required
                className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-300 pr-12"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button" // Important: prevents form submission
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="group w-full bg-black text-white p-4 rounded-2xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                Sign In{" "}
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </>
            )}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-slate-100 text-center">
          <p className="text-slate-400 text-sm font-light mb-8">
            New to the marketplace?{" "}
            <Link
              href="/register"
              className="text-black font-bold hover:underline underline-offset-4 transition-all"
            >
              Create an account
            </Link>
          </p>

          <div className="p-6 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200 text-left">
            <div className="flex items-center gap-2 mb-4 text-blue-600">
              <ShieldCheck size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                Reviewer Access
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-slate-400 font-medium uppercase tracking-tighter">
                  Admin User
                </span>
                <code className="text-[12px] font-mono text-slate-900 bg-white px-2 py-1 rounded-lg border border-slate-100 select-all">
                  temkin@gmail.com
                </code>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-slate-400 font-medium uppercase tracking-tighter">
                  Passcode
                </span>
                <code className="text-[12px] font-mono text-slate-900 bg-white px-2 py-1 rounded-lg border border-slate-100 select-all">
                  123456789
                </code>
              </div>
            </div>

            <p className="mt-4 text-[9px] text-slate-400 italic text-center leading-relaxed">
              Use these credentials to access the administrative dashboard and
              moderation tools.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
