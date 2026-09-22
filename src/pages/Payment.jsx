import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar3 from "../components/Navbar3";
import Footer from "../components/Footer";
import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

const readCart = () => {
  try {
    const items = JSON.parse(localStorage.getItem("Products")) || [];
    return items.map((item) => ({
      ...item,
      quantity: Number.isInteger(Number(item.quantity)) && Number(item.quantity) > 0
        ? Number(item.quantity)
        : 1,
    }));
  } catch {
    return [];
  }
};

const loadRazorpayScript = () => new Promise((resolve, reject) => {
  if (window.Razorpay) {
    resolve();
    return;
  }

  const existingScript = document.querySelector("script[data-razorpay-checkout]");
  if (existingScript) {
    existingScript.addEventListener("load", resolve, { once: true });
    existingScript.addEventListener("error", reject, { once: true });
    return;
  }

  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.async = true;
  script.dataset.razorpayCheckout = "true";
  script.onload = resolve;
  script.onerror = () => reject(new Error("Unable to load Razorpay Checkout"));
  document.body.appendChild(script);
});

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const address = location.state?.address;
  const [items] = useState(readCart);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  const totalAmount = useMemo(
    () => items.reduce((total, item) => total + (Number(item.price) || 0) * item.quantity, 0),
    [items],
  );

  const totalItems = useMemo(
    () => items.reduce((total, item) => total + (Number(item.quantity) || 1), 0),
    [items],
  );

  const handlePayment = async () => {
    if (!address) {
      setError("Your delivery address is missing. Please return to the address step.");
      return;
    }
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setError("");
    setProcessing(true);

    try {
      await loadRazorpayScript();
      const orderResponse = await api.post("/payment/create-order", {
        items: items.map(({ id, title, price, quantity }) => ({ id, title, price, quantity })),
        shippingAddress: address,
      });
      const razorpayOrder = orderResponse.data;

      const options = {
        key: razorpayOrder.keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Flipkart Clone",
        description: "Order Payment",
        order_id: razorpayOrder.orderId,
        prefill: {
          name: address.fullName,
          email: user?.email || "",
          contact: address.mobile,
        },
        theme: { color: "#2874f0" },
        handler: async (paymentResponse) => {
          try {
            const verificationResponse = await api.post("/payment/verify", {
              ...paymentResponse,
              items: items.map(({ id, title, price, quantity }) => ({ id, title, price, quantity })),
              shippingAddress: address,
            });

            if (!verificationResponse.data.success) {
              throw new Error("Payment verification failed");
            }

            localStorage.removeItem("Products");
            navigate("/pages/order-success", {
              state: { order: verificationResponse.data.order },
              replace: true,
            });
          } catch (verificationError) {
            setError(
              verificationError.response?.data?.message ||
              "Payment verification failed. Your cart has been kept unchanged.",
            );
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setError("Payment was cancelled. Your cart is still saved.");
            setProcessing(false);
          },
        },
      };

      const checkout = new window.Razorpay(options);
      checkout.on("payment.failed", () => {
        setError("Payment failed. Please try again. Your cart is still saved.");
        setProcessing(false);
      });
      checkout.open();
    } catch (paymentError) {
      setError(paymentError.response?.data?.message || paymentError.message || "Unable to start payment.");
      setProcessing(false);
    }
  };

  if (!address) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f1f2f4]">
        <Navbar3 />
        <main className="grow flex flex-col items-center justify-center px-4 pt-28 text-center md:pt-24">
          <h1 className="text-2xl font-bold text-gray-900">Address required</h1>
          <p className="mt-2 text-gray-600">Return to the address step before starting payment.</p>
          <button
            type="button"
            onClick={() => navigate("/pages/address")}
            className="mt-6 bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
          >
            Back to Address
          </button>
        </main>
        <Footer />
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col bg-[#f1f2f4]">
      <Navbar3 />
      <main className="grow mx-auto w-full max-w-3xl px-4 pb-8 pt-28 md:pt-24">
        <section className="bg-white border border-gray-200 p-5 shadow-sm sm:p-7">
          <h1 className="border-b pb-4 text-2xl font-bold text-gray-900">Payment</h1>
          <div className="mt-6 space-y-3 text-gray-700">
            <div className="flex justify-between gap-3">
              <span>Items</span>
              <span>{totalItems} {totalItems === 1 ? "item" : "items"}</span>
            </div>
            <div className="flex justify-between gap-3 border-t pt-3 text-lg font-bold text-gray-900">
              <span>Total</span><span>₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>
          {error && <p className="mt-5 text-sm text-red-600">{error}</p>}
          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={() => navigate("/pages/address", { state: { address } })}
              className="border border-blue-600 px-5 py-3 font-medium text-blue-600 hover:bg-blue-50"
            >
              Back to Address
            </button>
            <button
              type="button"
              onClick={handlePayment}
              disabled={processing || items.length === 0}
              className="bg-[#ffc200] px-5 py-3 font-medium text-black hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {processing ? "Processing..." : "Pay with Razorpay"}
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Payment;
