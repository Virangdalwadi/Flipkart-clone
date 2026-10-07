import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance.js";
import CopyButton from "../CopyButton.jsx"


export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/orders");

        setOrders(response.data?.orders || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);

        setError(
          error.response?.data?.message ||
          "Failed to load your orders."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="p-4 sm:p-5">
        <h2 className="mb-5 text-base font-semibold text-gray-800">
          My Orders
        </h2>

        <p className="text-sm text-gray-500">
          Loading your orders...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-5">
        <h2 className="mb-5 text-base font-semibold text-gray-800">
          My Orders
        </h2>

        <p className="text-sm text-red-500">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5">
      <h2 className="mb-5 text-base font-semibold text-gray-800">
        My Orders
      </h2>

      {orders.length === 0 ? (
        <div className="rounded border border-gray-200 p-6 text-center">
          <p className="text-sm text-gray-500">
            You haven't placed any orders yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded border-3 border-gray-200 bg-white p-2 text-sm text-gray-800"
            >
              {/* Order Header */}
              <div className="flex flex-col gap-2 border-b border-gray-100 pb-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs text-gray-500">
                    ORDER ID
                  </p>

                  <p className="mt-1 break-all font-medium">
                    #OD{order._id}  <CopyButton text={order._id} />
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    ORDER STATUS
                  </p>

                  <p
                    className={`mt-1 font-semibold text-right ${order.orderStatus === "DELIVERED"
                      ? "text-green-600"
                      : order.orderStatus === "CANCELLED"
                        ? "text-red-600"
                        : "text-blue-600"
                      }`}
                  >
                    {order.orderStatus}
                  </p>
                </div>
              </div>

              {/* Products */}
              <div className="divide-y divide-gray-100">
                {order.items?.map((item, index) => (
                  <div
                    key={`${item.productId}-${index}`}
                    className="flex flex-col gap-2 py-1 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900">
                        {item.title}
                      </p>

                      <p className="mt-1 text-gray-500">
                        ${Number(item.price).toFixed(2)} ×{" "}
                        {item.quantity}
                      </p>
                    </div>

                    <p className="font-semibold text-gray-900">
                      ${Number(item.subtotal).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="border-t border-gray-200 pt-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">
                      PAYMENT
                    </p>

                    <p
                      className={`mt-1 font-semibold ${order.payment?.status === "paid"
                        ? "text-green-600"
                        : "text-gray-700"
                        }`}
                    >
                      {order.payment?.status?.toUpperCase() ||
                        "PENDING"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      TOTAL
                    </p>

                    <p className="mt-1 text-lg font-bold text-gray-900">
                      ${Number(order.totalAmount).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
