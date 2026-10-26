import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Popup from "../components/Popup";
import api from "../api/axiosInstance";
import { getProductById } from "../api/Productapi.js";
import { useAuth } from "../context/AuthContext";
import ProductSkeleton from "../components/ProductSkeleton";
import {
  addProductToCart,
  isProductInCart,
  readGuestCart,
} from "../utils/cart";
import { getImageCrossOrigin } from "../utils/image";

const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [cartPopup, setCartPopup] = useState({ show: false, type: "error", title: "", message: "" });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const checkCart = async () => {
      if (!product) return;

      try {
        if (user) {
          const response = await api.get("/cart");

          setIsInCart(isProductInCart(response.data?.cart?.items || [], product));
        } else {
          setIsInCart(isProductInCart(readGuestCart(), product));
        }
      } catch (error) {
        console.error("Failed to check cart:", error);
        setCartPopup({
          show: true,
          type: "error",
          title: "Unable to check your cart.",
          message: "Please try again before adding this product.",
        });
      }
    };

    checkCart();
  }, [product, user]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchProduct = async () => {
      setLoading(true);
      setError("");

      try {
        const product = await getProductById(id, { signal: controller.signal });
        setProduct(product);
      } catch (requestError) {
        if (requestError.name !== "CanceledError" && requestError.code !== "ERR_CANCELED") {
          console.error("Failed to fetch product:", requestError);
          setError(
            requestError.response?.data?.message ||
            "Product could not be loaded. Please try again.",
          );
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchProduct();
    return () => controller.abort();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product || addingToCart) return;

    // Already in cart → don't add again
    if (isInCart) return;

    setAddingToCart(true);
    try {
      await addProductToCart(product, Boolean(user));
      setIsInCart(true);
    } catch (error) {
      console.error("Failed to add product to cart:", error);
      console.error("SERVER RESPONSE:", error.response?.data);
      setCartPopup({
        show: true,
        type: "error",
        title: "Unable to update cart.",
        message: "Please try again.",
      });
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <>
      <Navbar />
      {loading ? (
        <div className="">
          <div>
            < ProductSkeleton />
          </div>
        </div>
      ) : error ? (
        <div className="flex h-[70vh] items-center justify-center mt-30 text-center">
          <p className="text-3xl">{error}</p>
        </div>
      ) : (
        <main className="mx-auto mb-10 flex max-w-6xl flex-col gap-8 px-4 pt-60 sm:pt-56 lg:pt-55 md:flex-row">
          <div className="flex w-full items-center justify-center bg-gray-100 p-3 sm:p-6 md:w-1/2">
            <img width="400"
              height="400"
              src={product.images?.[1] || product.thumbnail}
              crossOrigin={getImageCrossOrigin(
                product.thumbnail || product.images?.[0],
              )}
              alt={product?.title || "Product image"}
              className="max-h-72 w-full object-contain sm:max-h-112"
            />
          </div>

          <div className="flex w-full flex-col gap-4 md:w-1/2">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
              {product.category}
            </p>
            <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-3xl font-bold text-gray-900">${product.price}</p>
            <p className="text-green-600">
              {product.discountPercentage ?? 0}% discount
            </p>
            <p className="text-gray-700">Rating: {product.rating || "4.0"}</p>
            <p className="text-gray-700">Stock: {product.stock ?? "Available"}</p>
            <div className="flex flex-wrap gap-3">
              {isInCart ? (
                <NavLink
                  to="/pages/cart"
                  className="w-full rounded-xl bg-green-700 px-5 py-3 text-center font-medium text-white transition-colors hover:bg-green-800 sm:w-auto"
                >
                  Go to Cart
                </NavLink>
              ) : (
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="w-full rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-60 sm:w-auto"
                >
                  Add to Cart
                </button>
              )}
              {user?.role === "user" && (
                <NavLink
                  to={`/pages/messages?productId=${product.id}`}
                  className="w-full rounded-xl border border-blue-600 px-5 py-3 text-center font-medium text-blue-700 transition-colors hover:bg-blue-50 sm:w-auto"
                >
                  Message seller
                </NavLink>
              )}
            </div>
          </div>
        </main>
      )}
      <Footer />
      <Popup
        show={cartPopup.show}
        type={cartPopup.type}
        title={cartPopup.title}
        message={cartPopup.message}
        onClose={() => setCartPopup((current) => ({ ...current, show: false }))}
      />
    </>
  );
};

export default ProductDetails;
