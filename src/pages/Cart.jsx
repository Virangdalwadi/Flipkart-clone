import { useState, useEffect, useRef, Fragment } from "react";
import Navbar2 from "../components/Navbar2";
import Footer from "../components/Footer";
import Popup from "../components/Popup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosInstance";
import Loader from "../components/Loader";
import shield from "../assets/images/Cart Page image/shield.webp";
import discount from "../assets/images/Cart Page image/discount.webp";
import { getImageCrossOrigin } from "../utils/image";

const PLATFORM_FEE = 10;
const MRP_MARKUP = 1.4;
const ROBOTO =
  "font-['Roboto_Medium',Roboto-Medium,'Droid_Sans',HelveticaNeue-Medium,'Helvetica_Neue_Medium',sans-serif-medium]";
const PLACEHOLDER = "https://placeholder.com";

const getKey = (item) => String(item.id ?? item.productId ?? item.btn_id);
const money = (n) => `$${Number(n).toFixed(2)}`;
const saveGuestCart = (items) => localStorage.setItem("Products", JSON.stringify(items));

const readCart = () => {
  try {
    const stored = JSON.parse(localStorage.getItem("Products")) || [];
    const normalized = stored.reduce((cart, item) => {
      const quantity = Math.max(1, Math.floor(Number(item.quantity)) || 1);
      const existing = cart.find((c) => getKey(c) === getKey(item));
      if (existing) existing.quantity += quantity;
      else cart.push({ ...item, quantity });
      return cart;
    }, []);
    saveGuestCart(normalized);
    return normalized;
  } catch {
    return [];
  }
};

const normalizeBackendCart = (cart) =>
  (cart?.items || []).map((item) => ({
    id: item.productId,
    title: item.title,
    price: Number(item.price),
    image: item.image || item.title,
    quantity: Number(item.quantity) || 1,
    category: item.category,
  }));

const Rating = ({ className = "" }) => (
  <div className={`flex items-center ${className}`}>
    <div className="flex text-amber-400 text-sm">
      ★★★★<span className="text-gray-300">★</span>
    </div>
    <span className="bg-blue-50 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded ml-2">4.0</span>
  </div>
);

