"use client";
import { useEffect, useState } from "react";
import api from "../../lib/api";
import { LogOut, PlusCircle, Package, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user profile and products on page load
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // 1. Get User Profile
        const userRes = await api.get("/auth/profile");
        setUser(userRes.data);

        // 2. Get Products
        const productRes = await api.get("/products");
        setProducts(productRes.data);
      } catch (err) {
        console.error("Auth failed or server is down");
        router.push("/login"); // Redirect to login if not authenticated
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [router]);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/products");
      setProducts(data);
    } catch (err) {
      console.error("Failed to refresh products");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts(); // Refresh the list after deletion
      } catch (err) {
        alert("Delete failed. You may not have permission.");
      }
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      router.push("/login");
    } catch (err) {
      router.push("/login");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center px-8 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
          <Package size={24} /> Campus Marketplace
        </h1>
        <div className="flex items-center gap-6">
          <span className="text-sm text-gray-500 hidden sm:block">
            Welcome,{" "}
            <span className="font-bold text-gray-800">{user?.username}</span>
          </span>
          <button
            onClick={() => router.push("/dashboard/create")}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            <PlusCircle size={18} /> Sell Item
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 font-medium transition"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Available Items</h2>
          <p className="text-gray-500">{products.length} items found</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product: any) => (
            <div
              key={product._id}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold uppercase text-blue-500 bg-blue-50 px-2 py-1 rounded">
                  {product.category}
                </span>
                <h3 className="text-xl font-bold mt-3 text-gray-900 leading-tight">
                  {product.title}
                </h3>
                <p className="text-gray-600 mt-2 text-sm line-clamp-3">
                  {product.description}
                </p>
              </div>

              <div className="mt-6">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">
                      ${product.price}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">
                      by {product.owner?.username || "Unknown User"}
                    </p>
                  </div>

                  {/* SHOW DELETE BUTTON ONLY IF OWNER OR ADMIN */}
                  {(user?.role === "admin" ||
                    user?._id === product.owner?._id) && (
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                      title="Delete Listing"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Package size={48} className="mb-4 opacity-20" />
            <p className="text-lg">No items for sale yet.</p>
            <button
              onClick={() => router.push("/dashboard/create")}
              className="mt-4 text-blue-600 hover:underline"
            >
              Be the first to list one!
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
