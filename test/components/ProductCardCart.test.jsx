import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import api from "../../src/api/axiosInstance";
import { useAuth } from "../../src/context/AuthContext";
import ProductCard from "../../src/components/ProductCard";

vi.mock("../../src/api/axiosInstance", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

vi.mock("../../src/context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../src/components/Footer", () => ({
  default: () => null,
}));

const product = {
  id: 1,
  title: "Test product",
  price: 10,
  category: "test",
  thumbnail: "product.webp",
};

describe("ProductCard cart actions", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    useAuth.mockReturnValue({ user: null });
    api.get.mockResolvedValue({
      data: { products: [product], total: 1 },
    });
  });

  test("adds a guest item and Go to Cart does not trigger product-card navigation", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<ProductCard query="" />} />
          <Route path="/pages/cart" element={<h1>Cart route loaded</h1>} />
          <Route path="/products/1" element={<h1>Product details route</h1>} />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.click(await screen.findByRole("button", { name: "Add to Cart" }));

    expect(await screen.findByRole("link", { name: "Go to Cart" }))
      .toHaveAttribute("href", "/pages/cart");
    expect(JSON.parse(localStorage.getItem("Products"))).toEqual([
      { ...product, btn_id: 1, quantity: 1 },
    ]);
    expect(api.post).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("link", { name: "Go to Cart" }));

    expect(await screen.findByRole("heading", { name: "Cart route loaded" }))
      .toBeInTheDocument();
  });
});
