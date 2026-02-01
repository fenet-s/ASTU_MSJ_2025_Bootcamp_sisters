"use client";
import { useEffect, useState } from "react";
import api from "../../../lib/api";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Plus, ArrowLeft, Trash2 } from "lucide-react";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    api.get("/auth/profile").then((res) => setUser(res.data));
    api.get("/events").then((res) => setEvents(res.data));
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Cancel this event?")) {
      await api.delete(`/events/${id}`);
      setEvents(events.filter((e) => e._id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="h-20 border-b border-gray-50 flex items-center px-8 justify-between sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <button
          onClick={() => router.push("/dashboard")}
          className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black"
        >
          <ArrowLeft size={16} className="inline mr-2" /> the collection
        </button>
        <h1 className="text-2xl font-serif italic absolute left-1/2 -translate-x-1/2">
          ASTU marketplace notices
        </h1>
        <button
          onClick={() => router.push("/dashboard/events/create")}
          className="bg-black text-white p-2 rounded-full hover:scale-110 transition-transform"
        >
          <Plus size={20} />
        </button>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-20 text-center">
          <h2 className="text-6xl font-light tracking-tighter mb-4 text-gray-900">
            Campus Notices
          </h2>
          <p className="text-gray-400 italic">
            Upcoming gatherings, workshops, and student meets.
          </p>
        </div>

        <div className="space-y-24">
          {events.map((event) => (
            <div
              key={event._id}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start group"
            >
              {/* Date Block */}
              <div className="md:col-span-2 text-center md:text-left">
                <p className="text-5xl font-serif italic text-black">
                  {new Date(event.date).getDate()}
                </p>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  {new Date(event.date).toLocaleString("default", {
                    month: "short",
                  })}
                </p>
              </div>

              {/* Content Block */}
              <div className="md:col-span-7 space-y-4">
                <h3 className="text-2xl font-medium tracking-tight group-hover:underline decoration-1 underline-offset-8">
                  {event.title}
                </h3>
                <p className="text-gray-500 font-light leading-relaxed">
                  {event.description}
                </p>
                <div className="flex gap-6 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} /> {event.location}
                  </span>
                  <span className="text-black">
                    Organized by @{event.organizer?.username}
                  </span>
                </div>
              </div>

              {/* Action/Image Block */}
              <div className="md:col-span-3">
                {event.imageUrl && (
                  <img
                    src={event.imageUrl}
                    className="w-full aspect-video object-cover rounded-xl grayscale hover:grayscale-0 transition-all duration-700 shadow-sm"
                    alt=""
                  />
                )}
                {(user?.role === "admin" ||
                  user?._id === event.organizer?._id) && (
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="mt-4 text-red-400 hover:text-red-600 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"
                  >
                    <Trash2 size={14} /> Remove Notice
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
