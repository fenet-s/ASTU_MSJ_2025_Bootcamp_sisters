"use client";
import { ArrowRight, Sparkles, ShieldCheck, Globe } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* --- HERO SECTION --- */}
      <nav className="h-24 px-8 md:px-16 flex items-center justify-between">
        <h1 className="text-3xl font-serif italic tracking-tighter">
          ASTU Marketplace
        </h1>
        <button
          onClick={() => router.push("/login")}
          className="text-xs font-bold uppercase tracking-widest border-b-2 border-black pb-1 hover:text-blue-600 hover:border-blue-600 transition-all"
        >
          Sign In
        </button>
      </nav>

      <main>
        <section className="px-8 md:px-16 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <Sparkles size={12} className="text-blue-500" /> ASTU Campus
              Exclusive
            </div>
            <h2 className="text-6xl md:text-8xl font-light tracking-tighter leading-[0.9]">
              Elevate Your <br />
              <span className="italic font-serif">Campus</span> Life.
            </h2>
            <p className="text-gray-500 text-lg md:text-xl font-light max-w-md leading-relaxed">
              The high-end marketplace for ASTU students. Discover curated
              essentials, trade with peers, and stay connected.
            </p>
            <div className="flex gap-6">
              <button
                onClick={() => router.push("/register")}
                className="bg-black text-white px-10 py-5 text-xs font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-2xl shadow-black/20"
              >
                Join the Collection
              </button>
            </div>
          </div>

          <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=2070&auto=format&fit=crop"
              className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-1000"
              alt="Luxury Lifestyle"
            />
          </div>
        </section>

        {/* FEATURE BAR */}
        <section className="bg-slate-50 py-20 px-8 md:px-16 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <ShieldCheck size={32} strokeWidth={1} />
            <h3 className="text-lg font-medium tracking-tight">
              Verified Community
            </h3>
            <p className="text-gray-400 text-sm font-light">
              Safe, student-only trading with secure JWT authentication.
            </p>
          </div>
          <div className="space-y-4">
            <Globe size={32} strokeWidth={1} />
            <h3 className="text-lg font-medium tracking-tight">
              Direct Connect
            </h3>
            <p className="text-gray-400 text-sm font-light">
              Instant Telegram and Email inquiries for faster campus trades.
            </p>
          </div>
          <div className="space-y-4">
            <Sparkles size={32} strokeWidth={1} />
            <h3 className="text-lg font-medium tracking-tight">
              Curated Style
            </h3>
            <p className="text-gray-400 text-sm font-light">
              A premium interface designed for the modern ASTU scholar.
            </p>
          </div>
        </section>
      </main>

      <footer className="py-20 text-center border-t border-gray-50">
        <h2 className="text-8xl font-serif italic text-slate-50 mb-8 select-none tracking-tighter">
          ASTU marketplace
        </h2>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">
          © 2026 ASTU marketplace studio
        </p>
      </footer>
    </div>
  );
}
