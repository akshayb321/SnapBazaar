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

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
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
        element: <products />,
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
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
