import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";

import Notfound from "./components/Notfound";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import Loader from "./components/Loader";

// Lazy-loaded pages
const Home = lazy(() => import("./pages/Home"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Address = lazy(() => import("./pages/Address"));
const Payment = lazy(() => import("./pages/Payment"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const Login = lazy(() => import("./pages/Login"));
const Profile = lazy(() => import("./pages/Profile"));

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/products/:id",
      element: <ProductDetails />,
    },
    {
      path: "/pages/cart",
      element: <Cart />,
    },
    {
      path: "/pages/checkout",
      element: (
        <ProtectedRoute>
          <Checkout />
        </ProtectedRoute>
      ),
    },
    {
      path: "/pages/address",
      element: (
        <ProtectedRoute>
          <Address />
        </ProtectedRoute>
      ),
    },
    {
      path: "/pages/payment",
      element: (
        <ProtectedRoute>
          <Payment />
        </ProtectedRoute>
      ),
    },
    {
      path: "/pages/order-success",
      element: (
        <ProtectedRoute>
          <OrderSuccess />
        </ProtectedRoute>
      ),
    },
    {
      path: "/pages/login",
      element: (
        <PublicOnlyRoute>
          <Login />
        </PublicOnlyRoute>
      ),
    },
    {
      path: "/pages/profile",
      element: (
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      ),
    },
    {
      path: "*",
      element: <Notfound />,
    },
  ]);

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
        </div>
      }
    >
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default App;
