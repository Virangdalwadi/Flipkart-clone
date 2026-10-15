import { Link } from "react-router-dom";

export default function Dashboard() {
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
