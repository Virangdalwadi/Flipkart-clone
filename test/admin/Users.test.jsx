import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import {
  getAdminUserById,
  getAdminUsers,
  updateAdminUserStatus,
} from "../../src/api/Userapi";
import Users from "../../src/admin/pages/Users";

vi.mock("../../src/api/Userapi", () => ({
  getAdminUserById: vi.fn(),
  getAdminUsers: vi.fn(),
  updateAdminUserStatus: vi.fn(),
}));

const customer = {
  id: "507f1f77bcf86cd799439013",
  username: "Taylor",
  lastName: "Customer",
  email: "taylor@example.com",
  role: "user",
  isActive: true,
  mobile: "9876543210",
  gender: "female",
  createdAt: "2026-01-01T00:00:00.000Z",
};

const listing = (users = [customer], overrides = {}) => ({
  users,
  total: users.length,
  page: 1,
  limit: 10,
  totalPages: users.length ? 1 : 0,
  ...overrides,
});

describe("admin user management", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getAdminUsers.mockResolvedValue(listing());
    getAdminUserById.mockResolvedValue(customer);
    updateAdminUserStatus.mockResolvedValue({ ...customer, isActive: false });
  });

  test("loads and displays users with role and status badges", async () => {
    render(<Users />);

    expect(await screen.findByText("Taylor Customer")).toBeInTheDocument();
    expect(screen.getByText("taylor@example.com")).toBeInTheDocument();
    const customerRow = screen.getByRole("row", { name: /Taylor Customer/ });
    expect(
      within(customerRow).getByText("Customer"),
    ).toBeInTheDocument();
    expect(within(customerRow).getByText("Active")).toBeInTheDocument();
    expect(getAdminUsers).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1, limit: 10 }),
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  test("sends search and role/status filters to the backend", async () => {
    const user = userEvent.setup();
    render(<Users />);
    await screen.findByText("Taylor Customer");

    await user.type(screen.getByRole("searchbox", { name: "Search users" }), "taylor@example.com");
    fireEvent.change(screen.getByLabelText("Filter by role"), {
      target: { value: "user" },
    });
    fireEvent.change(screen.getByLabelText("Filter by status"), {
      target: { value: "active" },
    });

    await waitFor(() => {
      expect(getAdminUsers).toHaveBeenLastCalledWith(
        expect.objectContaining({
          page: 1,
          limit: 10,
          search: "taylor@example.com",
          role: "user",
          status: "active",
        }),
        expect.objectContaining({ signal: expect.any(AbortSignal) }),
      );
    });
  });

  test("requests the next backend page when pagination changes", async () => {
    getAdminUsers.mockResolvedValue(
      listing([customer], { total: 25, totalPages: 3 }),
    );
    const user = userEvent.setup();
    render(<Users />);
    await screen.findByText("Taylor Customer");
    await user.click(screen.getByRole("button", { name: "Next" }));

    await waitFor(() => {
      expect(getAdminUsers).toHaveBeenLastCalledWith(
        expect.objectContaining({ page: 2, limit: 10 }),
        expect.objectContaining({ signal: expect.any(AbortSignal) }),
      );
    });
  });

  test("shows loading skeletons and an empty state", async () => {
    let resolveUsers;
    getAdminUsers.mockReturnValue(
      new Promise((resolve) => {
        resolveUsers = resolve;
      }),
    );
    render(<Users />);
    expect(screen.getAllByLabelText("Loading users")).not.toHaveLength(0);

    resolveUsers(listing([]));
    expect(await screen.findByText("No users found")).toBeInTheDocument();
  });

  test("shows a request error and a retry action", async () => {
    getAdminUsers.mockRejectedValue(new Error("Network unavailable"));
    render(<Users />);

    expect(await screen.findByRole("alert")).toHaveTextContent("Network unavailable");
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });

  test("loads safe user details in a dialog", async () => {
    const user = userEvent.setup();
    render(<Users />);
    await screen.findByText("Taylor Customer");
    await user.click(screen.getByRole("button", { name: "View" }));

    const dialog = await screen.findByRole("dialog", { name: "User details" });
    expect(within(dialog).getByText("9876543210")).toBeInTheDocument();
    expect(within(dialog).getByText("female")).toBeInTheDocument();
    expect(getAdminUserById).toHaveBeenCalledWith(
      customer.id,
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  test("confirms status changes and shows a success notification", async () => {
    const user = userEvent.setup();
    getAdminUsers
      .mockResolvedValueOnce(listing())
      .mockResolvedValueOnce(listing([{ ...customer, isActive: false }]));
    render(<Users />);
    await screen.findByText("Taylor Customer");
    await user.click(screen.getByRole("button", { name: "Deactivate" }));

    const dialog = screen.getByRole("dialog", { name: "Deactivate account?" });
    expect(within(dialog).getByText(/will be signed out/i)).toBeInTheDocument();
    await user.click(within(dialog).getByRole("button", { name: "Deactivate account" }));

    await waitFor(() => {
      expect(updateAdminUserStatus).toHaveBeenCalledWith(customer.id, false);
    });
    expect(await screen.findByRole("status")).toHaveTextContent(
      "Taylor Customer's account is now inactive.",
    );
    expect(await screen.findByText("Inactive")).toBeInTheDocument();
  });
});
