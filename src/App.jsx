import React, { Children } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import ProductDetails from "./pages/ProductDetails";
import { Link, Outlet } from "react-router-dom";
import Notfound from "./components/Notfound";
import Cart from "./pages/Cart";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Profile from "./pages/Profile";


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
      path: "/pages/productdetails",
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
      path: "/pages/login",
      element: (
        <div>
          <Login />
        </div>
      ),
    },
    {
      path: "/pages/Profile",
      element: (
        <div>
          <Profile />
        </div>
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
