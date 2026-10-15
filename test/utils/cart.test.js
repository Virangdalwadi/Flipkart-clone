import { beforeEach, describe, expect, test, vi } from "vitest";
import api from "../../src/api/axiosInstance";
import {
  GUEST_CART_STORAGE_KEY,
  addGuestCartItem,
  addProductToCart,
  getCartProductId,
  isProductInCart,
  normalizeBackendCart,
  normalizeGuestCart,
  readGuestCart,
  writeGuestCart,
} from "../../src/utils/cart";

vi.mock("../../src/api/axiosInstance", () => ({
  default: {
    post: vi.fn(),
  },
}));

describe("cart utilities", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test("normalizes legacy IDs and combines duplicate guest cart items", () => {
    const items = normalizeGuestCart([
      { id: 42, title: "Item", quantity: 2 },
      { productId: "42", title: "Legacy item", quantity: 3 },
      { btn_id: 43, title: "Other item", quantity: 0 },
    ]);

    expect(items).toEqual([
      { id: 42, title: "Item", quantity: 5 },
      { btn_id: 43, title: "Other item", quantity: 1 },
    ]);
    expect(getCartProductId({ btn_id: "42" })).toBe("42");
    expect(isProductInCart(items, { id: "42" })).toBe(true);
  });

  test("reads and writes the existing Products key with normalized data", () => {
    localStorage.setItem(
      GUEST_CART_STORAGE_KEY,
      JSON.stringify([
        { id: 7, title: "Item", quantity: 1 },
        { productId: "7", title: "Legacy item", quantity: 2 },
      ]),
    );

    expect(readGuestCart()).toEqual([
      { id: 7, title: "Item", quantity: 3 },
    ]);
    expect(JSON.parse(localStorage.getItem("Products"))).toEqual([
      { id: 7, title: "Item", quantity: 3 },
    ]);

    expect(writeGuestCart([{ btn_id: 8, quantity: 1 }])).toEqual([
      { btn_id: 8, quantity: 1 },
    ]);
    expect(localStorage.getItem(GUEST_CART_STORAGE_KEY)).toContain('"btn_id":8');
  });

  test("does not overwrite stored guest data when it cannot be parsed", () => {
    localStorage.setItem(GUEST_CART_STORAGE_KEY, "{broken json");

    expect(() => readGuestCart()).toThrow();
    expect(localStorage.getItem(GUEST_CART_STORAGE_KEY)).toBe("{broken json");
  });

  test("increments a duplicate guest product regardless of its legacy ID field", () => {
    const updatedCart = addGuestCartItem(
      [{ productId: "12", title: "Existing item", quantity: 4 }],
      { id: 12, title: "Current product" },
    );

    expect(updatedCart).toEqual([
      { productId: "12", title: "Existing item", quantity: 5 },
    ]);
  });

  test("uses the existing authenticated endpoint and normalizes its response", async () => {
    api.post.mockResolvedValue({
      data: {
        cart: {
          items: [{ productId: 15, title: "Backend item", price: "3.5", quantity: 2 }],
        },
      },
    });

    const items = await addProductToCart({
      id: 15,
      title: "Backend item",
      price: 3.5,
      thumbnail: "item.webp",
      category: "home",
    }, true);

    expect(api.post).toHaveBeenCalledWith("/cart", {
      productId: 15,
      title: "Backend item",
      price: 3.5,
      image: "item.webp",
      category: "home",
      quantity: 1,
    });
    expect(items).toEqual([
      {
        productId: 15,
        id: 15,
        title: "Backend item",
        price: 3.5,
        quantity: 2,
      },
    ]);
    expect(normalizeBackendCart({ items: [{ productId: "2", quantity: "1" }] })[0].id).toBe(2);
  });

  test("propagates authenticated API errors for component-level feedback", async () => {
    api.post.mockRejectedValue(new Error("Backend unavailable"));

    await expect(
      addProductToCart({ id: 15, title: "Item", price: 1 }, true),
    ).rejects.toThrow("Backend unavailable");
  });
});
