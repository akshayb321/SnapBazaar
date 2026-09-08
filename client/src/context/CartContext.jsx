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
        setCart(null);
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

  const clearCart = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setCart((prev) =>
          prev
            ? {
                ...prev,
                items: [],
              }
            : null,
        );
        return;
      }

      await axios.delete("http://localhost:8000/api/cart/clear", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCart((prev) =>
        prev
          ? {
              ...prev,
              items: [],
            }
          : null,
      );
    } catch (error) {
      console.log("Clear cart error:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        fetchCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
