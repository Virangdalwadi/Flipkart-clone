import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import api from "../../src/api/axiosInstance";
import { AuthProvider, useAuth } from "../../src/context/AuthContext";

vi.mock("../../src/api/axiosInstance", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
  registerAuthHandlers: vi.fn(),
}));

function ProfileImageActions() {
  const { user, updateProfileImage, removeProfileImage } = useAuth();
  return (
    <div>
      <span>{user?.profileImage || "No profile photo"}</span>
      <button
        type="button"
        onClick={() =>
          updateProfileImage(new File(["image"], "photo.png", { type: "image/png" }))
        }
      >
        Upload
      </button>
      <button type="button" onClick={removeProfileImage}>
        Remove
      </button>
    </div>
  );
}

describe("AuthContext profile image actions", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    sessionStorage.setItem("guestCartMergeHandled", "true");
    vi.clearAllMocks();
    api.get.mockImplementation((url) => {
      if (url === "/auth/refresh-token") {
        return Promise.resolve({ data: { accesstoken: "token" } });
      }
      if (url === "/auth/get-me") {
        return Promise.resolve({
          data: { user: { email: "user@example.com", profileImage: "old-url" } },
        });
      }
      return Promise.reject(new Error(`Unexpected GET ${url}`));
    });
  });

  test("updates and removes the current user's image immediately", async () => {
    const user = userEvent.setup();
    api.put.mockResolvedValue({
      data: { user: { profileImage: "new-url" } },
    });
    api.delete.mockResolvedValue({
      data: { user: { profileImage: "" } },
    });

    render(
      <AuthProvider>
        <ProfileImageActions />
      </AuthProvider>,
    );

    expect(await screen.findByText("old-url")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Upload" }));
    expect(await screen.findByText("new-url")).toBeInTheDocument();
    expect(api.put).toHaveBeenCalledWith(
      "/auth/profile/image",
      expect.objectContaining({ name: "photo.png", type: "image/png" }),
      { headers: { "Content-Type": "image/png" } },
    );

    await user.click(screen.getByRole("button", { name: "Remove" }));
    await waitFor(() => expect(api.delete).toHaveBeenCalledWith("/auth/profile/image"));
    expect(await screen.findByText("No profile photo")).toBeInTheDocument();
  });
});
