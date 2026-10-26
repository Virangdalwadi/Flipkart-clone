import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getSellerProducts } from "../../api/Productapi";

export default function Dashboard() {
  const { user } = useAuth();
  const [sellerProductCount, setSellerProductCount] = useState(null);
  const [sellerProductsError, setSellerProductsError] = useState("");

  useEffect(() => {
    if (user?.role !== "seller") return undefined;

    const controller = new AbortController();
    Promise.all([
      getSellerProducts({ limit: 1 }, { signal: controller.signal }),
      getSellerProducts({ limit: 1, isActive: "true" }, { signal: controller.signal }),
    ])
      .then(([allProducts, activeProducts]) => {
        setSellerProductCount({
          total: allProducts.total,
          active: activeProducts.total,
        });
        setSellerProductsError("");
      })
      .catch((error) => {
        if (error.code !== "ERR_CANCELED" && error.name !== "CanceledError") {
          setSellerProductsError(
            error.response?.data?.message || "Unable to load your product overview.",
          );
        }
      });

    return () => controller.abort();
  }, [user?.role]);

  if (user?.role === "seller") {
    return (
      <section className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Seller dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your products and customer conversations from one place.
          </p>
        </div>
        {sellerProductsError && (
          <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {sellerProductsError}
          </p>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Your products</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {sellerProductCount?.total ?? "—"}
            </p>
          </article>
          <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Active products</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {sellerProductCount?.active ?? "—"}
            </p>
          </article>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/seller/products"
            className="inline-flex rounded-lg bg-[#2874f0] px-4 py-2.5 font-semibold text-white hover:bg-blue-700"
          >
            Manage products
          </Link>
          <Link
            to="/seller/messages"
            className="inline-flex rounded-lg border border-[#2874f0] px-4 py-2.5 font-semibold text-[#2874f0] hover:bg-blue-50"
          >
            Customer messages
          </Link>
          <Link
            to="/"
            className="inline-flex rounded-lg border border-[#2874f0] px-4 py-2.5 font-semibold text-[#2874f0] hover:bg-blue-50"
          >
            View public store
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage the store catalog from the product management page.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link
          to="/admin/products"
          className="inline-flex rounded-lg bg-[#2874f0] px-4 py-2.5 font-semibold text-white hover:bg-blue-700"
        >
          Manage products
        </Link>
        <Link
          to="/"
          className="inline-flex rounded-lg border border-[#2874f0] px-4 py-2.5 font-semibold text-[#2874f0] hover:bg-blue-50"
        >
          View public store
        </Link>
      </div>
    </section>
  );
}
