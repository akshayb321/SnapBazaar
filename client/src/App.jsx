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
import Checkout from "./pages/Checkout/Checkout";
import About from "./pages/About/About";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import AdminLogin from "./pages/Admin/Auth/AdminLogin";
import AdminDashboard from "./pages/Admin/Dashboard/AdminDashboard";
import AdminLayout from "./layouts/AdminLayout/AdminLayout";
import AdminOrders from "./pages/Admin/Orders/AdminOrders";
import AdminOrderDetails from "./pages/Admin/Orders/AdminOrderDetails";
import AdminProducts from "./pages/Admin/Products/AdminProducts";
import AdminProductAdd from "./pages/Admin/Products/AdminProductAdd";

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
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },

  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "orders",
        element: <AdminOrders />,
      },
      {
        path: "orders/:id",
        element: <AdminOrderDetails />,
      },
      {
        path: "products",
        element: <AdminProducts />,
      },
      {
        path: "products/add",
        element: <AdminProductAdd />,
      },
      {
        path: "products/edit/:id",
        element: <AdminProductAdd />,
      },
    ],
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
