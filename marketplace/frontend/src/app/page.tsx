"use client";
import { useEffect, useState } from "react";
import api from "../lib/api";
import {
  LogOut,
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
  ChevronRight,
} from "lucide-react";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
      setIsMenuOpen(false);
      router.push("/login");
    }
  };

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
    if (confirm("Remove this item from the collection?")) {
      try {
        await api.delete(`/products/${id}`);
        setProducts(products.filter((p) => p._id !== id));
      } catch (err) {
        alert("Denied.");
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
      <div className="h-screen flex items-center justify-center font-serif italic animate-pulse text-black uppercase tracking-widest text-xs">
        ASTU Marketplace is loading...
      </div>
    );

  return (
    <div className="h-screen flex flex-col bg-white text-black font-sans overflow-hidden">
      {/* --- 1. STATIC NAVBAR --- */}
      <nav className="flex-none border-b border-gray-100 bg-white/90 backdrop-blur-md z-[300] h-16 md:h-24 flex items-center">
        <div className="max-w-[1440px] mx-auto w-full px-4 md:px-8 flex justify-between items-center relative">
          {/* Left: Mobile Toggle / Desktop Links */}
          <div className="flex-1 flex items-center gap-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-50 rounded-full transition-colors"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="hidden lg:flex gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              <span
                onClick={() => router.push("/dashboard")}
                className="text-black border-b border-black pb-1 cursor-pointer"
              >
                Collection
              </span>
              <span
                onClick={() => router.push("/dashboard/events")}
                className="hover:text-black cursor-pointer transition-colors"
              >
                Bulletin
              </span>
            </div>
          </div>

          {/* Center: Brand */}
          <div className="flex-none text-center">
            <h1
              onClick={() => router.push("/dashboard")}
              className="text-sm md:text-3xl font-serif italic tracking-tighter cursor-pointer whitespace-nowrap"
            >
              ASTU Marketplace
            </h1>
          </div>

          {/* Right: Actions */}
          <div className="flex-1 flex justify-end items-center gap-3 md:gap-5">
            <div className="hidden lg:flex items-center gap-5">
              {user?.role === "admin" && (
                <button
                  onClick={() => router.push("/dashboard/admin")}
                  className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-all"
                >
                  <ShieldAlert size={18} />
                </button>
              )}
              <PlusCircle
                onClick={() => router.push("/dashboard/create")}
                size={22}
                className="cursor-pointer hover:text-blue-600 transition-colors"
              />
              <User
                onClick={() => router.push("/dashboard/profile")}
                size={22}
                className="cursor-pointer hover:text-black transition-colors"
              />
              <LogOut
                onClick={handleLogout}
                size={20}
                className="text-gray-300 hover:text-red-500 cursor-pointer"
              />
            </div>

            {/* Total Results Bag */}
            <div className="relative cursor-pointer">
              <ShoppingBag size={22} />
              <span className="absolute -top-1 -right-1 bg-black text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {filteredProducts.length}
              </span>
            </div>
          </div>
        </div>

        {/* --- MOBILE DROPDOWN MENU --- */}
        <div
          className={`absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-2xl transition-all duration-300 transform lg:hidden ${isMenuOpen ? "translate-y-0 opacity-100 visible" : "-translate-y-4 opacity-0 invisible"}`}
        >
          <div className="p-6 space-y-4 flex flex-col">
            <button
              onClick={() => {
                router.push("/dashboard/profile");
                setIsMenuOpen(false);
              }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl font-bold text-sm text-black"
            >
              <div className="flex items-center gap-3">
                <User size={18} /> My Profile
              </div>
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => {
                router.push("/dashboard/events");
                setIsMenuOpen(false);
              }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl font-bold text-sm text-black"
            >
              <div className="flex items-center gap-3">
                <Sparkles size={18} /> Campus Bulletin
              </div>
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => {
                router.push("/dashboard/create");
                setIsMenuOpen(false);
              }}
              className="flex items-center justify-between p-4 bg-blue-50 text-blue-600 rounded-2xl font-bold text-sm"
            >
              <div className="flex items-center gap-3">
                <PlusCircle size={18} /> Sell Item
              </div>
              <ArrowRight size={16} />
            </button>
            {user?.role === "admin" && (
              <button
                onClick={() => {
                  router.push("/dashboard/admin");
                  setIsMenuOpen(false);
                }}
                className="flex items-center justify-between p-4 bg-red-50 text-red-600 rounded-2xl font-bold text-sm"
              >
                <div className="flex items-center gap-3">
                  <ShieldAlert size={18} /> Admin Panel
                </div>
                <ChevronRight size={16} />
              </button>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 p-4 text-gray-400 font-bold text-sm"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </nav>

      {/* --- CONTENT SHELL --- */}
      <div className="flex-1 flex overflow-hidden">
        {/* --- 2. STATIC SIDEBAR --- */}
        <aside
          className={`fixed inset-0 z-[400] bg-white p-8 lg:static lg:block lg:w-80 lg:border-r lg:border-gray-50 lg:overflow-y-auto lg:p-10 ${showMobileFilters ? "block" : "hidden"}`}
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
                ASTU Collections
              </h3>
              <div className="space-y-8">
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
                        className="flex items-center gap-3 cursor-pointer group text-black"
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
            Update results
          </button>
        </aside>

        {/* --- 3. MAIN SCROLLABLE AREA --- */}
        <main className="flex-1 overflow-y-auto px-4 md:px-12 py-8 md:py-16 scroll-smooth pb-24">
          {/* Mobile UI Trigger */}
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden w-full mb-8 flex items-center justify-center gap-2 py-3 border border-gray-100 text-[10px] font-black uppercase tracking-widest shadow-sm text-black"
          >
            <Filter size={14} /> Filter Categories
          </button>

          {/* New Hero Section with requested Image */}
          <section className="relative w-full h-[300px] md:h-[450px] rounded-[2rem] md:rounded-[3rem] overflow-hidden mb-16 shadow-2xl">
            <img
              src="https://arc-anglerfish-washpost-prod-washpost.s3.amazonaws.com/public/5S2LXVVXVMI6TM5UFO3J5DCOHE.jpg"
              className="w-full h-full object-cover grayscale-[0.3] hover:grayscale-0 transition-all duration-1000"
              alt="ASTU Hero"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center p-12 md:p-20 text-white">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 opacity-70">
                Official Marketplace
              </span>
              <h2 className="text-4xl md:text-7xl font-light tracking-tighter leading-none mb-6">
                Discover the <br />
                <span className="italic font-serif">Campus</span> Standard.
              </h2>
              <button
                onClick={() => router.push("/dashboard/create")}
                className="w-fit flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border-b-2 border-white pb-1 hover:gap-4 transition-all"
              >
                Add to Collection <ArrowRight size={14} />
              </button>
            </div>
          </section>

          {/* Search bar inside scroll */}
          <div className="max-w-xl mb-16 flex items-center gap-4 border-b border-gray-100 pb-3 focus-within:border-black transition-colors">
            <Search size={22} className="text-gray-300" />
            <input
              type="text"
              placeholder="Search the ASTU collection..."
              className="w-full bg-transparent outline-none text-xl md:text-3xl font-light text-black placeholder:text-gray-100"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-12 gap-y-24">
            {filteredProducts.map((product) => (
              <div key={product._id} className="group relative">
                <div className="relative aspect-[3/4] bg-[#fcfcfc] overflow-hidden mb-6 shadow-sm">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      alt=""
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center opacity-20 bg-gray-100">
                      <Package size={40} />
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
                <div className="space-y-2 text-black">
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
                          <Send size={10} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* --- 4. STATIC FOOTER --- */}
      <footer className="flex-none h-12 bg-white border-t border-gray-50 flex items-center justify-center px-8 z-[100]">
        <p className="text-[8px] font-black uppercase tracking-[0.6em] text-gray-400">
          ASTU Marketplace Studio • 2026 • Curated Community
        </p>
      </footer>
    </div>
  );
}
