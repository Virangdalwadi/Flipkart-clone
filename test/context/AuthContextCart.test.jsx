import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import api from "../../src/api/axiosInstance";
import { AuthProvider, useAuth } from "../../src/context/AuthContext";

vi.mock("../../src/api/axiosInstance", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
  registerAuthHandlers: vi.fn(),
}));

const AuthStatus = () => {
  const { user } = useAuth();
  return <span>{user?.email || "Guest"}</span>;
};

const renderAuthProvider = () =>
  render(
    <AuthProvider>
      <AuthStatus />
    </AuthProvider>,
  );

describe("guest cart authentication merge", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.clearAllMocks();
    api.get.mockImplementation((url) => {
      if (url === "/auth/refresh-token") {
        return Promise.resolve({ data: { accesstoken: "test-token" } });
      }
      if (url === "/auth/get-me") {
        return Promise.resolve({
          data: { user: { email: "user@example.com" } },
        });
      }
      return Promise.reject(new Error(`Unexpected GET ${url}`));
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("merges normalized legacy guest IDs, then removes the guest cart", async () => {
    localStorage.setItem(
      "Products",
      JSON.stringify([
        { productId: "21", title: "Item", quantity: 1 },
        { btn_id: 21, title: "Legacy item", quantity: 2 },
      ]),
    );
    api.post.mockResolvedValue({ data: { success: true } });

    renderAuthProvider();

    expect(await screen.findByText("user@example.com")).toBeInTheDocument();
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/cart/merge", {
        items: [{ productId: "21", quantity: 3 }],
      });
    });
    await waitFor(() => {
      expect(localStorage.getItem("Products")).toBeNull();
    });
  });

  test("retains the guest cart if the merge request fails", async () => {
    localStorage.setItem(
      "Products",
      JSON.stringify([{ id: 21, title: "Item", quantity: 2 }]),
    );
    api.post.mockRejectedValue(new Error("Merge failed"));
    vi.spyOn(console, "error").mockImplementation(() => {});

    renderAuthProvider();

    expect(await screen.findByText("user@example.com")).toBeInTheDocument();
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/cart/merge", {
        items: [{ productId: 21, quantity: 2 }],
      });
    });
    expect(JSON.parse(localStorage.getItem("Products"))).toEqual([
      { id: 21, title: "Item", quantity: 2 },
    ]);
  });
});
