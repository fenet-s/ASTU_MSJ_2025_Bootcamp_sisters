"use client";
import { useEffect, useState } from "react";
import api from "../../../lib/api";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShieldAlert,
  Trash2,
  Users,
  Package,
  Calendar,
} from "lucide-react";

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState({ users: 0, products: 0, events: 0 }); // Stats state
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const userRes = await api.get("/users");
        const statsRes = await api.get("/users/stats"); // Fetch counts
        setUsers(userRes.data);
        setStats(statsRes.data);
      } catch (err) {
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    loadAdminData();
  }, [router]);

  const handleDeleteUser = async (id: string, name: string) => {
    if (confirm(`CRITICAL: Remove ${name} and all their data?`)) {
      await api.delete(`/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
      // Refresh stats after delete
      const { data } = await api.get("/users/stats");
      setStats(data);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center font-serif italic">
        Loading Admin Console...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 mb-10 hover:text-black transition-colors"
        >
          <ArrowLeft size={14} /> Exit Management
        </button>

        <header className="mb-12">
          <h1 className="text-4xl md:text-6xl font-light tracking-tighter mb-2">
            Campus Control
          </h1>
          <p className="text-gray-400 italic">
            Moderation and Platform Overview
          </p>
        </header>

        {/* --- ANALYTICS CARDS --- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {[
            {
              label: "Total Students",
              value: stats.users,
              icon: Users,
              color: "text-blue-600",
            },
            {
              label: "Active Listings",
              value: stats.products,
              icon: Package,
              color: "text-green-600",
            },
            {
              label: "Campus Events",
              value: stats.events,
              icon: Calendar,
              color: "text-orange-600",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-xl transition-all"
            >
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                  {item.label}
                </p>
                <p className="text-4xl font-serif italic text-black">
                  {item.value}
                </p>
              </div>
              <div
                className={`${item.color} opacity-20 group-hover:opacity-100 transition-opacity`}
              >
                <item.icon size={32} strokeWidth={1} />
              </div>
            </div>
          ))}
        </div>

        {/* --- USER TABLE --- */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center gap-3 text-red-600">
            <ShieldAlert size={18} />
            <h3 className="text-xs font-black uppercase tracking-widest">
              Student Directory
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Student
                  </th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Contact
                  </th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Tier
                  </th>
                  <th className="p-6 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => (
                  <tr
                    key={u._id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="p-6">
                      <div className="font-bold text-gray-900">
                        @{u.username}
                      </div>
                      <div className="text-[10px] text-gray-300 font-mono">
                        {u._id}
                      </div>
                    </td>
                    <td className="p-6 text-sm text-gray-600">{u.email}</td>
                    <td className="p-6">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${u.role === "admin" ? "bg-black text-white" : "bg-gray-100 text-gray-400"}`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      {u.role !== "admin" && (
                        <button
                          onClick={() => handleDeleteUser(u._id, u.username)}
                          className="text-gray-300 hover:text-red-600 transition-colors p-2"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
