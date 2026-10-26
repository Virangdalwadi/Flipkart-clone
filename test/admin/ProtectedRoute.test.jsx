import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { useAuth } from "../../src/context/AuthContext";
import ProtectedRoute from "../../src/components/ProtectedRoute";
import DashboardLayout from "../../src/admin/components/DashboardLayout";

vi.mock("../../src/context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

function renderAdminRoute() {
  return render(
    <MemoryRouter initialEntries={["/admin/products"]}>
      <Routes>
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute requiredRole="admin">
              <h1>Admin products</h1>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<h1>Storefront</h1>} />
        <Route path="/seller" element={<h1>Seller dashboard</h1>} />
        <Route path="/pages/login" element={<h1>Login page</h1>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("admin route access", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("redirects unauthenticated users to login", () => {
    useAuth.mockReturnValue({ user: null, loading: false });
    renderAdminRoute();
    expect(screen.getByRole("heading", { name: "Login page" })).toBeInTheDocument();
  });

  test("redirects authenticated non-admin users away from admin pages", () => {
    useAuth.mockReturnValue({
      user: { email: "customer@example.com", role: "user" },
      loading: false,
    });
    renderAdminRoute();
    expect(screen.getByRole("heading", { name: "Storefront" })).toBeInTheDocument();
  });

  test("redirects a seller from admin routes to the seller dashboard", () => {
    useAuth.mockReturnValue({
      user: { email: "seller@example.com", role: "seller" },
      loading: false,
    });
    renderAdminRoute();
    expect(screen.getByRole("heading", { name: "Seller dashboard" })).toBeInTheDocument();
  });

  test("allows a database-role admin user", () => {
    useAuth.mockReturnValue({
      user: { email: "admin@example.com", role: "admin" },
      loading: false,
    });
    renderAdminRoute();
    expect(screen.getByRole("heading", { name: "Admin products" })).toBeInTheDocument();
  });

  test("renders nested admin pages and sidebar navigation through the shared layout", () => {
    useAuth.mockReturnValue({
      user: { username: "Admin User", role: "admin" },
      logout: vi.fn(),
      loading: false,
    });

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route path="/admin" element={<DashboardLayout />}>
            <Route index element={<h1>Dashboard route content</h1>} />
            <Route path="products" element={<h1>Products route content</h1>} />
            <Route path="users" element={<h1>Users route content</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: "Dashboard route content" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Admin User")).toBeInTheDocument();
    expect(screen.getByText("Administrator")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("link", { name: /Products/ }));
    expect(
      screen.getByRole("heading", { name: "Products route content" }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("link", { name: /Users/ }));
    expect(
      screen.getByRole("heading", { name: "Users route content" }),
    ).toBeInTheDocument();
  });

  test("renders only seller dashboard links in the shared layout", () => {
    useAuth.mockReturnValue({
      user: { username: "Seller User", role: "seller" },
      logout: vi.fn(),
      loading: false,
    });

    render(
      <MemoryRouter initialEntries={["/seller"]}>
        <Routes>
          <Route path="/seller" element={<DashboardLayout />}>
            <Route index element={<h1>Seller dashboard content</h1>} />
            <Route path="products" element={<h1>Seller products content</h1>} />
            <Route path="messages" element={<h1>Seller messages content</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "Seller dashboard content" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Seller navigation" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Dashboard/ })).toHaveAttribute("href", "/seller");
    expect(screen.getByRole("link", { name: /Products/ })).toHaveAttribute("href", "/seller/products");
    expect(screen.getByRole("link", { name: /Messages/ })).toHaveAttribute("href", "/seller/messages");
    expect(screen.queryByRole("link", { name: /Users/ })).not.toBeInTheDocument();
  });
});
