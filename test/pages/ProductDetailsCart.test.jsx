import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import api from "../../src/api/axiosInstance";
import { useAuth } from "../../src/context/AuthContext";
import ProductDetails from "../../src/pages/ProductDetails";

vi.mock("../../src/api/axiosInstance", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

vi.mock("../../src/context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../src/components/Navbar", () => ({
  default: () => null,
}));

vi.mock("../../src/components/Footer", () => ({
  default: () => null,
}));

const product = {
  id: 1,
  title: "Test product",
  description: "Product description",
  price: 10,
  category: "test",
  thumbnail: "product.webp",
  images: ["product.webp"],
};

const renderProductDetails = () =>
  render(
    <MemoryRouter initialEntries={["/products/1"]}>
      <Routes>
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/pages/cart" element={<h1>Cart route loaded</h1>} />
      </Routes>
    </MemoryRouter>,
  );

describe("ProductDetails cart actions", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    api.get.mockImplementation((url) => Promise.resolve({
      data: url === "/products/1"
        ? { product }
        : { cart: { items: [] } },
    }));
  });

  test("Go to Cart navigates to the cart route for legacy guest IDs", async () => {
    useAuth.mockReturnValue({ user: null });
    localStorage.setItem(
      "Products",
      JSON.stringify([{ btn_id: "1", title: "Test product", quantity: 1 }]),
    );

    renderProductDetails();

    fireEvent.click(await screen.findByRole("link", { name: "Go to Cart" }));

    expect(await screen.findByRole("heading", { name: "Cart route loaded" }))
      .toBeInTheDocument();
  });

  test("authenticated add failures show an error and restore the button", async () => {
    useAuth.mockReturnValue({ user: { email: "user@example.com" } });
    api.post.mockRejectedValue(new Error("Backend unavailable"));
    vi.spyOn(console, "error").mockImplementation(() => {});

    renderProductDetails();

    const addButton = await screen.findByRole("button", { name: "Add to Cart" });
    fireEvent.click(addButton);

    expect(await screen.findByRole("alertdialog")).toHaveTextContent(
      "Unable to update cart.",
    );
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Add to Cart" })).toBeEnabled();
    });
    expect(api.post).toHaveBeenCalledWith("/cart", {
      productId: 1,
      title: "Test product",
      price: 10,
      image: "product.webp",
      category: "test",
      quantity: 1,
    });
  });
});
