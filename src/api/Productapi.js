import api from "./axiosInstance";

export const getProducts = async ({
  page = 1,
  limit = 20,
  category,
  search,
  signal,
} = {}) => {
  const response = await api.get("/products", {
    params: { page, limit, category, search },
    signal,
  });

  return response.data;
};

export const getProductsByCategory = async (
  category,
  { page = 1, limit = 20, search, signal } = {},
) => {
  if (!category?.trim()) {
    throw new TypeError("A product category is required");
  }

  return getProducts({
    page,
    limit,
    category: category.trim(),
    search,
    signal,
  });
};

// Get one product using its numeric product ID
export const getProductById = async (id, { signal } = {}) => {
  const productId = Number(id);
  if (!Number.isSafeInteger(productId) || productId <= 0) {
    throw new TypeError("A valid numeric product ID is required");
  }

  const response = await api.get(`/products/${productId}`, { signal });

  return response.data.product;
};

// Search products from MongoDB
export const searchProducts = async (query, { limit = 10, signal } = {}) => {
  const search = query?.trim();
  if (!search) return [];

  const response = await api.get("/products", {
    params: {
      search,
      limit,
      page: 1,
    },
    signal,
  });

  return response.data.products;
};

export const getAdminProducts = async (params = {}, { signal } = {}) => {
  const response = await api.get("/admin/products", { params, signal });
  return response.data;
};

export const getAdminProductById = async (id, { signal } = {}) => {
  const response = await api.get(`/admin/products/${id}`, { signal });
  return response.data.product;
};

export const createAdminProduct = async (product) => {
  const response = await api.post("/admin/products", product);
  return response.data.product;
};

export const updateAdminProduct = async (id, product) => {
  const response = await api.patch(`/admin/products/${id}`, product);
  return response.data.product;
};

export const updateAdminProductStatus = async (id, isActive) => {
  const response = await api.patch(`/admin/products/${id}/status`, { isActive });
  return response.data.product;
};

export const deleteAdminProduct = async (id) => {
  const response = await api.delete(`/admin/products/${id}`);
  return response.data.product;
};

/** @deprecated Use deleteAdminProduct; DELETE archives an admin product. */
export const deactivateAdminProduct = deleteAdminProduct;

export const getSellerProducts = async (params = {}, { signal } = {}) => {
  const response = await api.get("/seller/products", { params, signal });
  return response.data;
};

export const createSellerProduct = async (product) => {
  const response = await api.post("/seller/products", product);
  return response.data.product;
};

export const updateSellerProduct = async (id, product) => {
  const response = await api.patch(`/seller/products/${id}`, product);
  return response.data.product;
};

export const deleteSellerProduct = async (id) => {
  const response = await api.delete(`/seller/products/${id}`);
  return response.data;
};
