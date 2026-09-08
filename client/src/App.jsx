import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import WishList from "./pages/WishList/WishList";
import Orders from "./pages/Orders/Orders";
import MainLayout from "./layouts/MainLayout/MainLayout";
import Profile from "./pages/Profile/Profile";
import Products from "./pages/Products/Products";
import Address from "./pages/Address/Address";
import ChangePass from "./pages/ChangePass/ChangePass";
import Checkout from "./pages/Checkout/Checkout";
import About from "./pages/About/About";
import ForgotPassword from "./pages/Auth/ForgotPassword";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "product/:id",
        element: <ProductDetails />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "orders",
        element: <Orders />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "wishlist",
        element: <WishList />,
      },
      {
        path: "address",
        element: <Address />,
      },
      {
        path: "changePass",
        element: <ChangePass />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "about",
        element: <About />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
