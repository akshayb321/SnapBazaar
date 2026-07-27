import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);

  const fetchCart = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
      const response = await axios.get("http://localhost:8000/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCart(response.data.userCart);
    } catch (error) {
      console.log(error);
    }
  }, []);
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <CartContext.Provider value={{ cart, setCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
