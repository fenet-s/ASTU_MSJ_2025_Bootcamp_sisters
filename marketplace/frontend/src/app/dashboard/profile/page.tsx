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
  Heart,
  Sparkles,
  ExternalLink,
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
    if (confirm("Remove this piece from the collection?")) {
      try {
        await api.delete(`/products/${id}`);
        setMyProducts(myProducts.filter((p) => p._id !== id));
      } catch (err) {
        alert("Action denied.");
      }
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center font-serif italic text-black animate-pulse uppercase tracking-[0.3em] text-xs">
        ASTU Profile...
      </div>
    );

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* --- PREMIUM HEADER --- */}
      <nav className="h-16 md:h-24 border-b border-gray-100 flex items-center px-6 md:px-12 justify-between sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <button
          onClick={() => router.push("/dashboard")}
          className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-all"
        >
          <ArrowLeft
            size={14}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="hidden sm:inline">Return to Collection</span>
          <span className="sm:hidden">Back</span>
        </button>
        <h1 className="text-xl md:text-3xl font-serif italic tracking-tighter absolute left-1/2 -translate-x-1/2">
          ASTU Marketplace
        </h1>
        <div className="w-10"></div>
      </nav>

      <main className="max-w-[1440px] mx-auto px-6 md:px-12 py-12 md:py-24">
        {/* --- USER IDENTITY SECTION --- */}
        <section className="mb-20 md:mb-32 flex flex-col md:flex-row items-center md:items-end gap-10 md:gap-16 border-b border-gray-50 pb-20">
          {/* Avatar Container */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-tr from-gray-100 to-gray-50 rounded-full blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-28 h-28 md:w-44 md:h-44 bg-white rounded-full flex items-center justify-center text-gray-100 border border-gray-100 overflow-hidden">
              <User className="w-16 h-16 md:w-24 md:h-24" strokeWidth={0.5} />
            </div>
          </div>

          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">
                Member Artist
              </span>
              <h2 className="text-5xl md:text-8xl font-light tracking-[ -0.05em] text-black leading-none">
                @{user?.username}
              </h2>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 pt-4">
              <div className="flex items-center gap-2 text-gray-400 text-xs font-medium tracking-tight border-r border-gray-100 pr-8 hidden md:flex">
                <Mail size={14} strokeWidth={1.5} /> {user?.email}
              </div>
              {user?.telegramUsername && (
                <button
                  onClick={() =>
                    window.open(
                      `https://t.me/${user.telegramUsername.replace("@", "")}`,
                    )
                  }
                  className="flex items-center gap-2 text-black text-xs font-black uppercase tracking-widest hover:text-blue-600 transition-colors"
                >
                  <Send size={14} /> Contact via Telegram
                </button>
              )}
            </div>
          </div>

          {/* Stats block */}
          <div className="text-center md:text-right">
            <p className="text-5xl md:text-7xl font-serif italic leading-none tracking-tighter text-black">
              {myProducts.length}
            </p>
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mt-2">
              Market Entries
            </p>
          </div>
        </section>

        {/* --- MY ENTRIES GRID --- */}
        <section className="mb-40">
          <header className="mb-16 flex justify-between items-end">
            <div>
              <h3 className="text-2xl md:text-4xl font-light tracking-tight text-black">
                My Collection
              </h3>
              <p className="text-gray-400 text-xs mt-1 italic">
                Personal listings active in the marketplace.
              </p>
            </div>
            <button
              onClick={() => router.push("/dashboard/create")}
              className="text-[10px] font-black uppercase tracking-widest border-b-2 border-black pb-1 hover:text-blue-600 hover:border-blue-600 transition-all"
            >
              Add New Piece
            </button>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 md:gap-x-12 gap-y-16 md:gap-y-24">
            {myProducts.map((product) => (
              <div key={product._id} className="group relative">
                <div className="relative aspect-[3/4] bg-[#f8f8f8] overflow-hidden mb-6 shadow-sm group-hover:shadow-2xl transition-all duration-1000">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out"
                      alt={product.title}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-10 bg-gray-100">
                      <Package size={60} strokeWidth={0.5} />
                    </div>
                  )}

                  {/* Actions Drawer */}
                  <div className="absolute top-6 right-6 flex flex-col gap-3 translate-x-16 md:opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 z-10">
                    <button
                      onClick={() =>
                        router.push(`/dashboard/edit/${product._id}`)
                      }
                      className="bg-white/95 backdrop-blur-md p-3 rounded-full shadow-xl hover:bg-black hover:text-white transition-all active:scale-90"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-white/95 backdrop-blur-md p-3 rounded-full shadow-xl hover:bg-red-600 hover:text-white transition-all active:scale-90"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="absolute bottom-6 left-6 bg-black text-white px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] shadow-2xl">
                    {product.category}
                  </div>
                </div>

                <div className="space-y-2 px-1">
                  <h4 className="text-xl font-medium tracking-tight text-gray-900 line-clamp-1 group-hover:underline decoration-1 underline-offset-4">
                    {product.title}
                  </h4>
                  <p className="text-2xl font-light text-black">
                    ${product.price}.00
                  </p>
                </div>
              </div>
            ))}
          </div>

          {myProducts.length === 0 && (
            <div className="py-32 text-center border-2 border-dashed border-gray-50 rounded-[3rem] bg-gray-50/30">
              <Sparkles size={32} className="mx-auto mb-4 text-gray-200" />
              <p className="text-gray-400 italic font-light text-lg">
                Your collection is currently empty.
              </p>
            </div>
          )}
        </section>

        {/* --- WISHLIST SECTION --- */}
        <section className="pt-32 border-t border-gray-100">
          <header className="mb-16">
            <h3 className="text-2xl md:text-4xl font-light tracking-tight text-blue-600 font-serif italic">
              Saved for Later
            </h3>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] mt-2">
              Personal Wishlist
            </p>
          </header>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 md:gap-x-10 gap-y-12 md:gap-y-20">
            {user?.bookmarks?.map((product: any) => (
              <div key={product._id} className="group cursor-pointer">
                <div className="relative aspect-[3/4] bg-[#f9f9f9] overflow-hidden mb-6 shadow-sm opacity-80 hover:opacity-100 transition-all duration-700">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                      alt={product.title}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-10">
                      <Package size={32} />
                    </div>
                  )}
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="absolute top-3 right-3 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ExternalLink size={12} />
                  </button>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs md:text-sm font-medium text-gray-900 truncate tracking-tight">
                    {product.title}
                  </h4>
                  <p className="text-lg font-light text-black">
                    ${product.price}.00
                  </p>
                </div>
              </div>
            ))}
          </div>

          {(!user?.bookmarks || user.bookmarks.length === 0) && (
            <div className="py-20 text-center rounded-[3rem] bg-slate-50/50">
              <Heart size={24} className="mx-auto mb-4 text-gray-200" />
              <p className="text-gray-400 italic text-sm">
                Your wishlist awaits its first piece.
              </p>
            </div>
          )}
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="py-32 border-t border-gray-50 text-center">
        <h2 className="text-6xl md:text-9xl font-serif italic text-gray-50 mb-10 select-none tracking-tighter">
          astu
        </h2>
        <p className="text-[10px] font-black uppercase tracking-[0.6em] text-gray-200">
          ASTU Marketplace Collective • Curated for Excellence • © 2026
        </p>
      </footer>
    </div>
  );
}
