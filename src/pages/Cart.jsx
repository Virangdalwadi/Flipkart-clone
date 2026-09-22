import React, { useState, useEffect } from "react";
import Navbar3 from "../components/Navbar3";
import Footer from "../components/Footer";
import Popup from "../components/Popup";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosInstance";
import Loader from "../components/Loader";

const readCart = () => {
  try {
    const storedItems = JSON.parse(localStorage.getItem("Products")) || [];
    const normalizedItems = storedItems.reduce((cart, item) => {
      const quantity = Number(item.quantity);
      const normalizedItem = {
        ...item,
        quantity: Number.isInteger(quantity) && quantity > 0 ? quantity : 1,
      };
      const productKey = String(item.id ?? item.productId ?? item.btn_id);
      const existingItem = cart.find(
        (cartItem) => String(cartItem.id ?? cartItem.productId ?? cartItem.btn_id) === productKey,
      );
      if (existingItem) existingItem.quantity += normalizedItem.quantity;
      else cart.push(normalizedItem);
      return cart;
    }, []);
    localStorage.setItem("Products", JSON.stringify(normalizedItems));
    return normalizedItems;
  } catch {
    return [];
  }
};

const normalizeBackendCart = (cart) => {
  const items = cart?.items || [];
  return items.map((item) => ({
    id: item.productId,
    title: item.title,
    price: Number(item.price) || 0,
    image: item.image || "https://placeholder.com",
    quantity: Number(item.quantity) || 1,
    category: item.category || "",
  }));
};