const Chevron = ({ open }) => (
  <svg
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 17 17"
    className={`transition-transform duration-200 ${open ? "-rotate-90" : "rotate-90"}`}
  >
    <path d="m6.627 3.749 5 5-5 5" stroke="#111112" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Accordion = ({ title, open, onToggle, summary, bodyClassName, children }) => (
  <div className="mt-5">
    <button type="button" onClick={onToggle} className="flex w-full items-center justify-between text-base text-gray-800">
      <span className="flex items-center gap-2">
        {title}
        <Chevron open={open} />
      </span>
      {!open && summary}
    </button>
    {open && <div className={`mt-3 border-b border-gray-200 pb-3 ${bodyClassName}`}>{children}</div>}
  </div>
);

const Row = ({ label, children }) => (
  <div className="flex justify-between text-base text-gray-500">
    <span className="underline decoration-dotted">{label}</span>
    {children}
  </div>
);

const BottomBar = ({ mrp, total, onPlaceOrder, barClass, buttonClass }) => (
  <div className={`items-center justify-between bg-white px-4 py-2 ${barClass}`}>
    <div className={`flex flex-col ${ROBOTO}`}>
      <span className="text-sm text-gray-600 line-through">{money(mrp)}</span>
      <div className="flex items-center gap-2">
        <span className="text-xl text-gray-900">{money(total)}</span>
        <span className="text-gray-600 text-sm">ⓘ</span>
      </div>
    </div>
    <button
      type="button"
      onClick={onPlaceOrder}
      className={`w-[45%] ${ROBOTO} bg-[#ffc200] py-3 font-medium text-black shadow-sm ${buttonClass}`}
    >
      Place Order
    </button>
  </div>
);

const Cart = () => {
  const [value] = useState("");
  const [items, setItems] = useState(readCart);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [removeItem, setRemoveItem] = useState(null);
  const [cartPopup, setCartPopup] = useState({ show: false, type: "error", title: "", message: "" });
  const [cartLoading, setCartLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [showFees, setShowFees] = useState(false);
  const [showDiscounts, setShowDiscounts] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const quantityTimers = useRef({});
  const pendingQuantities = useRef({});

  const showError = (title, message = title) => setCartPopup({ show: true, type: "error", title, message });

  const setBusy = (id, on) =>
    setActionLoading((prev) => {
      const next = { ...prev };
      if (on) next[id] = true;
      else delete next[id];
      return next;
    });

  useEffect(() => {
    window.scrollTo(0, 0);
    if (loading) return;

    if (!user) {
      setItems(readCart());
      setRemoveItem(null);
      return;
    }

    (async () => {
      setCartLoading(true);
      try {
        const response = await api.get("/cart");
        setItems(normalizeBackendCart(response.data.cart));
      } catch {
        setItems([]);
        showError("Unable to load your cart.");
      } finally {
        setCartLoading(false);
      }
    })();
  }, [user, loading]);

  const updateQuantity = (productId, change) => {
    const current = items.find((item) => String(item.id) === String(productId));
    if (!current) return;

    const nextQuantity = Math.max(1, (Number(current.quantity) || 1) + change);
    if (nextQuantity === Number(current.quantity)) return;

    const updated = items.map((item) =>
      String(item.id) === String(productId) ? { ...item, quantity: nextQuantity } : item
    );
    setItems(updated);

    if (!user) {
      saveGuestCart(updated);
      return;
    }

    // Logged in: update UI now, debounce the API call
    pendingQuantities.current[productId] = nextQuantity;
    clearTimeout(quantityTimers.current[productId]);

    quantityTimers.current[productId] = setTimeout(async () => {
      setBusy(productId, true);
      try {
        await api.put(`/cart/${productId}`, { quantity: pendingQuantities.current[productId] });
      } catch {
        try {
          const response = await api.get("/cart");
          setItems(normalizeBackendCart(response.data.cart));
        } catch {
          showError("Unable to update cart.", "Your cart could not be synchronized. Please retry.");
        }
      } finally {
        setBusy(productId, false);
        delete pendingQuantities.current[productId];
        delete quantityTimers.current[productId];
      }
    }, 400);
  };

  const handleRemovefromCart = (product) =>
    setRemoveItem({ id: product.id, name: product.title || "this item" });

  const confirmRemove = async () => {
    if (!removeItem) return;

    if (!user) {
      const updated = items.filter((item) => String(item.id) !== String(removeItem.id));
      setItems(updated);
      saveGuestCart(updated);
      setRemoveItem(null);
      return;
    }

    setBusy(removeItem.id, true);
    try {
      const response = await api.delete(`/cart/${removeItem.id}`);
      setItems(normalizeBackendCart(response.data.cart));
    } catch {
      showError("Unable to remove item.");
    } finally {
      setBusy(removeItem.id, false);
      setRemoveItem(null);
    }
  };

  const handlePlaceorder = () => {
    if (loading) return;
    if (!user) return setShowLoginPopup(true);
    navigate("/pages/checkout");
  };

  const totalAmount = items.reduce((acc, item) => acc + (Number(item.price) || 0) * item.quantity, 0);
  const totalDiscount = totalAmount * (MRP_MARKUP - 1);
  const mrpTotal = totalAmount + totalDiscount;
  const grandTotal = totalAmount + PLATFORM_FEE;

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f2f4]">
      <Navbar2 setValue={value} />

      <main className="grow mx-auto w-full max-w-7xl px-4 pb-8 pt-28 md:pt-17">
        {cartLoading ? (
          <div className="flex justify-center items-center h-[60vh]">
            <Loader />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-[70vh] text-center">
            <h2 className="text-4xl font-semibold text-gray-800 mb-2">Your cart is empty!</h2>
            <Link to="/" className="mt-5 inline-block rounded-sm bg-blue-600 px-8 py-2 text-lg font-semibold text-white">
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-5 items-start">
            <div className="w-full lg:w-[65%] flex flex-col gap-4">
              {items.map((product) => {
                const busy = Boolean(actionLoading[product.id]);
                const imgSrc = product.image || product.images?.[0] || PLACEHOLDER;
                const alt = product.title || "Product image";
                const price = Number(product.price);

                return (
                  <Fragment key={product.id}>
                    {/* DESKTOP CARD */}
                    <div className="w-full hidden sm:flex flex-row bg-white border border-gray-200 shadow-sm overflow-hidden group px-4 py-5 gap-4">
                      <div className="w-full sm:w-32 h-32 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        <img
                          width="400"
                          height="400"
                          src={imgSrc}
                          crossOrigin={getImageCrossOrigin(imgSrc)}
                          alt={alt}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="flex min-w-0 grow flex-col justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-widest text-gray-600 font-semibold mb-1">
                            {product.category}
                          </p>
                          <h3 className="line-clamp-2 wrap-break-word text-lg font-bold text-gray-900">
                            {product.title}
                          </h3>
                          <Rating className="mt-1" />
                        </div>

                        <div className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex flex-row justify-between gap-8">
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(product.id, -1)}
                                  disabled={product.quantity === 1 || busy}
                                  className="h-8 w-8 border border-gray-400 text-lg cursor-pointer disabled:opacity-40"
                                  aria-label={`Decrease quantity of ${product.title}`}
                                >
                                  -
                                </button>
                                <span className="min-w-8 text-center font-medium">{product.quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(product.id, 1)}
                                  disabled={busy}
                                  className="h-8 w-8 border border-gray-400 text-lg cursor-pointer disabled:opacity-40"
                                  aria-label={`Increase quantity of ${product.title}`}
                                >
                                  +
                                </button>
                              </div>
                              <span className="text-sm text-gray-600">Subtotal: {money(price * product.quantity)}</span>
                            </div>

                            <div className="flex flex-wrap items-baseline gap-2">
                              <span className="text-xl font-bold text-gray-900">{money(price)}</span>
                              <span className="text-sm text-gray-600 line-through">{money(price * MRP_MARKUP)}</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            className="w-full border-2 border-gray-500 px-3 py-1.5 text-base font-medium text-gray-500 transition-colors focus:outline-none cursor-pointer disabled:opacity-60 sm:w-auto"
                            disabled={busy}
                            onClick={() => handleRemovefromCart(product)}
                          >
                            <FontAwesomeIcon icon={faTrashCan} className="mr-1" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* MOBILE CARD */}
                    <div className="sm:hidden w-full bg-white border border-gray-200 shadow-sm p-4">
                      <div className="flex gap-4">
                        <div className="w-28 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-white">
                          <div className="h-32 w-full bg-gray-100 overflow-hidden">
                            <img
                              width="400"
                              height="400"
                              src={imgSrc}
                              crossOrigin={getImageCrossOrigin(imgSrc)}
                              alt={alt}
                              className="w-full h-full object-cover object-center"
                            />
                          </div>

                          <div className="flex items-center justify-between px-2 py-1.5">
                            <button
                              type="button"
                              onClick={() => updateQuantity(product.id, -1)}
                              disabled={product.quantity === 1 || busy}
                              className="h-7 w-7 text-xl leading-none cursor-pointer text-gray-900 disabled:opacity-30"
                              aria-label={`Decrease quantity of ${product.title}`}
                            >
                              −
                            </button>
                            <span className="text-base font-medium text-gray-900">{product.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(product.id, 1)}
                              disabled={busy}
                              className="h-7 w-7 text-xl leading-none cursor-pointer text-gray-900 disabled:opacity-30"
                              aria-label={`Increase quantity of ${product.title}`}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="flex min-w-0 grow flex-col">
                          <p className="text-xs uppercase tracking-widest text-gray-600 font-semibold mb-1">
                            {product.category}
                          </p>
                          <h3 className="line-clamp-2 wrap-break-word text-base font-bold text-gray-900">
                            {product.title}
                          </h3>
                          <Rating className="mt-2" />

                          <div className="mt-3 flex flex-wrap items-baseline gap-2">
                            <span className="text-lg font-bold text-gray-900">{money(price)}</span>
                            <span className="text-sm text-gray-600 line-through">{money(price * MRP_MARKUP)}</span>
                          </div>
                          <span className="mt-1 text-sm text-gray-600">Subtotal: {money(price * product.quantity)}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="mt-4 w-full rounded-xl border border-gray-300 py-2.5 text-base font-semibold text-gray-900 disabled:opacity-60"
                        disabled={busy}
                        onClick={() => handleRemovefromCart(product)}
                      >
                        <FontAwesomeIcon icon={faTrashCan} className="mr-1" />
                        Remove
                      </button>
                    </div>
                  </Fragment>
                );
              })}
            </div>

            <div className="w-full lg:w-[35%] lg:sticky lg:top-17">
              {/* PRICE DETAILS */}
              <div className="bg-white border border-gray-200 shadow-sm">
                <div className="bg-[#f1f2f4] pb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Price Details</h2>
                </div>

                <div className="px-5 py-5">
                  <div className="flex justify-between items-center text-base text-gray-800">
                    <span className="underline decoration-dotted">MRP (incl. of all taxes)</span>
                    <span>{money(mrpTotal)}</span>
                  </div>

                  <Accordion
                    title="Fees"
                    open={showFees}
                    onToggle={() => setShowFees((p) => !p)}
                    summary={<span>${PLATFORM_FEE}</span>}
                    bodyClassName="border-dashed"
                  >
                    <Row label="Platform Fee">
                      <span>${PLATFORM_FEE}</span>
                    </Row>
                  </Accordion>

                  <Accordion
                    title="Discounts"
                    open={showDiscounts}
                    onToggle={() => setShowDiscounts((p) => !p)}
                    summary={<span className="text-green-600">- {money(totalDiscount)}</span>}
                    bodyClassName="space-y-3"
                  >
                    <Row label="Discount on MRP">
                      <span className="text-green-600">- {money(totalDiscount)}</span>
                    </Row>
                    <Row label="Coupons Applied (0)">
                      <span className="text-green-600">- $0.00</span>
                    </Row>
                  </Accordion>

                  <div className={`flex cursor-default ${ROBOTO} justify-between items-center border-t border-gray-200 pt-5 mt-4 text-base text-gray-900`}>
                    <span>Total Amount</span>
                    <span>{money(grandTotal)}</span>
                  </div>

                  <div className="mt-4 cursor-default font-['inter_regular',Roboto,Helvetica,Arial,sans-serif] flex items-center justify-center gap-2 rounded-lg bg-[#ddfbf0] px-3 py-2 text-sm text-[#0e772d]">
                    <img className="size-5" src={discount} alt="" />
                    <span>
                      You'll save <strong>{money(totalDiscount)}</strong> on this order!
                    </span>
                  </div>
                </div>
              </div>

              {/* SECURITY MESSAGE */}

              <div className="flex items-center justify-center py-4">
                <img
                  src={shield}
                  alt=""
                  className="mr-4 h-8 w-6.5 shrink-0 object-contain"
                />
                <p className="w-61.25 cursor-default text-sm font-semibold leading-5 tracking-[-0.01px] text-[#717478]">
                  Safe and secure payments. Easy returns. 100% Authentic products.
                </p>
              </div>


              <BottomBar
                mrp={mrpTotal}
                total={grandTotal}
                onPlaceOrder={handlePlaceorder}
                barClass="hidden lg:flex border border-gray-200 shadow-sm"
                buttonClass="text-lg cursor-pointer"
              />
              <BottomBar
                mrp={mrpTotal}
                total={grandTotal}
                onPlaceOrder={handlePlaceorder}
                barClass="fixed bottom-0 left-0 right-0 z-50 flex border-t border-gray-200 shadow-lg lg:hidden"
                buttonClass="text-base"
              />
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
