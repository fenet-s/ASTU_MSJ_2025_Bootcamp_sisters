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
      await api.delete(`/products/${id}`);
      setMyProducts(myProducts.filter((p) => p._id !== id));
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center font-serif italic">
        wiñk profile...
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="h-20 border-b border-gray-50 flex items-center px-8 justify-between sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black"
        >
          <ArrowLeft size={16} /> back to collection
        </button>
        <h1 className="text-2xl font-serif italic tracking-tighter absolute left-1/2 -translate-x-1/2">
          wiñk
        </h1>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* User Card */}
        <section className="mb-20 flex flex-col md:flex-row items-center gap-12 border-b border-gray-50 pb-16">
          <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 border border-gray-100">
            <User size={60} strokeWidth={1} />
          </div>
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-5xl font-light tracking-tighter">
              @{user?.username}
            </h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-2">
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
          <div className="md:ml-auto text-center">
            <p className="text-4xl font-serif italic leading-none">
              {myProducts.length}
            </p>
            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-1">
              Items Listed
            </p>
          </div>
        </section>

        {/* Listings Grid */}
        <section>
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] mb-12">
            My Marketplace Entries
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
            {myProducts.map((product) => (
              <div key={product._id} className="group">
                <div className="relative aspect-[4/5] bg-[#f9f9f9] overflow-hidden mb-6">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700"
                      alt=""
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-10">
                      <Package size={40} />
                    </div>
                  )}

                  <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform">
                    <button
                      onClick={() =>
                        router.push(`/dashboard/edit/${product._id}`)
                      }
                      className="bg-white p-2.5 rounded-full shadow-lg hover:bg-black hover:text-white transition-all"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-white p-2.5 rounded-full shadow-lg hover:bg-red-600 hover:text-white transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-300">
                    {product.category}
                  </span>
                  <h4 className="text-lg font-medium tracking-tight">
                    {product.title}
                  </h4>
                  <p className="text-xl font-light text-gray-900">
                    ${product.price}.00
                  </p>
                </div>
              </div>
            ))}
          </div>

          {myProducts.length === 0 && (
            <div className="py-20 text-center border border-dashed border-gray-100 rounded-3xl">
              <p className="text-gray-400 italic">
                You haven't added any pieces to the collection yet.
              </p>
              <button
                onClick={() => router.push("/dashboard/create")}
                className="mt-4 text-[10px] font-bold uppercase tracking-widest border-b border-black pb-1"
              >
                Start Selling
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
