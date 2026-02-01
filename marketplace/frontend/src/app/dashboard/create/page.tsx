"use client";
import { useState } from "react";
import api from "../../../lib/api";
import { useRouter } from "next/navigation";
import { ArrowLeft, Package, Sparkles } from "lucide-react";

export default function CreateProduct() {
  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
    description: "",
    price: "",
    category: "",
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/products", formData);
      router.push("/dashboard");
    } catch (err) {
      alert("Failed to create product. Make sure you are logged in.");
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a]">
      {/* --- HEADER --- */}
      <nav className="h-20 border-b border-gray-100 flex items-center px-8 justify-between sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
        >
          <ArrowLeft size={16} /> back
        </button>
        <h1 className="text-2xl font-serif italic tracking-tighter absolute left-1/2 -translate-x-1/2">
          ASTU Marketplace
        </h1>
        <div className="w-10"></div> {/* Spacer for symmetry */}
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-16">
        <header className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 mb-4 text-blue-600">
            <Sparkles size={20} />
          </div>
          <h2 className="text-4xl font-light tracking-tight mb-2 text-gray-900">
            Add to the Collection
          </h2>
          <p className="text-gray-400 font-light italic">
            List your piece for the campus community to discover.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* PRODUCT TITLE */}
          <div className="border-b border-gray-100 pb-2 transition-all focus-within:border-black">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-700 mb-1 block">
              The Title
            </label>
            <input
              type="text"
              required
              className="w-full py-2 text-xl font-medium outline-none placeholder:text-gray-200"
              placeholder="e.g. Modern Studio Desk"
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* PRICE */}
            <div className="border-b border-gray-100 pb-2 transition-all focus-within:border-black">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-700 mb-1 block">
                Price ($)
              </label>
              <input
                type="number"
                required
                className="w-full py-2 text-xl font-medium outline-none placeholder:text-gray-200"
                placeholder="0.00"
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>

            {/* CATEGORY */}
            <div className="border-b border-gray-100 pb-2 transition-all focus-within:border-black">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-700 mb-1 block">
                Category
              </label>
              <select
                required
                className="w-full py-2 text-lg font-medium outline-none bg-transparent appearance-none cursor-pointer"
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="">Select Category</option>
                <optgroup label="Academic">
                  <option value="Books & Stationery">Books & Stationery</option>
                  <option value="Lab Gear">Lab Gear</option>
                </optgroup>
                <optgroup label="Tech">
                  <option value="Electronics">Electronics</option>
                  <option value="Tech Accessories">Tech Accessories</option>
                </optgroup>
                <optgroup label="Fashion">
                  <option value="Clothing">Clothing</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Bags & Accessories">Bags & Accessories</option>
                </optgroup>
                <optgroup label="Living">
                  <option value="Furniture & Dorm">Furniture & Dorm</option>
                  <option value="Kitchen & Dining">Kitchen & Dining</option>
                  <option value="Home Decor">Home Decor</option>
                </optgroup>
              </select>
            </div>
          </div>

          {/* IMAGE URL */}
          <div className="border-b border-gray-100 pb-2 transition-all focus-within:border-black">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-700 mb-1 block">
              Cover Image URL
            </label>
            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              className="w-full py-2 text-sm font-mono text-gray-900 outline-none placeholder:text-gray-200"
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
            />
          </div>

          {/* DESCRIPTION */}
          <div className="border-b border-gray-100 pb-2 transition-all focus-within:border-black">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-700 mb-1 block">
              Condition & Details
            </label>
            <textarea
              required
              rows={4}
              className="w-full py-2 text-base font-light outline-none resize-none placeholder:text-gray-200"
              placeholder="Describe the story and condition of the item..."
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-6">
            <button
              type="submit"
              className="w-full bg-black text-white py-5 rounded-none text-xs font-black uppercase tracking-[0.3em] hover:bg-gray-800 transition-all active:scale-[0.98] shadow-2xl shadow-black/10 flex items-center justify-center gap-3"
            >
              <Package size={16} /> Post Listing
            </button>
            <p className="mt-6 text-center text-[10px] text-gray-300 uppercase tracking-widest">
              By posting, you agree to our campus collection guidelines.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
