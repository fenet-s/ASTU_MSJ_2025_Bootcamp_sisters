"use client";
import { useEffect, useState } from "react";
import api from "../../../lib/api";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldAlert, Trash2, UserCheck } from "lucide-react";

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/users"); // This route is protected by 'admin' middleware
      setUsers(data);
    } catch (err) {
      router.push("/dashboard"); // Kick out if not admin
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (
      confirm(
        `CRITICAL: Are you sure you want to delete ${name}? This will remove all their products too.`,
      )
    ) {
      await api.delete(`/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading Management Console...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-xs font-bold uppercase text-gray-400 mb-10 hover:text-black"
        >
          <ArrowLeft size={16} /> Exit Admin Mode
        </button>

        <div className="flex items-center gap-4 mb-12">
          <div className="bg-red-600 p-3 rounded-2xl text-white shadow-lg shadow-red-200">
            <ShieldAlert size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-light tracking-tighter">
              User Management
            </h1>
            <p className="text-gray-400 text-sm italic">Admin Control Panel</p>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Username
                </th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Email
                </th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Role
                </th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((u) => (
                <tr
                  key={u._id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="p-6 font-medium">@{u.username}</td>
                  <td className="p-6 text-gray-500">{u.email}</td>
                  <td className="p-6">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${u.role === "admin" ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-500"}`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    {u.role !== "admin" && (
                      <button
                        onClick={() => handleDeleteUser(u._id, u.username)}
                        className="text-gray-300 hover:text-red-600 transition-colors"
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
  );
}
