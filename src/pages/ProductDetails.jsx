import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink, useParams } from "react-router-dom";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import Popup from "../components/Popup";
import manualCategoryProducts from "../data/manualCategoryProducts";
import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

const normalizeCart = (cart) => cart.reduce((normalized, cartItem) => {
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

const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [popup, setPopup] = useState({ show: false, type: "success", title: "Added to Cart", message: "Added to Cart" });
  const [addingToCart, setAddingToCart] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const checkCart = async () => {
      if (!product) return;

      try {
        if (user) {
          const response = await api.get("/cart");

          const cartItems = response.data?.cart?.items || [];

          const exists = cartItems.some(
            (item) => String(item.productId) === String(product.id)
          );

          setIsInCart(exists);
        } else {
          const storedCart = JSON.parse(
            localStorage.getItem("Products") || "[]"
          );

          const cartItems = normalizeCart(storedCart);

          const exists = cartItems.some(
            (item) =>
              String(item.id ?? item.productId ?? item.btn_id) ===
              String(product.id)
          );

          setIsInCart(exists);
        }
      } catch (error) {
        console.error("Failed to check cart:", error);
      }
    };

    checkCart();
  }, [product, user]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");

      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const productsUrl = baseUrl.replace(/\/search\/?$/, "");
        const response = await axios.get(`${productsUrl}/${id}`);
        setProduct(response.data);
      } catch {
        const manualProduct = manualCategoryProducts.find(
          (item) => String(item.id) === String(id),
        );

        if (manualProduct) {
          setProduct(manualProduct);
        } else {
          setError("Product could not be loaded.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product || addingToCart) return;

    // Already in cart → don't add again
    if (isInCart) return;

    if (user) {
      setAddingToCart(true);

      try {
        await api.post("/cart", {
          productId: product.id,
          title: product.title,
          price: product.price,
          image: product.thumbnail || product.images?.[0],
          quantity: 1,
        });

        setIsInCart(true);

        setPopup({
          show: true,
          type: "success",
          title: "Added to cart",
          message: "Added to cart",
        });
      } catch {
        setPopup({
          show: true,
          type: "error",
          title: "Unable to update cart.",
          message: "Unable to update cart.",
        });
      } finally {
        setAddingToCart(false);
      }

      return;
    }

    const currentCart = normalizeCart(
      JSON.parse(localStorage.getItem("Products") || "[]")
    );

    const existingItem = currentCart.find(
      (item) => String(item.id) === String(product.id)
    );

    if (existingItem) {
      setIsInCart(true);
      return;
    }

    const updatedCart = [
      ...currentCart,
      {
        ...product,
        btn_id: product.id,
        quantity: 1,
      },
    ];

    localStorage.setItem("Products", JSON.stringify(updatedCart));

    setIsInCart(true);

    setPopup({
      show: true,
      type: "success",
      title: "Added to Cart",
      message: "Added to Cart",
    });
  };

  return (
    <>
      <Navbar />
      {loading ? (
        <div className="flex h-[94vh] items-center justify-center">
          <Loader />
        </div>
      ) : error ? (
        <div className="flex h-[70vh] items-center justify-center mt-30 text-center">
          <p className="text-3xl">{error}</p>
        </div>
      ) : (
        <main className="mx-auto mb-10 flex max-w-6xl flex-col gap-8 px-4 pt-60 sm:pt-56 lg:pt-55 md:flex-row">
          <div className="flex w-full items-center justify-center bg-gray-100 p-3 sm:p-6 md:w-1/2">
            <img
              src={product.images?.[0] || product.thumbnail}
              alt={product.title}
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
                  className="w-full rounded-xl bg-green-600 px-5 py-3 text-center font-medium text-white transition-colors hover:bg-green-700 sm:w-auto"
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
            </div>
          </div>
        </main>
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

export default ProductDetails;
