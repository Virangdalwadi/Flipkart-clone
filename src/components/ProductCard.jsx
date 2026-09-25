import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "../style.css";
import Loader from "./Loader";
import { NavLink, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Popup from "./Popup";
import manualCategoryProducts from "../data/manualCategoryProducts";
import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

const normalizeCart = (cart = []) => cart.reduce((normalized, cartItem) => {
  const productKey = String(cartItem.id ?? cartItem.productId ?? cartItem.btn_id);
  const quantity = Number.isInteger(Number(cartItem.quantity)) && Number(cartItem.quantity) > 0
    ? Number(cartItem.quantity)
    : 1;
  const existingItem = normalized.find(
    (item) => String(item.id ?? item.productId ?? item.btn_id) === productKey,
  );

  if (existingItem) {
    existingItem.quantity += quantity;
    return normalized;
  }
  return [...normalized, { ...cartItem, quantity }];
}, []);

const getGuestCart = () => {
  try {
    const normalizedCart = normalizeCart(JSON.parse(localStorage.getItem("Products")) || []);
    localStorage.setItem("Products", JSON.stringify(normalizedCart));
    return normalizedCart;
  } catch {
    return [];
  }
};

const normalizeMongoCart = (cart) => {
  const items = cart?.items || [];

  return items.map((cartItem) => ({
    ...cartItem,
    id: Number(cartItem.productId),
    productId: Number(cartItem.productId),
    quantity: Number(cartItem.quantity) || 1,
    price: Number(cartItem.price) || 0,
  }));
};

const ProductCard = ({ query }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [popup, setPopup] = useState({ show: false, type: "success", title: "Added to Cart", message: "Added to Cart" });
  const [addingToCart, setAddingToCart] = useState(false);
  const [item, setItem] = useState(getGuestCart);
  const navigate = useNavigate();

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [itemsToShow, setItemsToShow] = useState(30);
  const observerTarget = useRef(null);

  const itemsPerPage = 10;
  const hasMore = itemsToShow < products.length;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const apiUrl = `${baseUrl}?q=${query}&limit=200`;

        const response = await axios.get(apiUrl);

        const productsArray = response.data.products || [];

        const normalizedQuery = (query || "").toLowerCase();
        const manualProducts = manualCategoryProducts.filter((product) =>
          product.category === normalizedQuery
        );
        setProducts(productsArray.length ? productsArray.slice(0, 200) : manualProducts);
        setItemsToShow(30);
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
  }, [baseUrl, query]);

  useEffect(() => {
    if (user) {
      const fetchCart = async () => {
        try {
          const response = await api.get("/cart");
          setItem(normalizeMongoCart(response.data.cart));
        } catch {
          setItem([]);
        }
      };

      fetchCart();
      return;
    }

    setItem(getGuestCart());
  }, [user]);

  useEffect(() => {
    const currentTarget = observerTarget.current;
    if (!currentTarget || loading || !hasMore) return;

    let timerId = null;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (timerId) clearTimeout(timerId);

          timerId = setTimeout(() => {
            setItemsToShow((prevVisible) => Math.min(prevVisible + itemsPerPage, products.length));
          }, 500);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(currentTarget);

    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
      if (timerId) clearTimeout(timerId);
    };
  }, [products.length, loading, hasMore]);

  const visibleItems = products.slice(0, itemsToShow);

  const handleAddtoCart = async (product) => {
    if (addingToCart) return;

    if (user) {
      setAddingToCart(true);
      try {
        const response = await api.post("/cart", {
          productId: product.id,
          title: product.title,
          price: product.price,
          image: product.thumbnail || product.images?.[0],
          quantity: 1,
        });

        setItem(normalizeMongoCart(response.data.cart));
        setPopup({ show: true, type: "success", title: "Added to cart", message: "Added to cart" });
      } catch {
        setPopup({ show: true, type: "error", title: "Unable to update cart.", message: "Unable to update cart." });
      } finally {
        setAddingToCart(false);
      }
      return;
    }

    const existingItem = item.find((cartItem) => Number(cartItem.id ?? cartItem.productId ?? cartItem.btn_id) === Number(product.id));
    const updatedCart = existingItem
      ? item.map((cartItem) =>
        Number(cartItem.id ?? cartItem.productId ?? cartItem.btn_id) === Number(product.id)
          ? { ...cartItem, quantity: (Number(cartItem.quantity) || 1) + 1 }
          : cartItem,
      )
      : [...item, { ...product, btn_id: product.id, quantity: 1 }];

    setItem(updatedCart);
    localStorage.setItem("Products", JSON.stringify(updatedCart));
    setPopup({ show: true, type: "success", title: "Added to Cart", message: "Added to Cart" });
  };

  const handleViewProduct = (product) => {
    navigate(`/products/${product.id}`);
  };

  const isProductInCart = (product) => item.some(
    (cartItem) => Number(cartItem.id ?? cartItem.productId ?? cartItem.btn_id) === Number(product.id),
  );

  return (
    <>
      <div className="flex justify-center mb-4"></div>
      {loading ? (
        <div className="flex h-screen justify-center items-center">
          <Loader />
        </div>
      ) : products.length === 0 ? (
        <div className=" flex h-[70vh] mt-30 items-center justify-center">
          <p className="text-center text-3xl">No products found</p>
        </div>
      ) : (
        <div className="mt-65 mb-10 flex flex-col items-center justify-center px-1 sm:mt-56 lg:mt-53">
          <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {visibleItems.map((product) => (
              <div
                key={product.id}
                className="group min-w-0 w-full cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                onClick={() => handleViewProduct(product)}
              >
                <div className="relative overflow-hidden aspect-square bg-gray-100">
                  <img
                    src={product.images?.[0] || product.thumbnail}
                    alt={product.title}
                    className="h-full w-full object-contain object-center transition-transform duration-300 ease-in-out group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-sm uppercase tracking-wider">
                    Sale
                  </span>
                </div>

                <div className="p-3 sm:p-4">
                  <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1">
                    {product.category}
                  </p>

                  <h3 className="line-clamp-2 text-base font-bold text-gray-900 transition-colors group-hover:text-blue-600 sm:text-lg">
                    {product.title}
                  </h3>

                  <div className="flex items-center mt-2.5 mb-4">
                    <div className="flex text-amber-400 space-x-0.5 relative">
                      {[...Array(5)].map((_, index) => {
                        const starValue = index + 1;
                        const rating = product.rating || 4.0;

                        if (rating >= starValue) {
                          return <span key={index}>★</span>;
                        }
                        if (rating > index && rating < starValue) {
                          return (
                            <span key={index} className="relative inline-block overflow-hidden">
                              <span className="text-gray-300">★</span>
                              <span
                                className="absolute top-0 left-0 overflow-hidden text-amber-400"
                                style={{ width: `${(rating - index) * 100}%` }}
                              >
                                ★
                              </span>
                            </span>
                          );
                        }
                        return <span key={index} className="text-gray-300">★</span>;
                      })}
                    </div>
                    <span className="bg-blue-50 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded ml-3">
                      {product.rating || "4.0"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div className="flex min-w-0 flex-col">
                      <span className="text-lg font-bold text-gray-900 sm:text-xl">
                        ${product.price}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        ${(product.price + (product.price * 0.1)).toFixed(2)}
                      </span>
                    </div>

                    {!isProductInCart(product) ? (
                      <button
                        type="button"
                        className="w-full rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-4 disabled:opacity-60 sm:w-auto"
                        disabled={addingToCart}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleAddtoCart(product);
                        }}
                      >
                        {/* {addingToCart ? "Adding..." : "Add to Cart"} */}
                        Add to Cart
                      </button>
                    ) : (
                      <NavLink to="/pages/cart">
                        <button
                          type="button"
                          className="w-full rounded-xl bg-green-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-4 sm:w-auto"
                          onClick={(event) => event.stopPropagation()}
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
      <Popup
        show={popup.show}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        onClose={() => setPopup((prev) => ({ ...prev, show: false }))}
      />
    </>
  );
};

export default ProductCard;

