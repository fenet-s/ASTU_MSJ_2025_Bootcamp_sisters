"use client";
import { ArrowRight, Sparkles, ShieldCheck, Globe } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* Top Nav */}
      <nav className="h-20 px-6 md:px-16 flex items-center justify-between border-b border-gray-50">
        <h1 className="text-2xl font-serif italic tracking-tighter">
          ASTU Marketplace
        </h1>
        <button
          onClick={() => router.push("/login")}
          className="text-xs font-black uppercase tracking-widest border-b-2 border-black pb-1 hover:text-blue-600 hover:border-blue-600 transition-all"
        >
          Sign In
        </button>
      </nav>

      <main className="max-w-[1440px] mx-auto">
        <section className="px-6 md:px-16 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <Sparkles size={12} className="text-blue-500" /> Exclusive Campus
              Collection
            </div>
            <h2 className="text-5xl md:text-8xl font-light tracking-tighter leading-[0.9]">
              Elevate Your <br />
              <span className="italic font-serif underline decoration-1 underline-offset-8">
                Campus
              </span>{" "}
              Life.
            </h2>
            <p className="text-gray-500 text-lg md:text-xl font-light max-w-md leading-relaxed">
              The premium marketplace for ASTU students. Discover curated
              essentials, trade with peers, and join the collection.
            </p>
            <button
              onClick={() => router.push("/register")}
              className="bg-black text-white px-10 py-5 text-xs font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-2xl active:scale-95"
            >
              Join the Collection
            </button>
          </div>

          <div className="relative aspect-[4/5] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl bg-gray-100">
            <img
              src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=2070&auto=format&fit=crop"
              className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-1000"
              alt="Luxury Lifestyle"
            />
          </div>
        </section>
      </main>

      <footer className="py-20 text-center border-t border-gray-50">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">
          © 2026 ASTU Marketplace Studio
        </p>
      </footer>
    </div>
  );
}
