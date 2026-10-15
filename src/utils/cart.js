import api from "../api/axiosInstance";

export const GUEST_CART_STORAGE_KEY = "Products";

export const normalizeProductId = (value) => {
  if (value === null || value === undefined) return null;

  const productId = String(value).trim();
  if (!productId) return null;

  const numericProductId = Number(productId);
  return Number.isFinite(numericProductId)
    ? String(numericProductId)
    : productId;
};

export const getCartProductId = (item) =>
  normalizeProductId(item?.id ?? item?.productId ?? item?.btn_id);

export const normalizeGuestCart = (items = []) => {
  if (!Array.isArray(items)) {
    throw new TypeError("Guest cart data must be an array");
  }

  return items.reduce((cart, item) => {
    const quantity = Number.isInteger(Number(item.quantity)) && Number(item.quantity) > 0
      ? Number(item.quantity)
      : 1;
    const productId = getCartProductId(item);
    const existingItem = productId === null
      ? undefined
      : cart.find((cartItem) => getCartProductId(cartItem) === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...item, quantity });
    }

    return cart;
  }, []);
};

export const writeGuestCart = (items) => {
  const normalizedCart = normalizeGuestCart(items);
  localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(normalizedCart));
  return normalizedCart;
};

export const readGuestCart = () => {
  const storedItems = localStorage.getItem(GUEST_CART_STORAGE_KEY);
  if (storedItems === null) return [];

  const parsedItems = JSON.parse(storedItems);
  const normalizedCart = normalizeGuestCart(parsedItems);
  localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(normalizedCart));
  return normalizedCart;
};

export const addGuestCartItem = (items, product) => {
  const cart = normalizeGuestCart(items);
  const productId = getCartProductId(product);
  if (productId === null) {
    throw new Error("Product ID is required to add an item to the cart");
  }

  const existingItem = cart.find(
    (cartItem) => getCartProductId(cartItem) === productId,
  );

  if (existingItem) {
    return cart.map((cartItem) =>
      getCartProductId(cartItem) === productId
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem,
    );
  }

  return [...cart, { ...product, btn_id: product.id, quantity: 1 }];
};

export const normalizeBackendCart = (cart) => {
  const items = cart?.items || [];

  return items.map((item) => ({
    ...item,
    id: Number(item.productId),
    productId: Number(item.productId),
    quantity: Number(item.quantity) || 1,
    price: Number(item.price) || 0,
  }));
};

export const isProductInCart = (items, product) => {
  const productId = getCartProductId(product);
  return productId !== null && items.some(
    (item) => getCartProductId(item) === productId,
  );
};

export const addProductToCart = async (product, authenticated) => {
  if (authenticated) {
    const response = await api.post("/cart", {
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.thumbnail || product.images?.[0],
      category: product.category,
      quantity: 1,
    });

    if (!Array.isArray(response.data?.cart?.items)) {
      throw new Error("The cart response did not contain cart items");
    }

    return normalizeBackendCart(response.data.cart);
  }

  const updatedCart = addGuestCartItem(readGuestCart(), product);
  return writeGuestCart(updatedCart);
};
