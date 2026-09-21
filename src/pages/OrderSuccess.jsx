import React from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar3 from "../components/Navbar3";
import Footer from "../components/Footer";

const OrderSuccess = () => {
  const { state } = useLocation();
  const order = state?.order;

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f2f4]">
      <Navbar3 />
      <main className="grow max-w-4xl w-full mx-auto px-4 py-8 mt-16">
        {!order ? (
          <section className="bg-white border border-gray-200 p-7 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900">Order details unavailable</h1>
            <p className="mt-2 text-gray-600">This page is available after a verified payment.</p>
            <Link to="/" className="mt-6 inline-block bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700">
              Continue Shopping
            </Link>
          </section>
        ) : (
          <section className="bg-white border border-gray-200 p-5 shadow-sm sm:p-7">
            <h1 className="text-3xl font-bold text-green-700">Order Placed Successfully</h1>
            <div className="mt-6 grid gap-3 text-sm text-gray-700 sm:grid-cols-2">
              <p><strong>MongoDB Order ID:</strong> {order._id}</p>
              <p><strong>Razorpay Payment ID:</strong> {order.payment?.razorpayPaymentId}</p>
              <p><strong>Total:</strong> ₹{Number(order.totalAmount).toFixed(2)}</p>
              <p><strong>Order Status:</strong> {order.orderStatus}</p>
              <p><strong>Payment Status:</strong> {order.payment?.status}</p>
            </div>

            <div className="mt-7 border-t pt-5">
              <h2 className="text-lg font-bold text-gray-900">Shipping Address</h2>
              <p className="mt-2 text-gray-700">
                {order.shippingAddress.fullName}, {order.shippingAddress.mobile}<br />
                {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </p>
            </div>

            <div className="mt-7 border-t pt-5">
              <h2 className="text-lg font-bold text-gray-900">Purchased Items</h2>
              <div className="mt-3 divide-y">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex justify-between gap-4 py-3 text-sm text-gray-700">
                    <span>{item.title} × {item.quantity}</span>
                    <span>₹{Number(item.subtotal).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
            <Link to="/" className="mt-7 inline-block bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700">
              Continue Shopping
            </Link>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default OrderSuccess;
