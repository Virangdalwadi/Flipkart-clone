import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar3 from "../components/Navbar3";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import api from "../api/axiosInstance";

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

const getProductImage = (item) => {
  if (typeof item?.image === "string" && item.image) return item.image;
  if (Array.isArray(item?.images) && item.images.length) return item.images[0];
  if (typeof item?.thumbnail === "string" && item.thumbnail) return item.thumbnail;
  return "https://placeholder.com";
};

const Checkout = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [items, setItems] = useState(readCart);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (user) {
      const fetchCart = async () => {
        setIsLoading(true);
        try {
          const response = await api.get("/cart");
          setItems(normalizeBackendCart(response.data.cart));
        } catch {
          setItems([]);
        } finally {
          setIsLoading(false);
        }
      };

      fetchCart();
      return;
    }

    setItems(readCart());
  }, [user, loading]);

  const subtotal = items.reduce((total, item) => {
    return total + (Number(item.price) || 0) * item.quantity;
  }, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f2f4]">
      <Navbar3 />

      <main className="grow mx-auto w-full max-w-6xl px-4 pb-8 pt-28 md:pt-24">
        {isLoading ? (
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <h1 className="text-3xl font-semibold text-gray-800">Loading your cart...</h1>
          </div>
        ) : items.length === 0 ? (
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <h1 className="text-3xl font-semibold text-gray-800">Your cart is empty</h1>
            <p className="mt-2 text-gray-500">Add products before continuing to checkout.</p>
            <Link
              to="/"
              className="mt-6 bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-[1fr_22rem]">
            <section className="bg-white border border-gray-200 p-5 shadow-sm">
              <h1 className="border-b pb-4 text-2xl font-bold text-gray-900">Checkout</h1>

              <div className="divide-y">
                {items.map((item, index) => {
                  const unitPrice = Number(item.price) || 0;

                  return (
                    <div key={`${item.id || item.btn_id || item.title}-${index}`} className="flex gap-4 py-5">
                      <img
                        src={getProductImage(item)}
                        alt={item.title}
                        className="h-24 w-24 shrink-0 object-contain bg-gray-50"
                      />
                      <div className="min-w-0 grow">
                        <h2 className="line-clamp-2 break-words font-semibold text-gray-900">{item.title}</h2>
                        <div className="mt-2 grid grid-cols-1 gap-1 text-sm text-gray-600 sm:grid-cols-3 sm:gap-2">
                          <span>Qty: {item.quantity}</span>
                          <span>Unit: ${unitPrice.toFixed(2)}</span>
                          <span className="text-right font-medium text-gray-900">
                            ${(unitPrice * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <aside className="h-fit bg-white border border-gray-200 p-5 shadow-sm lg:sticky lg:top-24">
              <h2 className="border-b pb-3 text-xl font-bold text-gray-900">Price Details</h2>
              <div className="flex justify-between py-4 text-gray-700">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t pt-4 text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <button
                type="button"
                onClick={() => navigate("/pages/address")}
                className="mt-6 w-full bg-[#ffc200] px-4 py-3 text-lg font-medium text-black hover:bg-yellow-400 font-['Roboto_Medium']"
              >
                Continue to Address
              </button>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
