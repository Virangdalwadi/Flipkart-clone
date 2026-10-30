import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  createAdminProduct,
  createSellerProduct,
  deleteSellerProduct,
  deleteAdminProduct,
  getAdminProducts,
  getSellerProducts,
  updateAdminProduct,
  updateSellerProduct,
  updateAdminProductStatus,
} from "../../api/Productapi";
import { useAuth } from "../../context/AuthContext";

const EMPTY_FORM = {
  title: "",
  description: "",
  category: "",
  brand: "",
  sku: "",
  price: "",
  discountPercentage: "0",
  rating: "0",
  stock: "0",
  images: "",
  thumbnail: "",
};

const fieldClass =
  "w-full rounded-lg border border-gray-300 cursor-pointer bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

function getRequestError(error, isSeller = false) {
  const status = error.response?.status;
  if (status === 401) return "Your session has expired. Sign in again to continue.";
  if (status === 403) {
    return isSeller
      ? "Your account does not have seller access."
      : "Your account does not have administrator access.";
  }
  return (
    error.response?.data?.message ||
    error.message ||
    "The request failed. Please try again."
  );
}

function formFromProduct(product) {
  return {
    title: product.title ?? "",
    description: product.description ?? "",
    category: product.category ?? "",
    brand: product.brand ?? "",
    sku: product.sku ?? "",
    price: String(product.price ?? ""),
    discountPercentage: String(product.discountPercentage ?? 0),
    rating: String(product.rating ?? 0),
    stock: String(product.stock ?? 0),
    images: Array.isArray(product.images) ? product.images.join("\n") : "",
    thumbnail: product.thumbnail ?? "",
  };
}

function productPayload(form) {
  return {
    title: form.title.trim(),
    description: form.description.trim(),
    category: form.category.trim(),
    brand: form.brand.trim(),
    sku: form.sku.trim(),
    price: Number(form.price),
    discountPercentage: Number(form.discountPercentage),
    rating: Number(form.rating),
    stock: Number(form.stock),
    images: form.images
      .split(/\r?\n/)
      .map((image) => image.trim())
      .filter(Boolean),
    thumbnail: form.thumbnail.trim(),
  };
}

