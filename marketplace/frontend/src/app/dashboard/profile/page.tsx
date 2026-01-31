"use client";
import { useEffect, useState } from "react";
import api from "../../../lib/api";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Package,
  User,
  Mail,
  Send,
  Trash2,
  Pencil,
} from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [myProducts, setMyProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const userRes = await api.get("/auth/profile");
        setUser(userRes.data);
        const productRes = await api.get("/products/me");
        setMyProducts(productRes.data);
      } catch (err) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    loadProfileData();
  }, [router]);

  const handleDelete = async (id: string) => {
    if (confirm("Permanently remove this listing?")) {
      try {
        await api.delete(`/products/${id}`);
        setMyProducts(myProducts.filter((p) => p._id !== id));
      } catch (err) {
        alert("Failed to delete.");
      }
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center font-serif italic animate-pulse">
        ASTU profile...
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      {/* --- HEADER --- */}
      <nav className="h-16 md:h-20 border-b border-gray-50 flex items-center px-4 md:px-8 justify-between sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
        >
          <ArrowLeft size={14} />{" "}
          <span className="hidden sm:inline">back to collection</span>
          <span className="sm:hidden">back</span>
        </button>
        <h1 className="text-xl md:text-2xl font-serif italic tracking-tighter absolute left-1/2 -translate-x-1/2">
          ASTU Marketplace
        </h1>
      </nav>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-16">
        {/* --- USER PROFILE CARD --- */}
        <section className="mb-12 md:mb-20 flex flex-col md:flex-row items-center gap-6 md:gap-12 border-b border-gray-50 pb-12 md:pb-16 text-center md:text-left">
          {/* Avatar */}
          <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 border border-gray-100 flex-shrink-0">
            <User size={40} strokeWidth={1} className="md:w-16 md:h-16" />{" "}
          </div>

          {/* User Details */}
          <div className="space-y-3 flex-1">
            <h2 className="text-3xl md:text-5xl font-light tracking-tighter">
              @{user?.username}
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-3 md:gap-6 pt-1">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail size={14} /> {user?.email}
              </div>
              {user?.telegramUsername && (
                <div className="flex items-center gap-2 text-blue-500 text-sm font-medium">
                  <Send size={14} /> @{user.telegramUsername}
                </div>
              )}
            </div>
          </div>

          {/* Stats block */}
          <div className="pt-4 md:pt-0 md:ml-auto border-t border-gray-50 md:border-none w-full md:w-auto">
            <p className="text-3xl md:text-4xl font-serif italic leading-none text-black">
              {myProducts.length}
            </p>
            <p className="text-[9px] md:text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-1">
              Items Listed
            </p>
          </div>
        </section>

        {/* --- MY LISTINGS GRID --- */}
        <section>
          <h3 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] mb-8 md:mb-12 text-gray-900">
            My Marketplace Entries
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 md:gap-x-10 gap-y-12 md:gap-y-16">
            {myProducts.map((product) => (
              <div key={product._id} className="group relative">
                <div className="relative aspect-[4/5] bg-[#f9f9f9] overflow-hidden mb-4 md:mb-6 shadow-sm transition-all duration-500">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700"
                      alt={product.title}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-10">
                      <Package size={40} />
                    </div>
                  )}

                  {/* Actions Overlay (Always visible on mobile, hover on desktop) */}
                  <div className="absolute top-3 right-3 md:top-4 md:right-4 flex flex-col gap-2 md:translate-x-12 md:opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                      onClick={() =>
                        router.push(`/dashboard/edit/${product._id}`)
                      }
                      className="bg-white/90 backdrop-blur-md p-2.5 rounded-full shadow-lg hover:bg-black hover:text-white transition-all active:scale-90"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-white/90 backdrop-blur-md p-2.5 rounded-full shadow-lg hover:bg-red-600 hover:text-white transition-all active:scale-90"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="absolute bottom-3 left-3 bg-black/80 px-3 py-1 text-[8px] font-black text-white uppercase tracking-widest">
                    {product.category}
                  </div>
                </div>

                <div className="space-y-1 px-1">
                  <h4 className="text-lg font-medium tracking-tight truncate">
                    {product.title}
                  </h4>
                  <p className="text-xl font-light text-gray-900">
                    ${product.price}.00
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {myProducts.length === 0 && (
            <div className="py-20 md:py-32 text-center border border-dashed border-gray-100 rounded-3xl flex flex-col items-center">
              <Package size={32} className="text-gray-100 mb-4" />
              <p className="text-gray-400 italic font-light">
                Your collection is currently empty.
              </p>
              <button
                onClick={() => router.push("/dashboard/create")}
                className="mt-6 text-[10px] font-black uppercase tracking-widest border-b-2 border-black pb-1 hover:text-blue-500 hover:border-blue-500 transition-colors"
              >
                Add Your First Piece
              </button>
            </div>
          )}
        </section>
      </main>

      <footer className="py-12 md:py-20 border-t border-gray-50 text-center">
        <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-gray-200">
          ASTU Marketplace Studio © 2026
        </p>
      </footer>
    </div>
  );
}
