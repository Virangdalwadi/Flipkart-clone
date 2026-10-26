import React, { useEffect, useState, useRef } from "react";
import Loader from "./Loader";
import { NavLink, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Popup from "./Popup";
import api from "../api/axiosInstance";
import { getProducts, getProductsByCategory } from "../api/Productapi.js";
import { useAuth } from "../context/AuthContext";
import ProductCardSkeleton from "./ProductCardSkeleton";
import {
  addProductToCart,
  isProductInCart,
  normalizeBackendCart,
  readGuestCart,
} from "../utils/cart";
import { getImageCrossOrigin } from "../utils/image";
const PRODUCTS_PER_PAGE = 21;
const CATEGORY_FILTERS = new Map([
  ["sports-accessories", "sports-accessories"],
  ["groceries", "groceries"],
  ["kitchen", "kitchen-accessories"],
  ["kitchen-accessories", "kitchen-accessories"],
]);

const ProductCard = ({ query }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [error, setError] = useState("");
  const [addingId, setAddingId] = useState(null);
  const addingRef = useRef(false);
  const [item, setItem] = useState([]);
  const navigate = useNavigate();

  const observerTarget = useRef(null);
  const nextPage = useRef(2);
  const requestVersion = useRef(0);
  const loadingMoreRef = useRef(false);
  const initialLoadingRef = useRef(true);
  const hasMore = products.length < totalProducts;
  const [popup, setPopup] = useState({ show: false, type: "info", title: "", message: "" });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const currentRequestVersion = requestVersion.current + 1;
    requestVersion.current = currentRequestVersion;
    initialLoadingRef.current = true;
    loadingMoreRef.current = false;
    nextPage.current = 2;
    setLoading(true);
    setLoadingMore(false);
    setProducts([]);
    setTotalProducts(0);
    setError("");

    const fetchData = async () => {
      try {
        const normalizedQuery = (query || "").trim();
        const normalizedCategory = normalizedQuery.toLowerCase();
        const category = CATEGORY_FILTERS.get(normalizedCategory);
        const response = await (category
          ? getProductsByCategory(category, {
            page: 1,
            limit: PRODUCTS_PER_PAGE,
            signal: controller.signal,
          })
          : getProducts({
            page: 1,
            limit: PRODUCTS_PER_PAGE,
            search: normalizedQuery || undefined,
            signal: controller.signal,
          }));
        if (currentRequestVersion !== requestVersion.current) return;

        const productsArray = response.products;

        const visibleProducts = normalizedQuery
          ? productsArray
          : productsArray.filter((product) => product.category?.toLowerCase() !== "beauty");
        setProducts(visibleProducts);
        setTotalProducts(response.total);
      } catch (error) {
        if (error.name !== "CanceledError" && currentRequestVersion === requestVersion.current) {
          console.error("Failed to fetch products:", error);
          setProducts([]);
          setTotalProducts(0);
          setError(error.response?.data?.message || "Unable to load products. Please try again.");
        }
      } finally {
        if (currentRequestVersion === requestVersion.current) {
          initialLoadingRef.current = false;
          setLoading(false);
        }
      }
    };

    const timer = setTimeout(() => {
      fetchData();
    }, 100);

    return () => {
      clearTimeout(timer);
      controller.abort();
      requestVersion.current += 1;
    };
  }, [query]);

  useEffect(() => {
    if (user) {
      const fetchCart = async () => {
        try {
          const response = await api.get("/cart");
          setItem(normalizeBackendCart(response.data.cart));
        } catch (error) {
          console.error("Failed to load cart:", error);
          setItem([]);
        }
      };

      fetchCart();
      return;
    }

    try {
      setItem(readGuestCart());
    } catch (error) {
      console.error("Failed to read guest cart:", error);
      setItem([]);
      setPopup({
        show: true,
        type: "error",
        title: "Unable to load your cart.",
        message: "Your saved cart could not be read. The stored cart has been left unchanged.",
      });
    }
  }, [user]);

  useEffect(() => {
    const currentTarget = observerTarget.current;
    if (!currentTarget || loading || !hasMore) return;

    let timerId = null;
    const controller = new AbortController();
    const currentRequestVersion = requestVersion.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMoreRef.current && !initialLoadingRef.current) {
          if (timerId) clearTimeout(timerId);

          timerId = setTimeout(async () => {
            if (loadingMoreRef.current || currentRequestVersion !== requestVersion.current) return;

            loadingMoreRef.current = true;
            setLoadingMore(true);
            try {
              const normalizedQuery = (query || "").trim();
              const normalizedCategory = normalizedQuery.toLowerCase();
              const category = CATEGORY_FILTERS.get(normalizedCategory);
              const response = await (category
                ? getProductsByCategory(category, {
                  page: nextPage.current,
                  limit: PRODUCTS_PER_PAGE,
                  signal: controller.signal,
                })
                : getProducts({
                  page: nextPage.current,
                  limit: PRODUCTS_PER_PAGE,
                  search: normalizedQuery || undefined,
                  signal: controller.signal,
                }));
              if (currentRequestVersion !== requestVersion.current) return;

              const nextProducts = response.products;
              nextPage.current = response.page + 1;
              if (!nextProducts.length) {
                setTotalProducts(products.length);
                return;
              }

              const visibleProducts = query?.trim()
                ? nextProducts
                : nextProducts.filter((product) => product.category?.toLowerCase() !== "beauty");
              setProducts((currentProducts) => [...currentProducts, ...visibleProducts]);
              setTotalProducts(response.total);
            } catch (error) {
              if (error.name !== "CanceledError") {
                console.error("Failed to load more products:", error);
                setPopup({
                  show: true,
                  type: "error",
                  title: "Unable to load more products.",
                  message: error.response?.data?.message || "Please try again.",
                });
              }
            } finally {
              if (currentRequestVersion === requestVersion.current) {
                loadingMoreRef.current = false;
                setLoadingMore(false);
              }
            }
          }, 500);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(currentTarget);

    return () => {
      observer.disconnect();
      if (timerId) clearTimeout(timerId);
      controller.abort();
    };
  }, [query, products.length, loading, hasMore]);

  const handleAddtoCart = async (product) => {
    if (addingRef.current) return;   // still blocks overlapping requests
    addingRef.current = true;
    setAddingId(product.id);

    try {
      const updatedCart = await addProductToCart(product, Boolean(user));
      setItem(updatedCart);
    } catch (error) {
      console.error("Failed to add product to cart:", error);
      console.error("SERVER RESPONSE:", error.response?.data);
      setPopup({
        show: true,
        type: "error",
        title: "Unable to update cart.",
        message: error.response?.data?.message || "Unable to update cart.",
      });
    } finally {
      addingRef.current = false;
      setAddingId(null);
    }
  };

  const handleViewProduct = (product) => {
    navigate(`/products/${product.id}`);
  };

  return (
    <>
      <div className="flex justify-center mb-4"></div>
      {loading ? (
        <div className="mt-65 mb-10 flex min-h-[calc(100vh-16.25rem)] items-center justify-center px-1 sm:mt-56 sm:min-h-[calc(100vh-14rem)] lg:mt-53 lg:min-h-[calc(100vh-13.25rem)]">
          {/* <Loader /> */}
          <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="mt-65 mb-10 flex min-h-[calc(100vh-16.25rem)] items-center justify-center px-4 text-center sm:mt-56 sm:min-h-[calc(100vh-14rem)] lg:mt-53 lg:min-h-[calc(100vh-13.25rem)]">
          <p className="text-xl text-red-600">{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="mt-65 mb-10 flex min-h-[calc(100vh-16.25rem)] items-center justify-center px-1 sm:mt-56 sm:min-h-[calc(100vh-14rem)] lg:mt-53 lg:min-h-[calc(100vh-13.25rem)]">
          <p className="text-center text-3xl">No products found</p>
        </div>
      ) : (
        <div className="mt-65 mb-10 flex min-h-[calc(100vh-16.25rem)] flex-col items-center justify-center px-1 sm:mt-56 sm:min-h-[calc(100vh-14rem)] lg:mt-53 lg:min-h-[calc(100vh-13.25rem)]">
          <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="group min-w-0 w-full cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm flex flex-col"
                onClick={() => handleViewProduct(product)}
              >
                <div className="relative overflow-hidden aspect-square bg-gray-100">
                  <img
                    width="400"
                    height="400"
                    src={product.images?.[1]}
                    crossOrigin={getImageCrossOrigin(
                      product.thumbnail || product.images?.[0],
                    )}
                    alt={product?.title || "Product image"}
                    // If it's the first image, pass undefined to completely strip the attribute
                    loading={index === 0 ? undefined : "lazy"}
                    fetchPriority={index === 0 ? "high" : "auto"}
                    className="h-full w-full object-contain object-center transition-transform duration-300 ease-in-out group-hover:scale-105"
                  />

                  <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-sm uppercase tracking-wider">
                    Sale
                  </span>
                </div>

                <div className="p-3 sm:p-4 flex flex-col flex-1">
                  <p className="text-xs uppercase tracking-widest text-gray-600 font-semibold mb-1">
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

                  <div className="mt-auto flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
                    <div className="flex min-w-0 flex-col">
                      <span className="text-lg font-bold text-gray-900 sm:text-xl">
                        ${product.price}
                      </span>
                      <span className="text-sm text-gray-600 line-through">
                        ${(product.price + (product.price * 0.1)).toFixed(2)}
                      </span>
                    </div>

                    {!isProductInCart(item, product) ? (
                      <button
                        type="button"
                        className="w-full rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-4 disabled:cursor-wait disabled:opacity-60 sm:w-auto sm:shrink-0"
                        disabled={addingId === product.id}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleAddtoCart(product);
                        }}
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <NavLink
                        to="/pages/cart"
                        className="w-full rounded-xl bg-green-700 px-3 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-green-800 focus:outline-none sm:w-auto sm:shrink-0"
                        onClick={(event) => event.stopPropagation()}
                      >
                        Go to Cart
                      </NavLink>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            ref={observerTarget}
            className={`flex w-full justify-center ${loadingMore ? "py-2" : "h-2"}`}
          >
            {loadingMore && (
              <div className="flex flex-col items-center gap-2 text-sm font-medium text-gray-500">
                <span>Hang on, loading content</span>
                <Loader fullScreen={false} />
              </div>
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
        onClose={() => setPopup((current) => ({ ...current, show: false }))}
      />
    </>
  );
};

export default ProductCard;
