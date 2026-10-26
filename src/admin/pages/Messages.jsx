import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";
import api from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";

function getErrorMessage(error) {
  return (
    error.response?.data?.message ||
    error.message ||
    "Unable to load messages. Please try again."
  );
}

function mergeMessages(currentMessages, incomingMessages) {
  const messagesById = new Map(
    [...currentMessages, ...incomingMessages].map((message) => [
      message._id,
      message,
    ]),
  );
  return [...messagesById.values()].sort(
    (left, right) => new Date(left.createdAt) - new Date(right.createdAt),
  );
}

function getSocketOrigin() {
  const apiUrl = import.meta.env.VITE_API_URL;
  return apiUrl?.startsWith("http")
    ? new URL(apiUrl).origin
    : window.location.origin;
}

export default function Messages() {
  const { user, accessToken } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId");
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [firstMessage, setFirstMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [joinedConversationId, setJoinedConversationId] = useState("");
  const [error, setError] = useState("");
  const [socketStatus, setSocketStatus] = useState("connecting");
  const socketRef = useRef(null);
  const activeConversationRef = useRef("");
  const pendingMessageRef = useRef(null);

  const selectedConversation = useMemo(
    () => conversations.find((conversation) => conversation._id === selectedId),
    [conversations, selectedId],
  );

  const reloadConversations = useCallback(async (signal) => {
    const response = await api.get("/chat/conversations", { signal });
    setConversations(response.data.conversations);
  }, []);

  const reloadConversationMessages = useCallback(async (conversationId) => {
    try {
      const response = await api.get(
        `/chat/conversations/${conversationId}/messages`,
      );
      if (activeConversationRef.current === conversationId) {
        setMessages((current) =>
          mergeMessages(current, response.data.messages),
        );
      }
    } catch (requestError) {
      if (activeConversationRef.current === conversationId) {
        setError(getErrorMessage(requestError));
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    reloadConversations(controller.signal)
      .then(() => setError(""))
      .catch((requestError) => {
        if (requestError.code !== "ERR_CANCELED" && requestError.name !== "CanceledError") {
          setError(getErrorMessage(requestError));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [reloadConversations]);

  useEffect(() => {
    if (!accessToken) {
      setSocketStatus("offline");
      return undefined;
    }

    const socket = io(getSocketOrigin(), { auth: { token: accessToken } });
    socketRef.current = socket;

    const joinSelectedConversation = () => {
      const conversationId = activeConversationRef.current;
      if (!conversationId) return;

      socket.timeout(5000).emit(
        "conversation:join",
        { conversationId },
        (timeoutError, response) => {
          if (timeoutError) {
            setError("Unable to join this conversation. Please try again.");
          } else if (!response?.ok) {
            setError(response?.error || "Unable to join this conversation.");
          } else {
            setJoinedConversationId(conversationId);
            setError("");
            reloadConversationMessages(conversationId);
          }
        },
      );
    };
    const handleConnect = () => {
      setSocketStatus("connected");
      setError((current) =>
        current.startsWith("Real-time connection failed:") ? "" : current,
      );
      joinSelectedConversation();
    };
    const handleDisconnect = () => setSocketStatus("reconnecting");
    const handleConnectionError = (connectionError) => {
      setSocketStatus("offline");
      setError(
        `Real-time connection failed: ${connectionError.message || "Please retry."}`,
      );
    };
    const handleMessage = (message) => {
      const conversationId =
        typeof message.conversation === "string"
          ? message.conversation
          : message.conversation?._id;

      setConversations((current) =>
        current
          .map((conversation) =>
            conversation._id === conversationId
              ? {
                ...conversation,
                lastMessage: message.text,
                updatedAt: message.createdAt,
              }
              : conversation,
          )
          .sort(
            (left, right) =>
              new Date(right.updatedAt || 0) - new Date(left.updatedAt || 0),
          ),
      );
      if (conversationId === activeConversationRef.current) {
        setMessages((current) => mergeMessages(current, [message]));
      }
    };
    const handleConversationUpdate = () => {
      reloadConversations().catch((requestError) =>
        setError(getErrorMessage(requestError)),
      );
    };
    const handleMessageError = (payload) => {
      setError(payload?.error || "Message could not be sent.");
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectionError);
    socket.on("message:new", handleMessage);
    socket.on("conversation:updated", handleConversationUpdate);
    socket.on("message:error", handleMessageError);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectionError);
      socket.off("message:new", handleMessage);
      socket.off("conversation:updated", handleConversationUpdate);
      socket.off("message:error", handleMessageError);
      socket.disconnect();
      if (socketRef.current === socket) socketRef.current = null;
    };
  }, [accessToken, reloadConversationMessages, reloadConversations]);

  useEffect(() => {
    activeConversationRef.current = selectedId;
    setJoinedConversationId("");
    if (!selectedId) {
      setMessages([]);
      setMessagesLoading(false);
      return undefined;
    }

    let active = true;
    setMessages([]);
    setMessagesLoading(true);

    const loadMessages = async () => {
      try {
        const response = await api.get(`/chat/conversations/${selectedId}/messages`);
        if (active) {
          setMessages((current) =>
            mergeMessages(current, response.data.messages),
          );
          setError("");
        }
      } catch (requestError) {
        if (active) setError(getErrorMessage(requestError));
      } finally {
        if (active) setMessagesLoading(false);
      }
    };

    const socket = socketRef.current;
    if (socket?.connected) {
      socket.timeout(5000).emit(
        "conversation:join",
        { conversationId: selectedId },
        (timeoutError, response) => {
          if (!active) return;
          if (timeoutError) {
            setError("Unable to join this conversation. Please try again.");
          } else if (!response?.ok) {
            setError(response?.error || "Unable to join this conversation.");
          } else {
            setJoinedConversationId(selectedId);
          }
          loadMessages();
        },
      );
    } else {
      loadMessages();
    }
    return () => {
      active = false;
      socket?.emit("conversation:leave", { conversationId: selectedId });
      if (activeConversationRef.current === selectedId) {
        activeConversationRef.current = "";
      }
    };
  }, [selectedId]);

  useEffect(() => {
    const messagePane = document.getElementById("conversation-messages");
    if (messagePane) messagePane.scrollTop = messagePane.scrollHeight;
  }, [messages]);

  const startConversation = async (event) => {
    event.preventDefault();
    setSending(true);
    setError("");
    try {
      const response = await api.post("/chat/conversations", {
        productId: Number(productId),
        text: firstMessage,
      });
      const conversationId = response.data.conversation._id;
      await reloadConversations();
      setSelectedId(conversationId);
      setFirstMessage("");
      navigate("/pages/messages", { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSending(false);
    }
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    const text = draft.trim();
    const socket = socketRef.current;
    if (!text || !selectedId) return;
    if (!socket?.connected) {
      setError("Real-time chat is disconnected. Please wait and try again.");
      return;
    }

    const pending =
      pendingMessageRef.current?.text === text
        ? pendingMessageRef.current
        : { text, clientMessageId: globalThis.crypto.randomUUID() };
    pendingMessageRef.current = pending;
    setSending(true);
    setError("");
    socket.timeout(10000).emit(
      "message:send",
      {
        conversationId: selectedId,
        text,
        clientMessageId: pending.clientMessageId,
      },
      (timeoutError, response) => {
        setSending(false);
        if (timeoutError) {
          setError("Message delivery is taking longer than expected. Retry to safely resend.");
        } else if (!response?.ok) {
          setError(response?.error || "Message could not be sent.");
        } else {
          pendingMessageRef.current = null;
          setDraft((current) => (current.trim() === text ? "" : current));
        }
      },
    );
  };

  const otherParticipant =
    user?.role === "seller"
      ? selectedConversation?.customer
      : selectedConversation?.seller;
  const pageTitle = user?.role === "seller" ? "Customer messages" : "Messages";

  return (
    <section className="space-y-5">
      <div className="ml-5">
        <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
        <p className="mt-1 text-sm text-gray-600">
          {user?.role === "seller"
            ? "Chat with customers about the products in your store."
            : "Ask sellers questions about their products."}
        </p>
        <p role="status" className="mt-1 text-xs text-gray-500">
          {socketStatus === "connected"
            ? "Real-time chat connected"
            : socketStatus === "reconnecting"
              ? "Reconnecting to chat…"
              : socketStatus === "offline"
                ? "Real-time chat unavailable"
                : "Connecting to chat…"}
        </p>
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {productId && user?.role === "user" && (
        <form onSubmit={startConversation} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <label className="block space-y-2 text-sm font-semibold text-gray-800">
            Start a conversation about this product
            <textarea
              value={firstMessage}
              onChange={(event) => setFirstMessage(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 font-normal outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              rows={3}
              maxLength={2000}
              required
              placeholder="Ask the seller a question..."
            />
          </label>
          <button
            type="submit"
            disabled={sending || !firstMessage.trim()}
            className="mt-3 rounded-lg bg-[#2874f0] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {sending ? "Sending…" : "Send message"}
          </button>
        </form>
      )}

      <div className="grid min-h-112 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm md:grid-cols-[minmax(14rem,0.8fr)_2fr]">
        <aside className="border-b border-gray-200 md:border-b-0 md:border-r">
          <h2 className="border-b border-gray-100 px-4 py-3 text-sm font-semibold text-gray-800">
            Conversations
          </h2>
          {loading ? (
            <p className="px-4 py-5 text-sm text-gray-500">Loading conversations…</p>
          ) : conversations.length ? (
            <ul className="max-h-96 overflow-y-auto md:max-h-112">
              {conversations.map((conversation) => {
                const participant =
                  user?.role === "seller" ? conversation.customer : conversation.seller;
                return (
                  <li key={conversation._id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(conversation._id)}
                      className={`w-full border-b border-gray-100 px-4 py-3 text-left hover:bg-blue-50 ${selectedId === conversation._id ? "bg-blue-50" : ""
                        }`}
                    >
                      <span className="block truncate text-sm font-semibold text-gray-900">
                        {participant?.username || "Customer"}
                      </span>
                      <span className="block truncate text-xs text-gray-500">
                        {conversation.product?.title || "Product conversation"}
                      </span>
                      <span className="mt-1 block truncate text-xs text-gray-600">
                        {conversation.lastMessage || "No messages yet"}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="px-4 py-5 text-sm text-gray-500">
              No conversations yet. Customer chats will appear here.
            </p>
          )}
        </aside>

        <div className="flex min-h-80 flex-col">
          {selectedConversation ? (
            <>
              <header className="border-b border-gray-100 px-4 py-3">
                <h2 className="text-sm font-semibold text-gray-900">
                  {otherParticipant?.username || "Conversation"}
                </h2>
                <p className="text-xs text-gray-500">
                  {selectedConversation.product?.title || "Product conversation"}
                </p>
              </header>
              <div id="conversation-messages" className="flex-1 space-y-3 overflow-y-auto p-4">
                {messagesLoading && (
                  <p className="text-sm text-gray-500">Loading messages…</p>
                )}
                {messages.map((message) => {
                  const ownMessage = message.sender?.role === user?.role;
                  return (
                    <div
                      key={message._id}
                      className={`flex ${ownMessage ? "justify-end" : "justify-start"}`}
                    >
                      <p
                        className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${ownMessage
                          ? "bg-[#2874f0] text-white"
                          : "bg-gray-100 text-gray-800"
                          }`}
                      >
                        {message.text}
                      </p>
                    </div>
                  );
                })}
                {!messagesLoading && messages.length === 0 && (
                  <p className="text-sm text-gray-500">No messages yet.</p>
                )}
              </div>
              <form onSubmit={sendMessage} className="flex gap-2 border-t border-gray-100 p-3">
                <input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  maxLength={2000}
                  aria-label="Message"
                  placeholder="Write a message..."
                  className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={
                    sending ||
                    !draft.trim() ||
                    socketStatus !== "connected" ||
                    joinedConversationId !== selectedId
                  }
                  className="rounded-lg bg-[#2874f0] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  Send
                </button>
              </form>
            </>
          ) : (
            <p className="grid flex-1 place-items-center px-4 py-8 text-center text-sm text-gray-500">
              Select a conversation to read and reply to messages.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
