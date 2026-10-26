import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import api from "../../src/api/axiosInstance";
import { useAuth } from "../../src/context/AuthContext";
import Messages from "../../src/admin/pages/Messages";

const socketState = vi.hoisted(() => ({
  connected: true,
  handlers: new Map(),
  emit: vi.fn(),
  off: vi.fn(),
  on: vi.fn(),
  disconnect: vi.fn(),
  timeout: vi.fn(),
}));

vi.mock("../../src/api/axiosInstance", () => ({
  default: { get: vi.fn(), post: vi.fn() },
}));

vi.mock("../../src/context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("socket.io-client", () => ({
  io: vi.fn(() => ({
    get connected() {
      return socketState.connected;
    },
    on: socketState.on,
    off: socketState.off,
    emit: socketState.emit,
    timeout: socketState.timeout,
    disconnect: socketState.disconnect,
  })),
}));

const conversation = {
  _id: "507f1f77bcf86cd799439014",
  customer: { username: "Customer" },
  seller: { username: "Seller" },
  product: { title: "Phone" },
  lastMessage: "Earlier message",
};

function renderMessages() {
  return render(
    <MemoryRouter>
      <Messages />
    </MemoryRouter>,
  );
}

describe("real-time messages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    socketState.handlers = new Map();
    socketState.connected = true;
    socketState.on.mockImplementation((event, handler) => {
      socketState.handlers.set(event, handler);
    });
    socketState.off.mockImplementation((event) => {
      socketState.handlers.delete(event);
    });
    socketState.timeout.mockImplementation(() => ({
      emit: socketState.emit,
    }));
    socketState.emit.mockImplementation((event, _payload, acknowledge) => {
      if (event === "conversation:join") acknowledge(null, { ok: true });
      if (event === "message:send") acknowledge(null, { ok: true });
    });
    useAuth.mockReturnValue({
      user: { _id: "customer-id", role: "user" },
      accessToken: "access-token",
    });
    api.get.mockImplementation(async (url) => {
      if (url === "/chat/conversations") {
        return { data: { conversations: [conversation] } };
      }
      return { data: { messages: [] } };
    });
  });

  test("joins selected conversation and receives messages without polling", async () => {
    const setInterval = vi.spyOn(window, "setInterval");
    renderMessages();

    await screen.findByText("Seller");
    act(() => socketState.handlers.get("connect")());
    fireEvent.click(screen.getByRole("button", { name: /SellerPhone/ }));
    await waitFor(() =>
      expect(socketState.emit).toHaveBeenCalledWith(
        "conversation:join",
        { conversationId: conversation._id },
        expect.any(Function),
      ),
    );

    const message = {
      _id: "message-1",
      conversation: conversation._id,
      sender: { _id: "seller-id", role: "seller" },
      text: "Live reply",
      createdAt: new Date().toISOString(),
    };
    act(() => socketState.handlers.get("message:new")(message));

    expect(await screen.findAllByText("Live reply")).toHaveLength(2);
    expect(setInterval).not.toHaveBeenCalledWith(expect.any(Function), 5000);
    setInterval.mockRestore();
  });

  test("sends messages using the socket acknowledgement flow", async () => {
    renderMessages();
    await screen.findByText("Seller");
    act(() => socketState.handlers.get("connect")());
    fireEvent.click(screen.getByRole("button", { name: /SellerPhone/ }));
    await waitFor(() =>
      expect(socketState.emit).toHaveBeenCalledWith(
        "conversation:join",
        expect.any(Object),
        expect.any(Function),
      ),
    );

    fireEvent.change(screen.getByRole("textbox", { name: "Message" }), {
      target: { value: "Socket message" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() =>
      expect(socketState.emit).toHaveBeenCalledWith(
        "message:send",
        expect.objectContaining({
          conversationId: conversation._id,
          text: "Socket message",
          clientMessageId: expect.any(String),
        }),
        expect.any(Function),
      ),
    );
    expect(api.post).not.toHaveBeenCalled();
  });
});
