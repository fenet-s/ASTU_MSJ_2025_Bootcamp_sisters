"use client";
import { useEffect, useState } from "react";
import api from "../../lib/api";
import {
  LogOut,
  PlusCircle,
  ShoppingBag,
  Heart,
  Search,
  Trash2,
  Package,
  Pencil,
  ArrowRight,
  Sparkles,
  Mail,
  Filter,
  X,
  Send,
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
    const sellerEmail = product.owner?.email;
    const sellerName = product.owner?.username;

    // This will pop up on your screen to tell us if the data is there
    if (!sellerEmail) {
      alert(
        `Error: The seller "@${sellerName}" does not have an email address attached to this product in the database.`,
      );
      console.log("Product Data for debugging:", product);
      return;
    }

    const subject = encodeURIComponent(`Inquiry: ${product.title}`);
    const body = encodeURIComponent(
      `Hi ${sellerName}, I'm interested in your ${product.title}.`,
    );

    window.open(
      `mailto:${sellerEmail}?subject=${subject}&body=${body}`,
      "_self",
    );
  };

  const handleDelete = async (id: string) => {
    if (confirm("Remove this piece?")) {
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
      <div className="h-screen flex items-center justify-center font-serif italic animate-pulse">
        ASTU Marketplace...
      </div>
    );

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* --- TOP NAVIGATION --- */}
      <nav className="border-b border-gray-100 bg-white/90 backdrop-blur-md sticky top-0 z-[100]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-16 md:h-24 flex justify-between items-center">
          <div className="flex items-center gap-4 md:gap-10">
            <div className="hidden lg:flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              <span className="text-black border-b border-black pb-1">
                Collections
              </span>
              <span className="hover:text-black">Blogs</span>
            </div>
          </div>

          <h1
            onClick={() => router.push("/dashboard")}
            className="text-xl md:text-3xl font-serif italic tracking-tighter cursor-pointer absolute left-1/2 -translate-x-1/2"
          >
            ASTU Marketplace
          </h1>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden md:flex items-center bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
              <Search size={14} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none text-xs ml-2 w-24 lg:w-40 focus:ring-0"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <PlusCircle
              onClick={() => router.push("/dashboard/create")}
              size={20}
              className="cursor-pointer hover:text-blue-600"
            />
            <div className="relative cursor-pointer">
              <ShoppingBag size={20} />
              <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
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

      {/* --- MOBILE FILTER BUTTON (Only visible on Mobile) --- */}
      <div className="lg:hidden p-4 border-b border-gray-50 sticky top-16 bg-white z-[90]">
        <button
          onClick={() => setShowMobileFilters(true)}
          className="w-full flex items-center justify-center gap-2 py-3 border border-black text-[10px] font-black uppercase tracking-widest"
        >
          <Filter size={14} /> Filter Collection
        </button>
      </div>

      <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 md:py-12 flex flex-col lg:flex-row gap-12">
        {/* --- SIDEBAR (Overlay on Mobile, Sidebar on Desktop) --- */}
        <aside
          className={`
          fixed inset-0 z-[200] bg-white p-8 lg:relative lg:inset-auto lg:z-0 lg:p-0 lg:w-72 lg:block
          ${showMobileFilters ? "block" : "hidden"}
        `}
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

          <h3 className="hidden lg:block text-[11px] font-black uppercase tracking-[0.3em] mb-8 border-b pb-2">
            Filter Selection
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
              {
                label: "Living",
                items: ["Furniture & Dorm", "Kitchen & Dining"],
              },
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
                        className="appearance-none w-4 h-4 border border-gray-200 checked:bg-black checked:border-black transition-all"
                        onChange={() => toggleCategory(cat)}
                      />
                      <span
                        className={`text-sm tracking-tight ${selectedCategories.includes(cat) ? "text-black font-bold" : "text-gray-500"}`}
                      >
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="pt-6 border-t border-gray-50">
              <h3 className="text-[10px] font-black uppercase tracking-widest mb-4">
                Max Price: ${maxPrice}
              </h3>
              <input
                type="range"
                min="0"
                max="2000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-black h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Apply Button for Mobile */}
          <button
            onClick={() => setShowMobileFilters(false)}
            className="lg:hidden w-full mt-10 bg-black text-white py-4 font-black uppercase tracking-widest text-[10px]"
          >
            Show {filteredProducts.length} Results
          </button>
        </aside>

        <div className="flex-1">
          {/* --- HERO BANNER (Responsive height/text) --- */}
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
              <h2 className="text-xl md:text-4xl lg:text-5xl font-light tracking-tighter mb-4 md:mb-8 leading-tight">
                The Best of <span className="italic font-serif">ASTU</span>
              </h2>
              <button
                onClick={() => router.push("/dashboard/create")}
                className="inline-flex items-center gap-2 text-[9px] md:text-[11px] font-black uppercase tracking-widest border-b-2 border-black pb-1"
              >
                Sell Item <ArrowRight size={14} />
              </button>
            </div>
          </section>

          <header className="mb-8 md:mb-16 pb-6 md:pb-8 border-b border-gray-50 flex justify-between items-end">
            <div>
              <p className="text-[9px] md:text-[11px] text-gray-400 font-black uppercase tracking-[0.3em] mb-2">
                Home • Boutique
              </p>
              <h2 className="text-3xl md:text-6xl font-light tracking-tighter">
                Marketplace
              </h2>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-2xl md:text-4xl font-serif italic leading-none">
                {filteredProducts.length}
              </p>
              <p className="text-[8px] md:text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-1">
                Items
              </p>
            </div>
          </header>

          {/* --- PRODUCT GRID (1 col mobile, 2 col tablet, 3 col desktop) --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 md:gap-x-12 gap-y-12 md:gap-y-24">
            {filteredProducts.map((product) => (
              <div key={product._id} className="group relative">
                <div className="relative aspect-[3/4] bg-[#fcfcfc] overflow-hidden mb-4 md:mb-8 shadow-sm">
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
                    <h3 className="text-lg md:text-xl font-medium tracking-tight text-gray-900 leading-tight flex-1 line-clamp-1">
                      {product.title}
                    </h3>
                    <Heart
                      size={16}
                      className="text-gray-200 hover:text-red-500 hover:fill-red-500 cursor-pointer ml-2"
                    />
                  </div>
                  <p className="text-xs text-gray-400 italic line-clamp-1">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                    <span className="text-lg md:text-2xl font-light tracking-tighter">
                      ${product.price}.00
                    </span>
                    <div className="flex flex-col gap-2">
                      {/* EMAIL BUTTON */}
                      {user?._id !== product.owner?._id && (
                        <button
                          onClick={() => handleContactSeller(product)}
                          className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest border border-gray-200 px-4 py-2 rounded-full hover:bg-black hover:text-white transition-all w-full"
                        >
                          <Mail size={12} /> Email
                        </button>
                      )}

                      {/* TELEGRAM BUTTON (Conditional) */}
                      {user?._id !== product.owner?._id &&
                        product.owner?.telegramUsername && (
                          <button
                            onClick={() =>
                              window.open(
                                `https://t.me/${product.owner.telegramUsername}`,
                                "_blank",
                              )
                            }
                            className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest bg-[#229ED9] text-white px-4 py-2 rounded-full hover:bg-[#1c86b9] transition-all w-full"
                          >
                            <Send size={12} /> Telegram
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
              <p className="text-gray-400 font-serif italic text-lg">
                The collection is currently quiet.
              </p>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-gray-100 py-12 md:py-20 mt-12 md:mt-20 text-center">
        <h2 className="text-3xl md:text-6xl font-serif italic tracking-tighter text-gray-100 mb-4 md:mb-8">
          ASTU Marketplace
        </h2>
        <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.5em] text-gray-300 px-4">
          © 2026 Campus Collective Marketplace
        </p>
      </footer>
    </div>
  );
}
