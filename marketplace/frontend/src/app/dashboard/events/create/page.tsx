"use client";
import { useState } from "react";
import api from "../../../../lib/api";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function CreateEvent() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    imageUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await api.post("/events", formData);
    router.push("/dashboard/events");
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-xl mx-auto">
        <button
          onClick={() => router.back()}
          className="text-xs font-black uppercase tracking-widest text-gray-400 mb-12 flex items-center gap-2 hover:text-black transition-colors"
        >
          <ArrowLeft size={16} /> discard notice
        </button>
        <h1 className="text-5xl font-light tracking-tighter mb-12">
          New Notice
        </h1>
        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="border-b border-gray-100 pb-2">
            <label className="text-[10px] font-black uppercase text-gray-400">
              Event Title
            </label>
            <input
              required
              type="text"
              className="w-full py-2 text-xl outline-none"
              placeholder="Workshop / Meetup / Sale"
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="border-b border-gray-100 pb-2">
              <label className="text-[10px] font-black uppercase text-gray-400">
                Date
              </label>
              <input
                required
                type="date"
                className="w-full py-2 outline-none"
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>
            <div className="border-b border-gray-100 pb-2">
              <label className="text-[10px] font-black uppercase text-gray-400">
                Location
              </label>
              <input
                required
                type="text"
                className="w-full py-2 outline-none"
                placeholder="Dorm / Library / Hall"
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>
          </div>

          <div className="border-b border-gray-100 pb-2">
            <label className="text-[10px] font-black uppercase text-gray-400">
              Details
            </label>
            <textarea
              required
              rows={3}
              className="w-full py-2 outline-none resize-none"
              placeholder="What is happening?"
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white py-5 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {isSubmitting ? "Publishing..." : "Publish to Bulletin"}
          </button>
        </form>
      </div>
    </div>
  );
}
