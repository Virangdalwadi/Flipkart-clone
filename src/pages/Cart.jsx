import React, { useState } from "react";
import Navbar3 from "../components/Navbar3";
import Footer from "../components/Footer";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

const Cart = () => {
  const [value, setValue] = useState("");
  const [items, setItems] = useState(
    () => JSON.parse(localStorage.getItem("Products")) || []
  );

  // Fixed execution on every render
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleRemovefromCart = (indexToRemove, productName) => {
    const remove = confirm(
      `Are you sure you want to remove ${productName || "this item"}?`
    );
    if (!remove) return;

    const updatedArray = items.filter((_, index) => index !== indexToRemove);
    setItems(updatedArray);
    localStorage.setItem("Products", JSON.stringify(updatedArray));
  };

  // Fixed order total calculation
  const totalAmount = items.reduce(
    (acc, item) => acc + (Number(item.price) || 0),
    0
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f2f4]">
      <Navbar3 setValue={setValue} />

      {/* Main Content Area */}
      <main className="grow max-w-7xl w-full mx-auto px-4 py-8 mt-16">
        {items.length === 0 ? (
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
            {/* Products List Block (60% Width) */}
            <div className="w-full lg:w-[65%] flex flex-col gap-4">
              {items.map((product, originalIndex) => (
                <div
                  key={originalIndex}
                  className="w-full flex flex-col sm:flex-row bg-white border border-gray-200 shadow-sm overflow-hidden group px-4 py-5 gap-4"
                >
                  {/* Image Container */}
                  <div className="w-full sm:w-32 h-32 shrink-0 overflow-hidden rounded-lg bg-gray-100 cursor-pointer ">
                    <img
                      src={product.images?.[0] || "https://placeholder.com"}
                      alt={product.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-col grow justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-widest cursor-pointer  text-gray-400 font-semibold mb-1">
                        {product.category}
                      </p>
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-1 cursor-pointer transition-colors">
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

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-baseline gap-2 cursor-pointer ">
                        <span className="text-xl font-bold text-gray-900">
                          ${Number(product.price).toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-400 line-through">
                          ${(Number(product.price) * 1.4).toFixed(2)}
                        </span>
                      </div>
                      <button
                        className="text-gray-500 border-gray-500 border-2 font-medium text-base px-3 py-1.5 transition-colors focus:outline-none cursor-pointer"
                        onClick={() =>
                          handleRemovefromCart(originalIndex, product.title)
                        }
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

            {/* Sticky Order Summary Block (40% Width) */}
            <div className="w-full lg:w-[35%] lg:sticky lg:top-24 bg-white border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-3">
                Order Summary
              </h2>

              <div className="flex flex-col gap-3 text-base text-gray-600 border-b pb-4">
                <div className="flex justify-between">
                  <span>Price ({items.length} items)</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span className="text-green-600">-$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="text-green-600">Free</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-lg text-gray-900 pt-4 mb-6">
                <span>Total Amount</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>

              <button className="w-full bg-[#ffc200] cursor-pointer font-light text-black text-lg py-3 px-4 rounded-sm transition-colors shadow-sm focus:outline-none font-['Roboto_Medium']">
                Place Order
              </button>
            </div>

            {/* <div className='bg-white border border-gray-200'>
              <button className="w-full bg-[#ffc200] text-black text-lg font-semibold py-3 px-4 rounded-sm transition-colors shadow-sm focus:outline-none">
                Proceed to Checkout
              </button>
            </div> */}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
