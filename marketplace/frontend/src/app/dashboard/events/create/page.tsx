"use client";
import { useState } from "react";
import api from "../../../../lib/api";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Image as ImageIcon, Sparkles } from "lucide-react";

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
    try {
      await api.post("/events", formData);
      router.push("/dashboard/events");
    } catch (err) {
      alert("Failed to publish notice. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a]">
      {/* --- RESPONSIVE HEADER --- */}
      <nav className="h-16 md:h-20 border-b border-gray-100 flex items-center px-4 md:px-8 justify-between sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
        >
          <ArrowLeft size={14} />{" "}
          <span className="hidden sm:inline">discard notice</span>
          <span className="sm:hidden">discard</span>
        </button>
        <h1 className="text-xl md:text-2xl font-serif italic tracking-tighter absolute left-1/2 -translate-x-1/2">
          ASTU Marketplace
        </h1>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12 md:py-20">
        <header className="mb-12 md:mb-16 text-center md:text-left">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 mb-6 text-blue-600">
            <Sparkles size={20} />
          </div>
          <h2 className="text-4xl md:text-6xl font-light tracking-tighter mb-3">
            Draft a Notice
          </h2>
          <p className="text-gray-400 italic font-light text-sm md:text-base">
            Broadcast your event to the entire ASTU campus collection.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* EVENT TITLE */}
          <div className="border-b border-gray-100 pb-2 transition-all focus-within:border-black">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1 block">
              Event Heading
            </label>
            <input
              required
              type="text"
              className="w-full py-2 text-xl md:text-2xl font-medium outline-none bg-transparent placeholder:text-gray-200"
              placeholder="e.g. Vintage Pop-up Sale"
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          {/* RESPONSIVE GRID FOR DATE & LOCATION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="border-b border-gray-100 pb-2 transition-all focus-within:border-black">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1 block">
                Scheduled Date
              </label>
              <input
                required
                type="date"
                className="w-full py-2 text-lg outline-none bg-transparent"
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>
            <div className="border-b border-gray-100 pb-2 transition-all focus-within:border-black">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1 block">
                Venue / Location
              </label>
              <input
                required
                type="text"
                className="w-full py-2 text-lg outline-none bg-transparent placeholder:text-gray-200"
                placeholder="e.g. Block 4 Lounge"
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>
          </div>

          {/* IMAGE URL FIELD */}
          <div className="border-b border-gray-100 pb-2 transition-all focus-within:border-black">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1 block">
              Cover Image URL (Optional)
            </label>
            <div className="flex items-center gap-3">
              <ImageIcon size={16} className="text-gray-300" />
              <input
                type="text"
                className="w-full py-2 text-sm font-mono text-blue-500 outline-none bg-transparent placeholder:text-gray-200"
                placeholder="https://images.unsplash.com/..."
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
              />
            </div>
          </div>

          {/* DETAILS / DESCRIPTION */}
          <div className="border-b border-gray-100 pb-2 transition-all focus-within:border-black">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1 block">
              Notice Details
            </label>
            <textarea
              required
              rows={4}
              className="w-full py-2 text-base md:text-lg font-light outline-none resize-none bg-transparent placeholder:text-gray-200"
              placeholder="Tell us what's happening..."
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white py-5 rounded-none text-[10px] font-black uppercase tracking-[0.4em] hover:bg-gray-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] shadow-2xl shadow-black/10"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Publishing
                </>
              ) : (
                "Publish to Bulletin"
              )}
            </button>
            <p className="mt-6 text-center text-[9px] text-gray-300 uppercase tracking-widest leading-relaxed">
              Notices are visible to the entire campus community.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
