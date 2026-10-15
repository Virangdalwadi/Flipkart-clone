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
});