function ProductForm({ initialValue, saving, isSeller, onClose, onSubmit }) {
  const [form, setForm] = useState(initialValue);
  const [formError, setFormError] = useState("");
  const isEditing = Boolean(initialValue.id);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");
    const payload = productPayload(form);

    if (
      !payload.title ||
      !payload.description ||
      !payload.category ||
      !Number.isFinite(payload.price) ||
      !Number.isFinite(payload.discountPercentage) ||
      !Number.isFinite(payload.rating) ||
      !Number.isInteger(payload.stock)
    ) {
      setFormError("Complete the required fields with valid numeric values.");
      return;
    }

    try {
      await onSubmit(payload);
    } catch (error) {
      setFormError(getRequestError(error, isSeller));
    }
  };

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-3 sm:p-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) onClose();
      }}
    >
      <section
        aria-labelledby="product-form-title"
        aria-modal="true"
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-5 shadow-xl sm:p-4"
        role="dialog"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id="product-form-title" className="text-xl font-bold text-gray-900">
              {isEditing ? "Edit product" : "Add product"}
            </h2>
            {isEditing && (
              <p className="mt-1 text-sm text-gray-500">Product ID: {initialValue.id}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded p-1 cursor-pointer text-2xl leading-none text-gray-500 hover:bg-gray-100"
            aria-label="Close product form"
          >
            ×
          </button>
        </div>

        {formError && (
          <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {formError}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1 text-sm font-medium text-gray-700 sm:col-span-2">
              Title *
              <input name="title" value={form.title} onChange={handleChange} className={fieldClass} required maxLength={180} />
            </label>
            <label className="space-y-1 text-sm font-medium text-gray-700 sm:col-span-2">
              Description *
              <textarea name="description" value={form.description} onChange={handleChange} className={fieldClass} required rows={3} />
            </label>
            <label className="space-y-1 text-sm font-medium text-gray-700">
              Category *
              <input name="category" value={form.category} onChange={handleChange} className={fieldClass} required />
            </label>
            <label className="space-y-1 text-sm font-medium text-gray-700">
              Brand
              <input name="brand" value={form.brand} onChange={handleChange} className={fieldClass} />
            </label>
            <label className="space-y-1 text-sm font-medium text-gray-700">
              SKU
              <input name="sku" value={form.sku} onChange={handleChange} className={fieldClass} />
            </label>
            <label className="space-y-1 text-sm font-medium text-gray-700">
              Price *
              <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} className={fieldClass} required />
            </label>
            <label className="space-y-1 text-sm font-medium text-gray-700">
              Discount (%)
              <input name="discountPercentage" type="number" min="0" max="100" step="0.01" value={form.discountPercentage} onChange={handleChange} className={fieldClass} />
            </label>
            <label className="space-y-1 text-sm font-medium text-gray-700">
              Rating (0–5)
              <input name="rating" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={handleChange} className={fieldClass} />
            </label>
            <label className="space-y-1 text-sm font-medium text-gray-700">
              Stock *
              <input name="stock" type="number" min="0" step="1" value={form.stock} onChange={handleChange} className={fieldClass} required />
            </label>
            <label className="space-y-1 text-sm font-medium text-gray-700 sm:col-span-2">
              Thumbnail URL
              <input name="thumbnail" type="url" value={form.thumbnail} onChange={handleChange} className={fieldClass} placeholder="https://res.cloudinary.com/..." />
            </label>
            <label className="space-y-1 text-sm font-medium text-gray-700 sm:col-span-2">
              Product image URLs
              <textarea name="images" value={form.images} onChange={handleChange} className={fieldClass} rows={3} placeholder="One HTTPS image URL per line" />
              <span className="block font-normal text-gray-500">
                Use Cloudinary URLs, one per line. Local file paths are not accepted.
              </span>
            </label>
          </div>

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border cursor-pointer border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 cursor-pointer px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60"
            >
              {saving ? "Saving…" : isEditing ? "Save changes" : "Create product"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function ProductImage({ product }) {
  const [failed, setFailed] = useState(false);
  const source = product.thumbnail || product.images?.[0];

  if (!source || failed) {
    return (
      <div className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-gray-100 text-xs text-gray-400">
        No image
      </div>
    );
  }

  return (
    <img
      src={source}
      alt=""
      className="h-14 w-14 shrink-0 rounded-lg bg-gray-100 object-contain"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

export default function Products() {
  const { user } = useAuth();
  const isSeller = user?.role === "seller";
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    isActive: "",
    sortBy: "id",
    order: "asc",
  });
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [debouncedCategory, setDebouncedCategory] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [notice, setNotice] = useState("");
  const [formState, setFormState] = useState(null);
  const [confirmProduct, setConfirmProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [workingId, setWorkingId] = useState(null);
  const workingProductIds = useRef(new Set());
  const [reloadKey, setReloadKey] = useState(0);

  const query = useMemo(() => {
    const params = {
      page,
      limit: pagination.limit,
      sortBy: filters.sortBy,
      order: filters.order,
    };
    if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
    if (debouncedCategory.trim()) params.category = debouncedCategory.trim();
    if (filters.isActive) params.isActive = filters.isActive;
    return params;
  }, [
    debouncedSearch,
    debouncedCategory,
    filters.isActive,
    filters.order,
    filters.sortBy,
    page,
    pagination.limit,
  ]);

  const refreshProducts = useCallback(() => {
    setReloadKey((key) => key + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setListError("");

    const getProducts = isSeller ? getSellerProducts : getAdminProducts;
    getProducts(query, { signal: controller.signal })
      .then((response) => {
        setProducts(response.products);
        setPagination({
          total: response.total,
          page: response.page,
          limit: response.limit,
          totalPages: response.totalPages,
        });
      })
      .catch((error) => {
        if (error.code !== "ERR_CANCELED" && error.name !== "CanceledError") {
          setListError(getRequestError(error, isSeller));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [isSeller, query, reloadKey]);

  useEffect(() => {
    if (!notice) return undefined;
    const timeout = window.setTimeout(() => setNotice(""), 4000);
    return () => window.clearTimeout(timeout);
  }, [notice]);


  const changeFilter = (name, value) => {
    setFilters((current) => ({ ...current, [name]: value }));
    if (name !== "search" && name !== "category") setPage(1);
  };

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(filters.search);
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timeout);
  }, [filters.search]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedCategory(filters.category);
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timeout);
  }, [filters.category]);

  const saveProduct = async (payload) => {
    setSaving(true);
    try {
      if (formState.id) {
        await (isSeller ? updateSellerProduct : updateAdminProduct)(formState.id, payload);
        setNotice("Product updated successfully.");
      } else {
        await (isSeller ? createSellerProduct : createAdminProduct)(payload);
        setNotice("Product created successfully.");
      }
      setFormState(null);
      refreshProducts();
    } finally {
      setSaving(false);
    }
  };

  const changeProductStatus = async (product, isActive) => {
    if (workingProductIds.current.has(product.id)) return;
    workingProductIds.current.add(product.id);
    setWorkingId(product.id);
    setListError("");
    try {
      await updateAdminProductStatus(product.id, isActive);
      setNotice(`Product ${isActive ? "activated" : "deactivated"} successfully.`);
      refreshProducts();
    } catch (error) {
      setListError(getRequestError(error));
    } finally {
      workingProductIds.current.delete(product.id);
      setWorkingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!confirmProduct) return;
    if (workingProductIds.current.has(confirmProduct.id)) return;
    workingProductIds.current.add(confirmProduct.id);
    setWorkingId(confirmProduct.id);
    setListError("");
    try {
      if (isSeller) {
        await deleteSellerProduct(confirmProduct.id);
      } else {
        await deleteAdminProduct(confirmProduct.id);
      }
      setConfirmProduct(null);
      setNotice("Product deleted successfully.");
      refreshProducts();
    } catch (error) {
      setListError(getRequestError(error, isSeller));
    } finally {
      workingProductIds.current.delete(confirmProduct.id);
      setWorkingId(null);
    }
  };

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-50 text-[#2874f0]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 8l-9-5-9 5 9 5 9-5z" />
              <path d="M3 8v8l9 5 9-5V8" />
              <path d="M12 13v8" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="mt-0.5 text-sm text-gray-600">
              {loading ? "Loading products…" : (
                <>
                  <span className="font-semibold text-gray-900">{pagination.total}</span>{" "}
                  product{pagination.total === 1 ? "" : "s"} {isSeller ? "in your store" : "in the catalog"}
                </>
              )}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setFormState({ ...EMPTY_FORM })}
          className="inline-flex items-center justify-center cursor-pointer gap-2 rounded-lg bg-[#2874f0] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-200 active:scale-[0.98]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add product
        </button>
      </div>

      {notice && (
        <div role="status" className="flex items-center justify-between rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice("")} aria-label="Dismiss notification">×</button>
        </div>
      )}
      {listError && (
        <div role="alert" className="flex flex-col gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800 sm:flex-row sm:items-center sm:justify-between">
          <span>{listError}</span>
          <button type="button" onClick={refreshProducts} className="font-semibold underline">
            Retry
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <label className="min-w-55 flex-2 space-y-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Search title
          <input
            type="search"
            value={filters.search}
            onChange={(event) => changeFilter("search", event.target.value)}
            placeholder="Search products"
            className={fieldClass}
          />
        </label>
        <label className="min-w-35 flex-1 space-y-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Category
          <input
            value={filters.category}
            onChange={(event) => changeFilter("category", event.target.value)}
            placeholder="Any category"
            className={fieldClass}
          />
        </label>
        <label className="space-y-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Status
          <select value={filters.isActive} onChange={(event) => changeFilter("isActive", event.target.value)} className={fieldClass}>
            <option value="">All statuses</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </label>
        <label className="space-y-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Sort
          <select value={filters.sortBy} onChange={(event) => changeFilter("sortBy", event.target.value)} className={fieldClass}>
            <option value="id">Product ID</option>
            <option value="title">Title</option>
            <option value="price">Price</option>
            <option value="rating">Rating</option>
            <option value="stock">Stock</option>
            <option value="createdAt">Date added</option>
          </select>
        </label>
        <label className="space-y-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Direction
          <select value={filters.order} onChange={(event) => changeFilter("order", event.target.value)} className={fieldClass}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
        <label className="space-y-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Page size
          <select
            value={pagination.limit}
            onChange={(event) => {
              setPagination((current) => ({ ...current, limit: Number(event.target.value) }));
              setPage(1);
            }}
            className={fieldClass}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </label>
      </div>

      {loading ? (
        <div aria-label="Loading products" className="space-y-3">
          {Array.from({ length: 7 }, (_, index) => (
            <div key={index} className="h-20 animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white px-5 py-14 text-center">
          <h2 className="font-semibold text-gray-900">No products found</h2>
          <p className="mt-1 text-sm text-gray-600">
            Try changing the search or filters, or add a product {isSeller ? "to your store" : "to the catalog"}.
          </p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-212.5 text-left text-sm">
                <thead className="bg-[#2874f0] text-xs uppercase tracking-wide text-white">
                  <tr>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Stock</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <ProductImage product={product} />
                          <div className="min-w-0">
                            <p className="max-w-xs truncate font-semibold text-gray-900">{product.title}</p>
                            <p className="text-xs text-gray-500">ID: {product.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{product.category}</td>
                      <td className="px-4 py-3 text-gray-900">{Number(product.price).toFixed(2)}</td>
                      <td className="px-4 py-3 text-gray-700">{product.stock}</td>
                      <td className="px-4 py-3">
                        <StatusBadge active={product.isActive} />
                      </td>
                      <td className="px-4 py-3">
                        <ProductActions
                          product={product}
                          isSeller={isSeller}
                          busy={workingId === product.id}
                          onEdit={() => setFormState({ ...formFromProduct(product), id: product.id })}
                          onToggle={() => changeProductStatus(product, !product.isActive)}
                          onDelete={() => setConfirmProduct(product)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-3 md:hidden">
            {products.map((product) => (
              <article key={product.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex gap-3">
                  <ProductImage product={product} />
                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold text-gray-900">{product.title}</h2>
                    <p className="text-xs text-gray-500">ID: {product.id} · {product.category}</p>
                    <p className="mt-1 text-sm text-gray-700">
                      {Number(product.price).toFixed(2)} · Stock: {product.stock}
                    </p>
                    <StatusBadge active={product.isActive} />
                  </div>
                </div>
                <div className="mt-4 border-t border-gray-100 pt-3">
                  <ProductActions
                    product={product}
                    isSeller={isSeller}
                    busy={workingId === product.id}
                    onEdit={() => setFormState({ ...formFromProduct(product), id: product.id })}
                    onToggle={() => changeProductStatus(product, !product.isActive)}
                    onDelete={() => setConfirmProduct(product)}
                  />
                </div>
              </article>
            ))}
          </div>

          <div className="flex flex-col gap-3 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Showing {(page - 1) * pagination.limit + 1}–
              {Math.min(page * pagination.limit, pagination.total)} of {pagination.total}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page <= 1}
                className="rounded-lg border border-gray-300 px-3 py-2 font-medium disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <span className="min-w-24 text-center">
                Page {page} of {Math.max(pagination.totalPages, 1)}
              </span>
              <button
                type="button"
                onClick={() => setPage((current) => current + 1)}
                disabled={page >= pagination.totalPages}
                className="rounded-lg border border-gray-300 px-3 py-2 font-medium disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {formState && (
        <ProductForm
          key={formState.id ?? "new"}
          initialValue={formState}
          saving={saving}
          isSeller={isSeller}
          onClose={() => setFormState(null)}
          onSubmit={saveProduct}
        />
      )}
      {confirmProduct && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-black/50 p-4">
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
          >
            <h2 id="delete-title" className="text-lg font-bold text-gray-900">
              Delete product?
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {isSeller
                ? `“${confirmProduct.title}” will be permanently deleted from your products.`
                : `“${confirmProduct.title}” will be removed from the admin catalog and public storefront. Its product record and linked cart, order, and conversation history will be retained.`}
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmProduct(null)}
                disabled={workingId === confirmProduct.id}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={workingId === confirmProduct.id}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {workingId === confirmProduct.id
                  ? "Deleting…"
                  : "Delete product"}
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}

function StatusBadge({ active }) {
  return (
    <span
      className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"
        }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function ProductActions({ product, isSeller, busy, onEdit, onToggle, onDelete }) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <button type="button" onClick={onEdit} disabled={busy} className="rounded px-2 cursor-pointer py-1 font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-50">
        Edit
      </button>
      {isSeller ? (
        <button type="button" onClick={onDelete} disabled={busy} className="rounded px-2 cursor-pointer py-1 font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50">
          {busy ? "Deleting…" : "Delete"}
        </button>
      ) : (
        <>
          <button type="button" onClick={onToggle} disabled={busy} className="rounded px-2 cursor-pointer py-1 font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50">
            {busy ? "Updating…" : product.isActive ? "Deactivate" : "Activate"}
          </button>
          <button type="button" onClick={onDelete} disabled={busy} className="rounded px-2 cursor-pointer py-1 font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50">
            Delete
          </button>
        </>
      )}
    </div>
  );
}
