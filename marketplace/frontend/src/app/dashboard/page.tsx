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
      <div className="h-screen flex items-center justify-center font-serif italic animate-pulse">
        ASTU Marketplace...
      </div>
    );

  return (
    <div className="h-screen flex flex-col bg-white text-black font-sans overflow-hidden">
      {/* --- 1. STATIC NAVBAR (Always at the top) --- */}
      <nav className="flex-none border-b border-gray-100 bg-white/90 backdrop-blur-md z-[100] h-16 md:h-24 flex items-center">
        <div className="max-w-[1440px] mx-auto w-full px-4 md:px-8 flex justify-between items-center relative">
          <div className="flex-1 flex items-center gap-4">
            <Menu size={20} className="cursor-pointer" />
            <div className="hidden lg:flex gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              <span className="text-black border-b border-black pb-1 cursor-pointer">
                Collection
              </span>
              <span
                onClick={() => router.push("/dashboard/events")}
                className="hover:text-black cursor-pointer transition-colors"
              >
                Announcement
              </span>
            </div>
          </div>

          <div className="flex-none text-center">
            <h1
              onClick={() => router.push("/dashboard")}
              className="text-sm md:text-3xl font-serif italic tracking-tighter cursor-pointer whitespace-nowrap px-4"
            >
              ASTU Marketplace
            </h1>
          </div>

          <div className="flex-1 flex justify-end items-center gap-2 md:gap-5">
            {user?.role === "admin" && (
              <button
                onClick={() => router.push("/dashboard/admin")}
                className="p-1.5 md:p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-all"
              >
                <ShieldAlert size={16} />
              </button>
            )}
            <PlusCircle
              onClick={() => router.push("/dashboard/create")}
              size={20}
              className="cursor-pointer hover:text-blue-600 transition-colors"
            />
            <User
              onClick={() => router.push("/dashboard/profile")}
              size={20}
              className="cursor-pointer hover:text-black transition-colors"
            />
            <div className="relative cursor-pointer">
              <ShoppingBag size={20} />
              <span className="absolute -top-1 -right-1 bg-black text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {filteredProducts.length}
              </span>
            </div>
            <LogOut
              onClick={() =>
                api.post("/auth/logout").then(() => router.push("/login"))
              }
              size={18}
              className="text-gray-300 hover:text-red-500 cursor-pointer"
            />
          </div>
        </div>
      </nav>

      {/* --- WRAPPER FOR SIDEBAR + CONTENT --- */}
      <div className="flex-1 flex overflow-hidden">
        {/* --- 2. STATIC SIDEBAR (Desktop Fixed, Mobile Drawer) --- */}
        <aside
          className={`
          fixed inset-0 z-[200] bg-white p-8 lg:static lg:block lg:w-80 lg:border-r lg:border-gray-50 lg:overflow-y-auto lg:p-10
          ${showMobileFilters ? "block" : "hidden"}
        `}
        >
          <div className="flex justify-between items-center mb-10 lg:hidden">
            <h3 className="font-black uppercase tracking-widest text-sm text-black">
              Filters
            </h3>
            <X
              onClick={() => setShowMobileFilters(false)}
              className="cursor-pointer"
            />
          </div>

          <div className="space-y-12">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-black mb-8 border-b border-black/5 pb-2">
                By Collection
              </h3>
              <div className="space-y-4">
                {[
                  {
                    label: "Academic",
                    items: [
                      "Books & Stationery",
                      "Lab Gear",
                      "Tech Accessories",
                    ],
                  },
                  {
                    label: "Fashion",
                    items: ["Clothing", "Footwear", "Bags & Accessories"],
                  },
                  {
                    label: "Living",
                    items: ["Furniture & Dorm", "Home Decor"],
                  },
                ].map((group) => (
                  <div key={group.label} className="space-y-3">
                    <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">
                      {group.label}
                    </p>
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
                          className={`text-[13px] tracking-tight ${selectedCategories.includes(cat) ? "text-black font-bold" : "text-gray-400 group-hover:text-black"}`}
                        >
                          {cat}
                        </span>
                      </label>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-gray-50">
              <h3 className="text-[10px] font-black uppercase tracking-widest mb-6">
                Price Range: ${maxPrice}
              </h3>
              <input
                type="range"
                min="0"
                max="2000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-black h-[1px] bg-gray-100 appearance-none cursor-pointer"
              />
            </div>

            {/* --- STATIC MINI FOOTER (Inside Sidebar) --- */}
            <div className="pt-20">
              <p className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-200 leading-relaxed">
                ASTU Marketplace Studio
                <br />© 2026 Collective
              </p>
            </div>
          </div>
        </aside>

        {/* --- 3. SCROLLABLE CONTENT AREA --- */}
        <main className="flex-1 overflow-y-auto px-4 md:px-12 py-8 md:py-16 scroll-smooth">
          {/* SEARCH BAR (In-scroll) */}
          <div className="max-w-xl mb-12 flex items-center gap-4 border-b border-gray-100 pb-2 focus-within:border-black transition-colors">
            <Search size={18} className="text-gray-300" />
            <input
              type="text"
              placeholder="Search the collection..."
              className="w-full bg-transparent outline-none text-lg md:text-2xl font-light placeholder:text-gray-100"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* HERO BANNER */}
          <section className="relative w-full h-[280px] md:h-[400px] rounded-[2rem] md:rounded-[3rem] overflow-hidden mb-20 bg-[#f3f3f3] border border-gray-50 flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 h-full">
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop"
                className="w-full h-full object-cover grayscale-[0.5]"
                alt=""
              />
            </div>
            <div className="p-10 md:p-16 flex-1">
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-400 mb-4 block">
                New Season
              </span>
              <h2 className="text-4xl md:text-6xl font-light tracking-tighter leading-[0.9] mb-6">
                Discover the <br />
                <span className="italic font-serif">Curated</span> Piece.
              </h2>
              <button
                onClick={() => router.push("/dashboard/create")}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border-b-2 border-black pb-1 hover:gap-4 transition-all"
              >
                Explore Collections <ArrowRight size={14} />
              </button>
            </div>
          </section>

          {/* PRODUCT GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-20">
            {filteredProducts.map((product) => (
              <div key={product._id} className="group relative">
                <div className="relative aspect-[3/4] bg-[#fcfcfc] overflow-hidden mb-6 shadow-sm">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center opacity-10">
                      <Package size={40} />
                    </div>
                  )}
                  {/* Category Tag */}
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 text-[8px] font-black uppercase tracking-widest text-black">
                    {product.category}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium tracking-tight text-gray-950 line-clamp-1 uppercase">
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
                  <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                    <span className="text-xl font-light">
                      ${product.price}.00
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleContactSeller(product)}
                        className="text-[9px] font-black uppercase tracking-widest border border-gray-200 px-4 py-2 rounded-full hover:bg-black hover:text-white transition-all"
                      >
                        Inquire
                      </button>
                      {product.owner?.telegramUsername && (
                        <button
                          onClick={() =>
                            window.open(
                              `https://t.me/${product.owner.telegramUsername.replace("@", "")}`,
                            )
                          }
                          className="bg-[#229ED9] text-white p-2 rounded-full hover:bg-black transition-all"
                        >
                          <Send size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* EMPTY STATE */}
          {filteredProducts.length === 0 && (
            <div className="py-40 text-center border border-dashed border-gray-100 rounded-[3rem]">
              <p className="text-gray-300 font-serif italic text-xl uppercase tracking-widest">
                Quiet Collection
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategories([]);
                  setMaxPrice(2000);
                }}
                className="mt-4 text-[10px] font-black underline underline-offset-4 tracking-widest"
              >
                Clear Selection
              </button>
            </div>
          )}

          {/* Persistent Footer Spacer */}
          <div className="h-20"></div>
        </main>
      </div>

      {/* --- 4. STATIC FOOTER (Thin persistent bar at the very bottom) --- */}
      <footer className="flex-none h-12 bg-white border-t border-gray-50 flex items-center justify-center px-8 z-[100]">
        <p className="text-[8px] font-black uppercase tracking-[0.6em] text-gray-300">
          ASTU Campus Marketplace • Edition 2026 • Curating the Student
          Experience
        </p>
      </footer>
    </div>
  );
}
