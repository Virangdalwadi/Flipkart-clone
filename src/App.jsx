import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Notfound from "./components/Notfound";
import Cart from "./pages/Cart";
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
      path: "/pages/profile",
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
