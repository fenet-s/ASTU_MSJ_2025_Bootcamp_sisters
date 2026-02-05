"use client";
import { useEffect, useState } from "react";
import api from "../../../lib/api";
import { useRouter } from "next/navigation";
import {
  Calendar,
  MapPin,
  Plus,
  ArrowLeft,
  Trash2,
  Sparkles,
} from "lucide-react";

export default function EventsPage() {
  const [events, setProducts] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        const userRes = await api.get("/auth/profile");
        setUser(userRes.data);
        const eventRes = await api.get("/events");
        setProducts(eventRes.data);
      } catch (err) {
        console.error("Failed to load events");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Cancel this event?")) {
      await api.delete(`/events/${id}`);
      setProducts(events.filter((e) => e._id !== id));
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center font-serif italic animate-pulse">
        Loading events...
      </div>
    );

  return (
    <div className="min-h-screen bg-white text-black">
      {/* --- RESPONSIVE NAV --- */}
      <nav className="h-16 md:h-20 border-b border-gray-50 flex items-center px-4 md:px-8 justify-between sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
        >
          <ArrowLeft size={14} />{" "}
          <span className="hidden sm:inline">the collection</span>
        </button>

        <h1 className="text-lg md:text-2xl font-serif italic absolute left-1/2 -translate-x-1/2 whitespace-nowrap">
          ASTU Marketplace
        </h1>

        <button
          onClick={() => router.push("/dashboard/events/create")}
          className="bg-black text-white p-2 rounded-full hover:scale-110 active:scale-95 transition-all shadow-lg"
        >
          <Plus size={18} />
        </button>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12 md:py-20">
        {/* --- HERO SECTION --- */}
        <div className="mb-16 md:mb-28 text-center">
          <span className="inline-block p-3 bg-gray-50 rounded-full mb-6 text-blue-600">
            <Sparkles size={24} />
          </span>
          <h2 className="text-4xl md:text-7xl font-light tracking-tighter mb-4 text-gray-900 leading-none">
            Campus Notices
          </h2>
          <p className="text-gray-400 italic text-sm md:text-base">
            Upcoming gatherings, workshops, and student meets.
          </p>
        </div>

        {/* --- EVENTS LIST --- */}
        <div className="space-y-20 md:space-y-32">
          {events.map((event) => (
            <div
              key={event._id}
              className="flex flex-col md:grid md:grid-cols-12 gap-6 md:gap-12 items-start group"
            >
              {/* Date Block (Top on Mobile, Left on Desktop) */}
              <div className="flex md:flex-col items-baseline md:items-start gap-3 md:gap-0 md:col-span-2 border-b md:border-none border-gray-100 pb-4 md:pb-0 w-full">
                <p className="text-5xl md:text-7xl font-serif italic text-black leading-none">
                  {new Date(event.date).getDate()}
                </p>
                <p className="text-xs md:text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 md:mt-2">
                  {new Date(event.date).toLocaleString("default", {
                    month: "long",
                  })}
                </p>
              </div>

              {/* Content Block */}
              <div className="md:col-span-6 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-2xl md:text-3xl font-medium tracking-tight group-hover:text-blue-600 transition-colors duration-500">
                    {event.title}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <span className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded text-gray-600">
                      <MapPin size={12} /> {event.location}
                    </span>
                    <span className="flex items-center gap-1.5 py-1">
                      By @{event.organizer?.username}
                    </span>
                  </div>
                </div>
                <p className="text-gray-500 font-light leading-relaxed text-sm md:text-base max-w-xl">
                  {event.description}
                </p>
              </div>

              {/* Action/Image Block */}
              <div className="md:col-span-4 w-full">
                {event.imageUrl ? (
                  <div className="overflow-hidden rounded-2xl shadow-sm">
                    <img
                      src={event.imageUrl}
                      className="w-full aspect-video md:aspect-square object-cover grayscale hover:grayscale-0 transition-all duration-1000 ease-in-out group-hover:scale-105"
                      alt={event.title}
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-video md:aspect-square bg-gray-50 rounded-2xl flex items-center justify-center text-gray-200">
                    <Calendar size={48} strokeWidth={1} />
                  </div>
                )}

                {(user?.role === "admin" ||
                  user?._id === event.organizer?._id) && (
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-300 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={14} /> Remove Notice
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* --- EMPTY STATE --- */}
        {events.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed border-gray-50 rounded-[3rem]">
            <p className="text-gray-300 italic font-light">
              The bulletin is currently empty.
            </p>
            <button
              onClick={() => router.push("/dashboard/events/create")}
              className="mt-4 text-[10px] font-black uppercase tracking-widest border-b border-black pb-1"
            >
              Post a notice
            </button>
          </div>
        )}
      </main>

      <footer className="py-20 border-t border-gray-50 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-200">
          ASTU marketplace studio © 2026
        </p>
      </footer>
    </div>
  );
}