const Cart = () => {
  const [value] = useState("");
  const [items, setItems] = useState(readCart);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [removeItem, setRemoveItem] = useState(null);
  const [showClearCartPopup, setShowClearCartPopup] = useState(false);
  const [cartPopup, setCartPopup] = useState({ show: false, type: "error", title: "", message: "" });
  const [cartLoading, setCartLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (loading) return;
    if (user) {
      const fetchCart = async () => {
        setCartLoading(true);
        try {
          const response = await api.get("/cart");
          setItems(normalizeBackendCart(response.data.cart));
        } catch {
          setItems([]);
          setCartPopup({ show: true, type: "error", title: "Unable to load your cart.", message: "Unable to load your cart." });
        } finally {
          setCartLoading(false);
        }
      };

      fetchCart();
      return;
    }

    setItems(readCart());
    setRemoveItem(null);
  }, [user, loading]);

  const updateQuantity = async (productId, change) => {
    const currentItem = items.find((item) => String(item.id) === String(productId));
    if (!currentItem) return;

    if (user) {
      const nextQuantity = Math.max(1, Number(currentItem.quantity || 1) + change);
      if (Number(currentItem.quantity) === nextQuantity) return;

      setActionLoading((prev) => ({ ...prev, [productId]: true }));
      try {
        const response = await api.put(`/cart/${productId}`, { quantity: nextQuantity });
        setItems(normalizeBackendCart(response.data.cart));
      } catch {
        setCartPopup({ show: true, type: "error", title: "Unable to update cart.", message: "Unable to update cart." });
      } finally {
        setActionLoading((prev) => {
          const next = { ...prev };
          delete next[productId];
          return next;
        });
      }
      return;
    }

    const updatedArray = items.map((item) =>
      String(item.id) === String(productId)
        ? { ...item, quantity: Math.max(1, (Number(item.quantity) || 1) + change) }
        : item,
    );

    setItems(updatedArray);
    localStorage.setItem("Products", JSON.stringify(updatedArray));
  };

  const handleRemovefromCart = (product, productName) => {
    setRemoveItem({ id: product.id, name: productName || product.title || "this item" });
  };

  const confirmRemove = async () => {
    if (!removeItem) return;

    if (user) {
      setActionLoading((prev) => ({ ...prev, [removeItem.id]: true }));
      try {
        const response = await api.delete(`/cart/${removeItem.id}`);
        setItems(normalizeBackendCart(response.data.cart));
      } catch {
        setCartPopup({ show: true, type: "error", title: "Unable to remove item.", message: "Unable to remove item." });
      } finally {
        setActionLoading((prev) => {
          const next = { ...prev };
          delete next[removeItem.id];
          return next;
        });
        setRemoveItem(null);
      }
      return;
    }

    const updatedArray = items.filter((item) => String(item.id) !== String(removeItem.id));
    setItems(updatedArray);
    localStorage.setItem("Products", JSON.stringify(updatedArray));
    setRemoveItem(null);
  };

  const handleClearCart = async () => {
    if (user) {
      setCartLoading(true);
      try {
        await api.delete("/cart");
        setItems([]);
      } catch {
        setCartPopup({ show: true, type: "error", title: "Unable to update cart.", message: "Unable to update cart." });
      } finally {
        setCartLoading(false);
        setShowClearCartPopup(false);
      }
      return;
    }

    setItems([]);
    localStorage.setItem("Products", JSON.stringify([]));
    setShowClearCartPopup(false);
  };

  const handlePlaceorder = () => {
    if (loading) return;

    if (!user) {
      setShowLoginPopup(true);
      return;
    }

    navigate("/pages/checkout");
  };

  const totalAmount = items.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * item.quantity,
    0,
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f2f4]">
      <Navbar3 setValue={value} />

      <main className="grow mx-auto w-full max-w-7xl px-4 pb-8 pt-28 md:pt-24">
        {cartLoading ? (
          <div className="flex justify-center items-center h-[60vh]">
            {/* <div className="text-lg text-gray-600">Loading your cart...</div> */}
            <Loader />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-[70vh] text-center">
            <h2 className="text-4xl font-semibold text-gray-800 mb-2">
              Your cart is empty!
            </h2>
            <p className="text-gray-500 text-lg">
              Add some items to get started!
            </p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-5 items-start">
            <div className="w-full lg:w-[65%] flex flex-col gap-4">
              {items.map((product) => (
                <div
                  key={product.id}
                  className="w-full flex flex-col sm:flex-row bg-white border border-gray-200 shadow-sm overflow-hidden group px-4 py-5 gap-4"
                >
                  <div className="w-full sm:w-32 h-32 shrink-0 overflow-hidden rounded-lg bg-gray-100 cursor-pointer ">
                    <img
                      src={product.image || product.images?.[0] || "https://placeholder.com"}
                      alt={product.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="flex min-w-0 grow flex-col justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-widest cursor-pointer  text-gray-400 font-semibold mb-1">
                        {product.category || "Product"}
                      </p>
                      <h3 className="line-clamp-2 wrap-break-words text-lg font-bold text-gray-900 cursor-pointer transition-colors">
                        {product.title}
                      </h3>

                      <div className="flex items-center mt-1 cursor-pointer">
                        <div className="flex text-amber-400 text-sm ">
                          <span>★</span>
                          <span>★</span>
                          <span>★</span>
                          <span>★</span>
                          <span className="text-gray-300">★</span>
                        </div>
                        <span className="bg-blue-50 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded ml-2">
                          4.0
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, -1)}
                            disabled={product.quantity === 1 || Boolean(actionLoading[product.id])}
                            className="h-8 w-8 border border-gray-400 text-lg disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label={`Decrease quantity of ${product.title}`}
                          >
                            -
                          </button>
                          <span className="min-w-8 text-center font-medium">{product.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, 1)}
                            disabled={Boolean(actionLoading[product.id])}
                            className="h-8 w-8 border border-gray-400 text-lg disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label={`Increase quantity of ${product.title}`}
                          >
                            +
                          </button>
                        </div>
                        <span className="text-sm text-gray-600">
                          Subtotal: ${(Number(product.price) * product.quantity).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-baseline gap-2 cursor-pointer">
                        <span className="text-xl font-bold text-gray-900">
                          ${Number(product.price).toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          ${(Number(product.price) * 1.4).toFixed(2)}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="w-full border-2 border-gray-500 px-3 py-1.5 text-base font-medium text-gray-500 transition-colors focus:outline-none cursor-pointer disabled:opacity-60 sm:w-auto"
                        disabled={Boolean(actionLoading[product.id])}
                        onClick={() => handleRemovefromCart(product, product.title)}
                      >
                        <span className="mr-1">
                          <FontAwesomeIcon icon={faTrashCan} />
                        </span>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full lg:w-[35%] lg:sticky lg:top-24 bg-white border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-3">
                Order Summary
              </h2>

              <div className="flex flex-col gap-3 text-base text-gray-600 border-b pb-4">
                <div className="flex min-w-0 justify-between gap-3">
                  <span className="wrap-break-words">Price ({items.reduce((count, item) => count + item.quantity, 0)} items)</span>
                  <span className="shrink-0">${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span>Discount</span>
                  <span className="text-green-600">-$0.00</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span>Delivery Charges</span>
                  <span className="text-green-600">Free</span>
                </div>
              </div>

              <div className="flex justify-between gap-3 font-bold text-lg text-gray-900 pt-4 mb-6">
                <span>Total Amount</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>

              {/* <button
                type="button"
                onClick={() => setShowClearCartPopup(true)}
                className="w-full mb-3 bg-gray-200 text-gray-800 cursor-pointer font-medium text-base py-2.5 px-4 rounded-sm transition-colors shadow-sm focus:outline-none"
              >
                Clear Cart
              </button> */}

              <button
                type="button"
                onClick={handlePlaceorder}
                className="w-full bg-[#ffc200] cursor-pointer font-light text-black text-lg py-3 px-4 rounded-sm transition-colors shadow-sm focus:outline-none font-['Roboto_Medium']"
              >
                Place Order
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <Popup
        show={showLoginPopup}
        type="warning"
        title="Login Required"
        message="Please log in before placing an order."
        onClose={() => {
          setShowLoginPopup(false);
          navigate("/pages/login", { state: { from: location } });
        }}
      />
      <Popup
        show={Boolean(removeItem)}
        type="warning"
        title="Remove item?"
        message={
          <>
            Are you sure you want to remove <strong>{removeItem?.name || "this item"}</strong> from your cart?
          </>
        }
        onClose={() => setRemoveItem(null)}
        onConfirm={confirmRemove}
        confirmButtonText="Remove"
      />
      <Popup
        show={showClearCartPopup}
        type="warning"
        title="Clear cart?"
        message="Are you sure you want to clear your cart?"
        onClose={() => setShowClearCartPopup(false)}
        onConfirm={handleClearCart}
        confirmButtonText="Clear cart"
      />
      <Popup
        show={cartPopup.show}
        type={cartPopup.type}
        title={cartPopup.title}
        message={cartPopup.message}
        onClose={() => setCartPopup((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
};

export default Cart;
