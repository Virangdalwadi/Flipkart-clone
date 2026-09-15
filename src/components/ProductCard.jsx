import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "../style.css";
import Loader from "./Loader";
import { NavLink } from "react-router-dom";
import Footer from "./Footer";

const ProductCard = ({ query }) => {

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [item, setItem] = useState(JSON.parse(localStorage.getItem('Products')) || []);

  const baseUrl = import.meta.env.VITE_API_BASE_URL; // Use process.env.REACT_APP_API_BASE_URL for CRA or process.env.NEXT_PUBLIC_API_BASE_URL for Next.js


  // Infinite Scroll State Management

  const [itemsToShow, setItemsToShow] = useState(30);
  const observerTarget = useRef(null);

  const itemsPerPage = 10;
  const hasMore = itemsToShow < products.length;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {

        // const api = `https://dummyjson.com/products/category/smartphones`
        const api = `${baseUrl}?q=${query}&limit=200`;

        const response = await axios.get(api);

        const productsArray = response.data.products || [];

        setProducts(productsArray.slice(0, 200));
        setItemsToShow(30); // Reset chunk window back to first page layout on new query matching

      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchData();
    }, 100);

    return () => clearTimeout(timer);
  }, [query]);

  // Set up intersection observer tracking element visibility changes

  useEffect(() => {
    const currentTarget = observerTarget.current;
    if (!currentTarget || loading || !hasMore) return;

    let timerId = null; // Variable to store the timeout reference

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Clear any existing timer just in case
          if (timerId) clearTimeout(timerId);

          // Wrap the state update in a setTimeout (e.g., 500ms delay)
          timerId = setTimeout(() => {
            // Pull next incremental window subset into client view bounding area
            setItemsToShow((prevVisible) => Math.min(prevVisible + itemsPerPage, products.length));
          }, 500);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(currentTarget);

    return () => {
      // 1. Clean up the observer
      if (currentTarget) observer.unobserve(currentTarget);
      // 2. Clean up the timeout if the component unmounts or updates
      if (timerId) clearTimeout(timerId);
    };
  }, [products.length, loading, hasMore]);


  // Dynamic sliced segment rendered actively into DOM tree wrapper structure
  const visibleItems = products.slice(0, itemsToShow);

  const handleAddtoCart = (product) => {
    const updatedproductData = {
      ...product,
      btn_id: product.id
    };

    const updatedCart = [...item, updatedproductData];
    setItem(updatedCart);
    localStorage.setItem("Products", JSON.stringify(updatedCart));
    alert("Added to Cart");
  };

  return (
    <>
      <div className="flex justify-center mb-4"></div>
      {loading ? (
        <div className="flex h-[94vh] justify-center items-center">
          <Loader />
        </div>
      ) : products.length === 0 ? (
        <div className="flex h-[70vh] mt-30 items-center justify-center">
          <p className="text-center text-3xl">No products found</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center px-1 mb-10 mt-50">
          <div className="flex flex-wrap gap-x-4 gap-y-4 max-w-7xl m-auto justify-center">
            {visibleItems.map((product) => (
              <div key={product.id} className="w-60 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden group">
                <div className="relative overflow-hidden aspect-square bg-gray-100">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 ease-in-out"
                  />
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-sm uppercase tracking-wider">
                    Sale
                  </span>
                </div>

                <div className="p-5">
                  <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1">
                    {product.category}
                  </p>

                  <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {product.title}
                  </h3>

                  <div className="flex items-center mt-2.5 mb-4">
                    <div className="flex text-amber-400 space-x-0.5 relative">
                      {[...Array(5)].map((_, index) => {
                        const starValue = index + 1;
                        const rating = product.rating || 4.0;

                        // Full Star
                        if (rating >= starValue) {
                          return <span key={index}>★</span>;
                        }
                        // Half Star (Rating falls within this specific star slot)
                        if (rating > index && rating < starValue) {
                          return (
                            <span key={index} className="relative inline-block overflow-hidden">
                              {/* Background grey empty star */}
                              <span className="text-gray-300">★</span>
                              {/* Foreground filled star cropped horizontally */}
                              <span
                                className="absolute top-0 left-0 overflow-hidden text-amber-400"
                                style={{ width: `${(rating - index) * 100}%` }}
                              >
                                ★
                              </span>
                            </span>
                          );
                        }
                        // Empty Star
                        return <span key={index} className="text-gray-300">★</span>;
                      })}
                    </div>
                    <span className="bg-blue-50 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded ml-3">
                      {product.rating || "4.0"}
                    </span>
                  </div>


                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xl font-bold text-gray-900">
                        ${product.price}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        ${(product.price + (product.price * 0.1)).toFixed(2)}
                      </span>
                    </div>

                    {!item.some((cartItem) => cartItem.id === product.id) ? (
                      <button
                        className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 font-medium rounded-xl text-sm px-3 py-2 transition-colors focus:outline-none"
                        onClick={() => handleAddtoCart(product)}
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <NavLink to="/pages/cart">
                        <button
                          className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 font-medium rounded-xl text-sm px-3 py-2 transition-colors focus:outline-none"
                        >
                          Go to Cart
                        </button>
                      </NavLink>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Infinite Scroll Trigger Box anchor element */}
          <div ref={observerTarget} className="w-full flex justify-center p-4 mt-2">
            {hasMore ? (
              <div className="flex flex-col gap-3 animate-pulse mb-2 text-gray-500 font-medium">Hang on, loading content<Loader /></div>
            ) : (
              <div className="text-gray-400 font-medium text-sm"></div>
            )}
          </div>
        </div>

      )}
      <Footer />

    </>
  );
};

export default ProductCard;

