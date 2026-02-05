"use client";
import { useEffect, useState } from "react";
import api from "../../lib/api";
import { useRouter } from "next/navigation";
import {
  LogOut,
  PlusCircle,
  ShoppingBag,
  Search,
  Menu,
  Trash2,
  Package,
  User,
  ShieldAlert,
  Sparkles,
  Filter,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    api
      .get("/auth/profile")
      .then((res) => setUser(res.data))
      .catch(() => router.push("/login"));
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* --- STATIC SIDEBAR (Desktop) --- */}
      <aside className="hidden lg:flex w-80 h-screen sticky top-0 border-r border-gray-100 flex-col p-8 z-50 bg-white">
        <h1
          className="text-4xl font-serif italic mb-16 cursor-pointer"
          onClick={() => router.push("/dashboard")}
        >
          wiñk
        </h1>

        <nav className="flex-1 space-y-10">
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">
              Collection
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-3 font-medium hover:text-blue-600 transition-colors"
            >
              <Package size={18} /> Discovery
            </button>
            <button
              onClick={() => router.push("/dashboard/events")}
              className="flex items-center gap-3 font-medium hover:text-blue-600 transition-colors"
            >
              <Sparkles size={18} /> Bulletin
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">
              Account
            </p>
            <button
              onClick={() => router.push("/dashboard/profile")}
              className="flex items-center gap-3 font-medium hover:text-blue-600 transition-colors"
            >
              <User size={18} /> My Profile
            </button>
            <button
              onClick={() => router.push("/dashboard/create")}
              className="flex items-center gap-3 font-medium hover:text-blue-600 transition-colors text-blue-600"
            >
              <PlusCircle size={18} /> Sell an Item
            </button>
            {user?.role === "admin" && (
              <button
                onClick={() => router.push("/dashboard/admin")}
                className="flex items-center gap-3 font-medium text-red-500 hover:text-red-700 transition-colors"
              >
                <ShieldAlert size={18} /> Moderator
              </button>
            )}
          </div>
        </nav>

        <div className="pt-8 border-t border-gray-50">
          <button
            onClick={() =>
              api.post("/auth/logout").then(() => router.push("/login"))
            }
            className="flex items-center gap-3 text-gray-400 hover:text-black font-bold text-sm"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* --- MAIN SCROLLABLE AREA --- */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header (Hidden on Desktop) */}
        <nav className="lg:hidden h-20 border-b border-gray-50 bg-white sticky top-0 z-[100] px-6 flex items-center justify-between">
          <h1 className="text-2xl font-serif italic">wiñk</h1>
          <button onClick={() => router.push("/dashboard/profile")}>
            <User size={20} />
          </button>
        </nav>

        {/* Content Page (discovery/bulletin/etc) */}
        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
