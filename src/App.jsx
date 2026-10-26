import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";

import Notfound from "./components/Notfound";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import Loader from "./components/Loader";

const Home = lazy(() => import("./pages/Home"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Address = lazy(() => import("./pages/Address"));
const Payment = lazy(() => import("./pages/Payment"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const Login = lazy(() => import("./pages/Login"));
const Profile = lazy(() => import("./pages/Profile"));
const AdminDashboard = lazy(() => import("./admin/pages/Dashboard"));
const AdminProducts = lazy(() => import("./admin/pages/Products"));
const AdminUsers = lazy(() => import("./admin/pages/Users"));
const DashboardLayout = lazy(() => import("./admin/components/DashboardLayout"));
const SellerMessages = lazy(() => import("./admin/pages/Messages"));

const requireAdmin = (element) => (
  <ProtectedRoute requiredRole="admin">{element}</ProtectedRoute>
);
const requireSeller = (element) => (
  <ProtectedRoute requiredRole="seller">{element}</ProtectedRoute>
);

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />
    },
    {
      path: "/products/:id",
      element: <ProductDetails />
    },
    {
      path: "/pages/cart",
      element: <Cart />
    },
    {
      path: "/pages/checkout",
      element: <ProtectedRoute><Checkout /></ProtectedRoute>,
    },
    {
      path: "/pages/address",
      element: <ProtectedRoute><Address /></ProtectedRoute>,
    },
    {
      path: "/pages/payment",
      element: <ProtectedRoute><Payment /></ProtectedRoute>,
    },
    {
      path: "/pages/order-success",
      element: <ProtectedRoute><OrderSuccess /></ProtectedRoute>,
    },
    {
      path: "/pages/login",
      element: <PublicOnlyRoute><Login /></PublicOnlyRoute>,
    },
    {
      path: "/pages/profile",
      element: <ProtectedRoute><Profile /></ProtectedRoute>,
    },
    {
      path: "/admin",
      element: requireAdmin(<DashboardLayout />),
      children: [
        { index: true, element: <AdminDashboard /> },
        { path: "products", element: <AdminProducts /> },
        { path: "users", element: <AdminUsers /> },
      ],
    },
    {
      path: "/seller",
      element: requireSeller(<DashboardLayout />),
      children: [
        { index: true, element: <AdminDashboard /> },
        { path: "products", element: <AdminProducts /> },
        { path: "messages", element: <SellerMessages /> },
      ],
    },
    {
      path: "/pages/messages",
      element: <ProtectedRoute requiredRole="user"><SellerMessages /></ProtectedRoute>,
    },
    {
      path: "/pages/Products",
      element: requireAdmin(<Navigate to="/admin/products" replace />),
    },
    {
      path: "/pages/Users",
      element: requireAdmin(<Navigate to="/admin/users" replace />),
    },
    { path: "*", element: <Notfound /> },
  ]);

  return (
    <Suspense fallback={<Loader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default App;
