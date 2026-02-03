"use client";
import { useEffect, useState } from "react";
import api from "../../lib/api";
import {
  LogOut,
  PlusCircle,
  ShoppingBag,
  Heart,
  Search,
  Menu,
  Trash2,
  Package,
  Pencil,
  ArrowRight,
  Sparkles,
  Mail,
  Filter,
  X,
  Send,
  User,
  ShieldAlert,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(2000);

  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        const userRes = await api.get("/auth/profile");
        setUser(userRes.data);
        const productRes = await api.get("/products");
        setProducts(productRes.data);
      } catch (err) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [router]);

  const handleContactSeller = (product: any) => {
    const email = product.owner?.email;
    if (!email) return alert("Seller email not found.");
    const subject = encodeURIComponent(`Inquiry: ${product.title}`);
    const body = encodeURIComponent(
      `Hi ${product.owner?.username}, I'm interested in your ${product.title}.`,
    );
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, "_self");
  };

  const handleDelete = async (id: string) => {
    if (confirm("Remove this piece from the collection?")) {
      try {
        await api.delete(`/products/${id}`);
        setProducts(products.filter((p) => p._id !== id));
      } catch (err) {
        alert("Action denied.");
      }
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);
    return matchesSearch && matchesCategory && product.price <= maxPrice;
  });

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center font-serif italic animate-pulse text-black">
        ASTU Marketplace...
      </div>
    );

  return (
    <div className="min-h-screen bg-white text-black font-sans overflow-x-hidden">
      {/* --- CORRECTED NAV BAR --- */}
      <nav className="border-b border-gray-100 bg-white/90 backdrop-blur-md sticky top-0 z-[100] h-16 md:h-24 flex items-center">
        <div className="max-w-[1440px] mx-auto w-full px-4 md:px-8 flex justify-between items-center relative">
          {/* Left: Nav Links */}
          <div className="flex-1 flex items-center gap-3 md:gap-8">
            <Menu size={20} className="cursor-pointer shrink-0" />
            <div className="hidden lg:flex gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              <span
                onClick={() => router.push("/dashboard")}
                className="text-black border-b border-black pb-1 cursor-pointer"
              >
                Collection
              </span>
              {/* FIXED BULLETIN LINK */}
              <span
                onClick={() => router.push("/dashboard/events")}
                className="hover:text-black cursor-pointer transition-colors"
              >
                Bulletin
              </span>
            </div>
          </div>

          {/* Center: Logo */}
          <div className="flex-none flex justify-center">
            <h1
              onClick={() => router.push("/dashboard")}
              className="text-sm md:text-3xl font-serif italic tracking-tighter cursor-pointer whitespace-nowrap px-2"
            >
              ASTU Marketplace
            </h1>
          </div>

          {/* Right: Actions */}
          <div className="flex-1 flex justify-end items-center gap-3 md:gap-5">
            {/* Admin Toggle */}
            {user?.role === "admin" && (
              <button
                onClick={() => router.push("/dashboard/admin")}
                className="p-1.5 md:p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-all shadow-sm"
              >
                <ShieldAlert size={16} />
              </button>
            )}

            <PlusCircle
              onClick={() => router.push("/dashboard/create")}
              size={20}
              className="cursor-pointer hover:text-blue-600 transition-colors shrink-0"
            />

            <User
              onClick={() => router.push("/dashboard/profile")}
              size={20}
              className="cursor-pointer hover:text-black transition-colors shrink-0"
            />

            <div className="relative cursor-pointer shrink-0">
              <ShoppingBag size={20} />
              <span className="absolute -top-1 -right-1 bg-black text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {filteredProducts.length}
              </span>
            </div>

            {/* FIXED LOGOUT BUTTON (Visible on all screens) */}
            <LogOut
              onClick={() =>
                api.post("/auth/logout").then(() => router.push("/login"))
              }
              size={18}
              className="text-gray-300 hover:text-red-500 cursor-pointer transition-colors"
            />
          </div>
        </div>
      </nav>

      {/* --- MOBILE FILTER --- */}
      <div className="lg:hidden p-4 border-b border-gray-50 sticky top-16 bg-white z-[90]">
        <button
          onClick={() => setShowMobileFilters(true)}
          className="w-full flex items-center justify-center gap-2 py-3 border border-black text-[10px] font-black uppercase tracking-widest active:bg-black active:text-white transition-colors"
        >
          <Filter size={14} /> Filter Selection
        </button>
      </div>

      <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 md:py-12 flex flex-col lg:flex-row gap-12">
        {/* --- SIDEBAR --- */}
        <aside
          className={`fixed inset-0 z-[200] bg-white p-8 lg:relative lg:inset-auto lg:z-0 lg:p-0 lg:w-72 lg:block ${showMobileFilters ? "block" : "hidden"}`}
        >
          <div className="flex justify-between items-center mb-8 lg:hidden">
            <h3 className="font-black uppercase tracking-widest text-sm">
              Filters
            </h3>
            <X
              onClick={() => setShowMobileFilters(false)}
              className="cursor-pointer"
            />
          </div>
          <h3 className="hidden lg:block text-[11px] font-black uppercase tracking-[0.3em] mb-8 border-b border-black pb-2">
            Category
          </h3>
          <div className="space-y-8 max-h-[70vh] lg:max-h-none overflow-y-auto pr-2">
            {[
              {
                label: "Academic",
                items: ["Books & Stationery", "Lab Gear", "Tech Accessories"],
              },
              {
                label: "Fashion",
                items: ["Clothing", "Footwear", "Bags & Accessories"],
              },
              { label: "Living", items: ["Furniture & Dorm", "Home Decor"] },
              {
                label: "Lifestyle",
                items: ["Sports & Outdoors", "Beauty & Care"],
              },
            ].map((group) => (
              <div key={group.label}>
                <h4 className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-3">
                  {group.label}
                </h4>
                <div className="space-y-3">
                  {group.items.map((cat) => (
                    <label
                      key={cat}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        className="appearance-none w-4 h-4 border border-gray-200 checked:bg-black checked:border-black transition-all cursor-pointer"
                        onChange={() => toggleCategory(cat)}
                      />
                      <span
                        className={`text-[13px] tracking-tight ${selectedCategories.includes(cat) ? "text-black font-bold" : "text-gray-500"}`}
                      >
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <div className="pt-8 border-t border-gray-100">
              <h3 className="text-[11px] font-black uppercase tracking-widest mb-6 text-black">
                Max Price: ${maxPrice}
              </h3>
              <input
                type="range"
                min="0"
                max="2000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-black h-[1px] bg-gray-200 appearance-none cursor-pointer"
              />
            </div>
          </div>
          <button
            onClick={() => setShowMobileFilters(false)}
            className="lg:hidden w-full mt-10 bg-black text-white py-4 font-black uppercase tracking-widest text-[10px]"
          >
            Show Results
          </button>
        </aside>

        {/* --- GRID --- */}
        <div className="flex-1">
          <section className="relative w-full h-[240px] md:h-[380px] rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden mb-12 md:mb-20 bg-[#f3f3f3] flex flex-col md:flex-row items-center border border-gray-50">
            <div className="w-full md:w-3/5 h-1/2 md:h-full">
              <img
                src="https://cdn.prod.website-files.com/63d926b37ec0d886c2d5d538/66bb66990191f0f7cbd5b497_6696449889aff652530258af_online-marketplace-min--2---1-.jpeg"
                className="w-full h-full object-cover"
                alt="Hero"
              />
            </div>
            <div className="w-full md:w-2/5 p-6 md:p-12 lg:p-16 text-center md:text-left">
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2 md:mb-4 block">
                - 2026 Collection
              </span>
              <h2 className="text-xl md:text-4xl lg:text-5xl font-light tracking-tighter mb-4 md:mb-8 text-black">
                The Best of{" "}
                <span className="italic font-serif underline decoration-1 underline-offset-4">
                  ASTU
                </span>
              </h2>
              <button
                onClick={() => router.push("/dashboard/create")}
                className="group inline-flex items-center gap-2 text-[9px] md:text-[11px] font-black uppercase tracking-widest border-b-2 border-black pb-1 hover:gap-4 transition-all"
              >
                Sell Item <ArrowRight size={14} />
              </button>
            </div>
          </section>

          <header className="mb-8 md:mb-16 border-b border-gray-50 pb-6 md:pb-8 flex justify-between items-end">
            <div>
              <p className="text-[9px] md:text-[11px] text-gray-400 font-black uppercase tracking-[0.3em] mb-2">
                Home • Boutique
              </p>
              <h2 className="text-3xl md:text-6xl font-light tracking-tighter text-black">
                Collection
              </h2>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-2xl md:text-4xl font-serif italic leading-none">
                {filteredProducts.length}
              </p>
              <p className="text-[9px] font-bold text-gray-200 uppercase tracking-widest">
                Pieces
              </p>
            </div>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 md:gap-x-12 gap-y-12 md:gap-y-24">
            {filteredProducts.map((product) => (
              <div key={product._id} className="group relative">
                <div className="relative aspect-[3/4] bg-[#fcfcfc] overflow-hidden mb-6 shadow-sm group-hover:shadow-xl transition-all duration-500">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center opacity-20 bg-gray-50">
                      <Package size={40} />
                      <span className="text-[9px] font-bold mt-2">
                        ASTU STUDIO
                      </span>
                    </div>
                  )}

                  {(user?.role === "admin" ||
                    user?._id === product.owner?._id) && (
                    <div className="absolute top-4 right-4 flex flex-col gap-2 md:translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
                      <button
                        onClick={() =>
                          router.push(`/dashboard/edit/${product._id}`)
                        }
                        className="bg-white/90 p-2.5 rounded-full shadow hover:bg-black hover:text-white transition-all"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="bg-white/90 p-2.5 rounded-full shadow hover:bg-red-600 hover:text-white transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 bg-black/80 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1.5">
                    {product.category}
                  </div>
                </div>

                <div className="px-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium tracking-tight text-gray-900 line-clamp-1">
                      {product.title}
                    </h3>
                    <Heart
                      size={18}
                      onClick={async () => {
                        const { data } = await api.post("/auth/bookmark", {
                          productId: product._id,
                        });
                        setUser({ ...user, bookmarks: data.bookmarks });
                      }}
                      className={`cursor-pointer transition-all ${user?.bookmarks?.map((b: any) => b._id || b).includes(product._id) ? "fill-red-500 text-red-500" : "text-gray-200"}`}
                    />
                  </div>
                  <p className="text-xs text-gray-400 italic line-clamp-1">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                    <span className="text-xl md:text-2xl font-light tracking-tighter text-black">
                      ${product.price}.00
                    </span>
                    <div className="flex flex-col items-end gap-1.5">
                      <button
                        onClick={() => handleContactSeller(product)}
                        className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest border border-gray-200 px-4 py-2 rounded-full hover:bg-black hover:text-white transition-all"
                      >
                        <Mail size={10} /> Email
                      </button>
                      {product.owner?.telegramUsername && (
                        <button
                          onClick={() =>
                            window.open(
                              `https://t.me/${product.owner.telegramUsername.replace("@", "")}`,
                              "_blank",
                            )
                          }
                          className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest bg-[#229ED9] text-white px-4 py-2 rounded-full hover:bg-[#1c86b9] transition-all"
                        >
                          <Send size={10} /> Telegram
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="py-24 md:py-48 text-center border-2 border-dashed border-gray-50 rounded-[2rem] flex flex-col items-center">
              <Sparkles size={30} className="text-gray-100 mb-4" />
              <p className="text-gray-400 font-serif italic text-lg text-black">
                The collection is currently empty.
              </p>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-gray-100 py-12 md:py-20 mt-12 text-center bg-white">
        <h2 className="text-3xl md:text-6xl font-serif italic tracking-tighter text-gray-100 mb-4 select-none">
          ASTU Marketplace
        </h2>
        <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.5em] text-gray-300">
          © 2026 Campus Collective Marketplace
        </p>
      </footer>
    </div>
  );
}
