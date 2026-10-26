import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { useAuth } from "../../src/context/AuthContext";
import ProfileInformation from "../../src/components/profile/ProfileInformation";

vi.mock("../../src/context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

const renderProfileInformation = () =>
  render(
    <ProfileInformation
      firstName="Test"
      setFirstName={vi.fn()}
      lastName="User"
      setLastName={vi.fn()}
    />,
  );

describe("profile photo controls", () => {
  const updateProfileImage = vi.fn();
  const removeProfileImage = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      value: vi.fn(() => "blob:profile-preview"),
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      value: vi.fn(),
    });
    useAuth.mockReturnValue({
      user: {
        username: "Test",
        email: "test@example.com",
        profileImage: "https://example.com/current.jpg",
      },
      updateProfile: vi.fn(),
      updateProfileImage,
      removeProfileImage,
    });
  });

  test("previews a selected image and cancel resets the preview", async () => {
    const user = userEvent.setup();
    renderProfileInformation();

    await user.upload(
      screen.getByLabelText("Choose a profile photo"),
      new File(["image"], "new-photo.png", { type: "image/png" }),
    );

    expect(screen.getByAltText("Profile photo preview")).toHaveAttribute(
      "src",
      "blob:profile-preview",
    );
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.getByAltText("Profile photo preview")).toHaveAttribute(
      "src",
      "https://example.com/current.jpg",
    );
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:profile-preview");
    expect(updateProfileImage).not.toHaveBeenCalled();
  });

  test("rejects unsupported and oversized images before upload", async () => {
    renderProfileInformation();
    const input = screen.getByLabelText("Choose a profile photo");

    fireEvent.change(input, {
      target: {
        files: [new File(["image"], "photo.gif", { type: "image/gif" })],
      },
    });
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Choose a JPG, JPEG, PNG, or WebP image.",
    );
    expect(updateProfileImage).not.toHaveBeenCalled();

    fireEvent.change(input, {
      target: {
        files: [
          new File([new Uint8Array(5 * 1024 * 1024 + 1)], "large.png", {
            type: "image/png",
          }),
        ],
      },
    });
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Choose an image that is 5 MB or smaller.",
    );
    expect(updateProfileImage).not.toHaveBeenCalled();
  });

  test("uploads a previewed image and removes the current image with feedback", async () => {
    const user = userEvent.setup();
    updateProfileImage.mockResolvedValue({ user: { profileImage: "new-url" } });
    removeProfileImage.mockResolvedValue({ user: { profileImage: "" } });
    renderProfileInformation();

    await user.upload(
      screen.getByLabelText("Choose a profile photo"),
      new File(["image"], "new-photo.webp", { type: "image/webp" }),
    );
    await user.click(screen.getByRole("button", { name: "Save Photo" }));
    await waitFor(() => {
      expect(updateProfileImage).toHaveBeenCalledWith(
        expect.objectContaining({ name: "new-photo.webp", type: "image/webp" }),
      );
    });
    expect(await screen.findByRole("status")).toHaveTextContent(
      "Profile photo updated successfully.",
    );

    await user.click(screen.getByRole("button", { name: "Remove Photo" }));
    await waitFor(() => expect(removeProfileImage).toHaveBeenCalledOnce());
    expect(await screen.findByRole("status")).toHaveTextContent(
      "Profile photo removed successfully.",
    );
  });
});
