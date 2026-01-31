"use client";
import { useEffect, useState } from "react";
import api from "../../../../lib/api";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function EditProduct() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    imageUrl: "",
  });

  // Fetch the current product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products`); // Get all products
        const product = data.find((p: any) => p._id === id); // Find this specific one
        if (product) {
          setFormData({
            title: product.title,
            description: product.description,
            price: product.price,
            category: product.category,
            imageUrl: product.imageUrl || "",
          });
        }
      } catch (err) {
        console.error("Could not fetch product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/products/${id}`, formData);
      router.push("/dashboard");
    } catch (err) {
      alert("Failed to update product.");
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 mb-10 hover:text-black"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <h1 className="text-4xl font-light tracking-tight mb-10">
          Edit Listing
        </h1>

        <form onSubmit={handleUpdate} className="space-y-8">
          <div className="border-b border-gray-100 pb-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Item Title
            </label>
            <input
              type="text"
              value={formData.title}
              required
              className="w-full py-2 text-xl outline-none"
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-10">
            <div className="border-b border-gray-100 pb-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Price ($)
              </label>
              <input
                type="number"
                value={formData.price}
                required
                className="w-full py-2 text-xl outline-none"
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>
            <div className="border-b border-gray-100 pb-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Category
              </label>
              <select
                value={formData.category}
                className="w-full py-2 text-xl outline-none bg-transparent"
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="Books">Books</option>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Clothing">Clothing</option>
              </select>
            </div>
          </div>

          <div className="border-b border-gray-100 pb-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Image URL
            </label>
            <input
              type="text"
              value={formData.imageUrl}
              className="w-full py-2 text-sm outline-none font-mono text-gray-400"
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
            />
          </div>

          <div className="border-b border-gray-100 pb-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Description
            </label>
            <textarea
              value={formData.description}
              rows={3}
              required
              className="w-full py-2 text-base outline-none resize-none"
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white p-5 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
          >
            Update Collection Item
          </button>
        </form>
      </div>
    </div>
  );
}
