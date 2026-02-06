"use client";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Globe,
  Zap,
  Mail,
  Send,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* --- 1. STICKY NAVIGATION --- */}
      <nav className="h-20 md:h-24 px-6 md:px-16 flex items-center justify-between border-b border-gray-50 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <h1 className="text-2xl md:text-3xl font-serif italic tracking-tighter cursor-default">
          ASTU Marketplace
        </h1>
        <div className="flex items-center gap-8">
          <button
            onClick={() => router.push("/register")}
            className="hidden sm:block bg-black text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-800 transition-all active:scale-95"
          >
            Join Now
          </button>
        </div>
      </nav>

      <main>
        {/* --- 2. HERO SECTION --- */}
        <section className="max-w-[1440px] mx-auto px-6 md:px-16 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <Sparkles size={12} className="text-blue-500" /> Exclusive Campus
              Collection
            </div>

            <h2 className="text-6xl md:text-8xl font-light tracking-tighter leading-[0.85] text-black">
              Elevate Your <br />
              <span className="italic font-serif underline decoration-1 underline-offset-[12px]">
                Campus
              </span>{" "}
              Life.
            </h2>

            <p className="text-gray-500 text-lg md:text-xl font-light max-w-md leading-relaxed">
              The premium trade platform for ASTU students. Discover curated
              essentials, list your pieces, and connect with your community.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => router.push("/register")}
                className="bg-black text-white px-10 py-6 rounded-none text-xs font-black uppercase tracking-[0.3em] hover:bg-gray-800 transition-all shadow-2xl shadow-black/20 active:scale-95 flex items-center justify-center gap-3"
              >
                Join the Collection <ArrowRight size={16} />
              </button>
              <button
                onClick={() => router.push("/login")}
                className="bg-white text-black border border-gray-200 px-10 py-6 rounded-none text-xs font-black uppercase tracking-[0.3em] hover:bg-gray-50 transition-all active:scale-95"
              >
                Enter Store
              </button>
            </div>
          </div>

          <div className="relative aspect-[4/5] rounded-[2rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl bg-gray-100 order-1 lg:order-2 group">
            <img
              src="https://media.licdn.com/dms/image/v2/D4E12AQEshlIPEDkvUA/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1696826027836?e=2147483647&v=beta&t=byQWbEldB9nSCosp8eNTHmEVdb8lTlyBSf6W40faHrk"
              className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out"
              alt="ASTU Marketplace Lifestyle"
            />
            <div className="absolute inset-0 ring-1 ring-black/5 rounded-[2rem] md:rounded-[3.5rem] pointer-events-none"></div>
          </div>
        </section>

        {/* --- 3. FEATURE STRIP --- */}
        <section className="bg-black text-white py-16 px-6 md:px-16">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-24">
            <div className="space-y-4">
              <div className="text-blue-400 uppercase text-[10px] font-black tracking-[0.4em] mb-2">
                — Security
              </div>
              <h3 className="text-xl font-medium tracking-tight">
                Verified Trade
              </h3>
              <p className="text-gray-500 text-sm font-light leading-relaxed">
                Student-only access with secure campus email verification and
                modern JWT encryption.
              </p>
            </div>
            <div className="space-y-4">
              <div className="text-blue-400 uppercase text-[10px] font-black tracking-[0.4em] mb-2">
                — Speed
              </div>
              <h3 className="text-xl font-medium tracking-tight">
                Instant Connect
              </h3>
              <p className="text-gray-500 text-sm font-light leading-relaxed">
                Integrated Telegram and Email protocols for zero-friction
                communication between peers.
              </p>
            </div>
            <div className="space-y-4">
              <div className="text-blue-400 uppercase text-[10px] font-black tracking-[0.4em] mb-2">
                — Design
              </div>
              <h3 className="text-xl font-medium tracking-tight">
                Curated Feed
              </h3>
              <p className="text-gray-500 text-sm font-light leading-relaxed">
                A luxury editorial interface designed to highlight the quality
                of every listing in the collection.
              </p>
            </div>
          </div>
        </section>

        {/* --- 4. THE EXPERIENCE SECTION --- */}
        <section className="max-w-[1440px] mx-auto px-6 md:px-16 py-24 md:py-40 text-center">
          <div className="max-w-3xl mx-auto space-y-12">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-300">
              The Student Standard
            </span>
            <h2 className="text-4xl md:text-7xl font-light tracking-tighter leading-none">
              Trade your assets. <br /> Discover the{" "}
              <span className="italic font-serif">extraordinary</span>.
            </h2>
            <div className="flex justify-center gap-12 pt-8">
              <div className="flex flex-col items-center gap-2">
                <Send size={24} strokeWidth={1} />
                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                  Direct
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <ShieldCheck size={24} strokeWidth={1} />
                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                  Secure
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Zap size={24} strokeWidth={1} />
                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                  Fast
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* --- 5. MINIMALIST FOOTER --- */}
      <footer className="py-20 text-center border-t border-gray-50">
        <h2 className="text-6xl md:text-9xl font-serif italic text-gray-50 mb-12 select-none tracking-tighter">
          astu
        </h2>
        <div className="space-y-6">
          <div className="flex justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <Link href="/login" className="hover:text-black">
              Sign In
            </Link>
            <Link href="/register" className="hover:text-black">
              Register
            </Link>
            <span className="cursor-not-allowed">Privacy</span>
            <span className="cursor-not-allowed">Terms</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-200">
            © 2026 ASTU Marketplace Studio
          </p>
        </div>
      </footer>
    </div>
  );
}
