import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Notfound from "./components/Notfound";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Address from "./pages/Address";
import Payment from "./pages/Payment";
import OrderSuccess from "./pages/OrderSuccess";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";


const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <div>
          <Home />
        </div>
      ),
    },
    {
      path: "/products/:id",
      element: (
        <div>
          <ProductDetails />
        </div>
      ),
    },
    {
      path: "/pages/cart",
      element: (
        <div>
          <Cart />
        </div>
      ),
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
    <>
      <div>
        <RouterProvider router={router} />
      </div>
    </>
  );
};

export default App;
