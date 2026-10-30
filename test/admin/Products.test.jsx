import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
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
} from "../../src/api/Productapi";
import { useAuth } from "../../src/context/AuthContext";
import Products from "../../src/admin/pages/Products";

vi.mock("../../src/api/Productapi", () => ({
  createAdminProduct: vi.fn(),
  createSellerProduct: vi.fn(),
  deleteSellerProduct: vi.fn(),
  deleteAdminProduct: vi.fn(),
  getAdminProducts: vi.fn(),
  getSellerProducts: vi.fn(),
  updateAdminProduct: vi.fn(),
  updateSellerProduct: vi.fn(),
  updateAdminProductStatus: vi.fn(),
}));
vi.mock("../../src/context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

const product = {
  id: 42,
  title: "Example phone",
  description: "Phone description",
  category: "phones",
  brand: "Example",
  sku: "EX-42",
  price: 249.99,
  discountPercentage: 5,
  rating: 4,
  stock: 8,
  images: ["https://res.cloudinary.com/example/image/upload/phone.jpg"],
  thumbnail: "https://res.cloudinary.com/example/image/upload/phone.jpg",
  isActive: true,
};

const listing = (products = [product]) => ({
  products,
  total: products.length,
  page: 1,
  limit: 20,
  totalPages: products.length ? 1 : 0,
});

const renderPage = () => render(<Products />);

describe("admin product management page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ user: { role: "admin" } });
    getAdminProducts.mockResolvedValue(listing());
    getSellerProducts.mockResolvedValue(listing());
    createAdminProduct.mockResolvedValue({ ...product, id: 43 });
    createSellerProduct.mockResolvedValue({ ...product, id: 43 });
    updateAdminProduct.mockResolvedValue(product);
    updateSellerProduct.mockResolvedValue(product);
    deleteSellerProduct.mockResolvedValue({ message: "Product deleted successfully" });
    deleteAdminProduct.mockResolvedValue({ message: "Product deleted successfully" });
    updateAdminProductStatus.mockResolvedValue({ ...product, isActive: false });
  });

  test("loads and displays product details from the admin listing endpoint", async () => {
    renderPage();

    expect(await screen.findAllByText("Example phone")).toHaveLength(2);
    expect(screen.getAllByText("ID: 42")).toHaveLength(1);
    expect(screen.getAllByText("phones")).toHaveLength(1);
    expect(screen.getAllByText("Active", { selector: "span" })).toHaveLength(2);
    expect(getAdminProducts).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 1,
        limit: 20,
        sortBy: "id",
        order: "asc",
      }),
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  test("sends supported search, category, status, and sort query parameters", async () => {
    renderPage();
    await screen.findAllByText("Example phone");

    fireEvent.change(screen.getByRole("searchbox", { name: /search title/i }), {
      target: { value: "phone" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: /category/i }), {
      target: { value: "phones" },
    });
    fireEvent.change(screen.getByLabelText("Status"), {
      target: { value: "false" },
    });
    fireEvent.change(screen.getByLabelText("Sort"), {
      target: { value: "price" },
    });
    fireEvent.change(screen.getByLabelText("Direction"), {
      target: { value: "desc" },
    });

    await waitFor(() => {
      expect(getAdminProducts).toHaveBeenLastCalledWith(
        expect.objectContaining({
          page: 1,
          limit: 20,
          search: "phone",
          category: "phones",
          isActive: "false",
          sortBy: "price",
          order: "desc",
        }),
        expect.objectContaining({ signal: expect.any(AbortSignal) }),
      );
    });
  });

  test("debounces product search requests while keeping the input responsive", async () => {
    renderPage();
    await screen.findAllByText("Example phone");

    const searchInput = screen.getByRole("searchbox", { name: /search title/i });
    fireEvent.change(searchInput, { target: { value: "ph" } });
    fireEvent.change(searchInput, { target: { value: "phone" } });

    expect(searchInput).toHaveValue("phone");
    expect(getAdminProducts).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(getAdminProducts).toHaveBeenCalledTimes(2);
      expect(getAdminProducts).toHaveBeenLastCalledWith(
        expect.objectContaining({ search: "phone" }),
        expect.objectContaining({ signal: expect.any(AbortSignal) }),
      );
    });
  });

  test("requests the next page from the backend when pagination changes", async () => {
    getAdminProducts.mockResolvedValue({
      ...listing(),
      total: 45,
      totalPages: 3,
    });
    renderPage();
    await screen.findAllByText("Example phone");

    fireEvent.click(screen.getByRole("button", { name: "Next" }));

    await waitFor(() => {
      expect(getAdminProducts).toHaveBeenLastCalledWith(
        expect.objectContaining({ page: 2, limit: 20 }),
        expect.objectContaining({ signal: expect.any(AbortSignal) }),
      );
    });
  });

  test("creates products without server-managed fields and refreshes the listing", async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findAllByText("Example phone");
    await user.click(screen.getByRole("button", { name: "Add product" }));
    const productForm = within(screen.getByRole("dialog"));

    fireEvent.change(productForm.getByLabelText(/Title/), {
      target: { value: "New item" },
    });
    fireEvent.change(productForm.getByLabelText(/Description/), {
      target: { value: "New description" },
    });
    fireEvent.change(productForm.getByLabelText(/Category/), {
      target: { value: "accessories" },
    });
    fireEvent.change(productForm.getByLabelText(/Price/), {
      target: { value: "19.95" },
    });
    fireEvent.change(productForm.getByLabelText(/Stock/), {
      target: { value: "3" },
    });
    fireEvent.change(productForm.getByLabelText(/Thumbnail URL/), {
      target: { value: "https://res.cloudinary.com/example/image/upload/new.jpg" },
    });
    fireEvent.change(productForm.getByLabelText(/Product image URLs/), {
      target: { value: "https://res.cloudinary.com/example/image/upload/new.jpg" },
    });
    await user.click(screen.getByRole("button", { name: "Create product" }));

    await waitFor(() => {
      expect(createAdminProduct).toHaveBeenCalledWith({
        title: "New item",
        description: "New description",
        category: "accessories",
        brand: "",
        sku: "",
        price: 19.95,
        discountPercentage: 0,
        rating: 0,
        stock: 3,
        images: ["https://res.cloudinary.com/example/image/upload/new.jpg"],
        thumbnail: "https://res.cloudinary.com/example/image/upload/new.jpg",
      });
    });
    expect(createAdminProduct.mock.calls[0][0]).not.toHaveProperty("id");
    expect(createAdminProduct.mock.calls[0][0]).not.toHaveProperty("seller");
    expect(createAdminProduct.mock.calls[0][0]).not.toHaveProperty("isActive");
    await waitFor(() => expect(getAdminProducts).toHaveBeenCalledTimes(2));
    expect(await screen.findByRole("status")).toHaveTextContent(
      "Product created successfully.",
    );
  });

  test("edits an existing product through the partial update endpoint", async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findAllByText("Example phone");
    await user.click(screen.getAllByRole("button", { name: "Edit" })[0]);

    const productForm = within(screen.getByRole("dialog"));
    fireEvent.change(productForm.getByLabelText(/Title/), {
      target: { value: "Updated phone" },
    });
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() => {
      expect(updateAdminProduct).toHaveBeenCalledWith(42, {
        title: "Updated phone",
        description: "Phone description",
        category: "phones",
        brand: "Example",
        sku: "EX-42",
        price: 249.99,
        discountPercentage: 5,
        rating: 4,
        stock: 8,
        images: ["https://res.cloudinary.com/example/image/upload/phone.jpg"],
        thumbnail: "https://res.cloudinary.com/example/image/upload/phone.jpg",
      });
    });
    await waitFor(() => expect(getAdminProducts).toHaveBeenCalledTimes(2));
  });

  test("deactivates with the status API and confirms a distinct admin delete", async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findAllByText("Example phone");

    await user.click(screen.getAllByRole("button", { name: "Deactivate" })[0]);
    await waitFor(() => {
      expect(updateAdminProductStatus).toHaveBeenCalledWith(42, false);
    });
    expect(await screen.findByRole("status")).toHaveTextContent(
      "Product deactivated successfully.",
    );

    await user.click(screen.getAllByRole("button", { name: "Delete" })[0]);
    const confirmation = screen.getByRole("alertdialog");
    expect(confirmation).toHaveTextContent(
      "removed from the admin catalog and public storefront",
    );
    expect(confirmation).toHaveTextContent(
      "linked cart, order, and conversation history will be retained",
    );
    expect(within(confirmation).getByRole("heading")).toHaveTextContent(
      "Delete product?",
    );
    await user.click(
      within(confirmation).getByRole("button", { name: "Delete product" }),
    );
    await waitFor(() => {
      expect(deleteAdminProduct).toHaveBeenCalledWith(42);
    });
    expect(updateAdminProductStatus).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(getAdminProducts).toHaveBeenCalledTimes(3));
    expect(await screen.findByRole("status")).toHaveTextContent(
      "Product deleted successfully.",
    );
  });

  test("activates inactive products through the status API", async () => {
    getAdminProducts.mockResolvedValue(listing([{ ...product, isActive: false }]));
    const user = userEvent.setup();
    renderPage();
    await screen.findAllByText("Example phone");

    await user.click(screen.getAllByRole("button", { name: "Activate" })[0]);

    await waitFor(() => {
      expect(updateAdminProductStatus).toHaveBeenCalledWith(42, true);
    });
    expect(await screen.findByRole("status")).toHaveTextContent(
      "Product activated successfully.",
    );
    await waitFor(() => expect(getAdminProducts).toHaveBeenCalledTimes(2));
  });

  test("prevents duplicate admin delete submissions while the request is pending", async () => {
    let finishDelete;
    deleteAdminProduct.mockReturnValueOnce(
      new Promise((resolve) => {
        finishDelete = resolve;
      }),
    );
    renderPage();
    await screen.findAllByText("Example phone");
    fireEvent.click(screen.getAllByRole("button", { name: "Delete" })[0]);

    const confirmButton = within(screen.getByRole("alertdialog")).getByRole(
      "button",
      { name: "Delete product" },
    );
    fireEvent.click(confirmButton);
    fireEvent.click(confirmButton);

    expect(deleteAdminProduct).toHaveBeenCalledTimes(1);
    expect(confirmButton).toBeDisabled();
    finishDelete({ message: "Product deleted successfully" });
    await waitFor(() =>
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument(),
    );
  });

  test("shows admin delete errors and keeps the confirmation available", async () => {
    deleteAdminProduct.mockRejectedValueOnce({
      response: { status: 500, data: { message: "Unable to delete product" } },
    });
    const user = userEvent.setup();
    renderPage();
    await screen.findAllByText("Example phone");
    await user.click(screen.getAllByRole("button", { name: "Delete" })[0]);
    await user.click(
      within(screen.getByRole("alertdialog")).getByRole("button", {
        name: "Delete product",
      }),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Unable to delete product",
    );
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    expect(
      within(screen.getByRole("alertdialog")).getByRole("button", {
        name: "Delete product",
      }),
    ).toBeEnabled();
  });

  test("shows admin status update errors", async () => {
    updateAdminProductStatus.mockRejectedValueOnce({
      response: { status: 500, data: { message: "Unable to update status" } },
    });
    const user = userEvent.setup();
    renderPage();
    await screen.findAllByText("Example phone");
    await user.click(screen.getAllByRole("button", { name: "Deactivate" })[0]);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Unable to update status",
    );
  });

  test("shows backend request errors", async () => {
    getAdminProducts.mockRejectedValueOnce({
      response: { status: 500, data: { message: "Catalog unavailable" } },
    });
    renderPage();
    expect(await screen.findByRole("alert")).toHaveTextContent("Catalog unavailable");
  });

  test("uses seller-scoped listing and delete endpoints for seller-owned products", async () => {
    useAuth.mockReturnValue({ user: { role: "seller" } });
    const user = userEvent.setup();
    renderPage();

    expect(await screen.findAllByText("Example phone")).toHaveLength(2);
    expect(getSellerProducts).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1, limit: 20 }),
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
    expect(getAdminProducts).not.toHaveBeenCalled();

    await user.click(screen.getAllByRole("button", { name: "Delete" })[0]);
    const confirmation = screen.getByRole("alertdialog");
    expect(confirmation).toHaveTextContent("permanently deleted from your products");
    await user.click(
      within(confirmation).getByRole("button", { name: "Delete product" }),
    );

    await waitFor(() => expect(deleteSellerProduct).toHaveBeenCalledWith(42));
    expect(deleteAdminProduct).not.toHaveBeenCalled();
  });
});
