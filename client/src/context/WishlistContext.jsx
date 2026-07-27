import {
  createContext,
  useCallback,
  useState,
  useEffect,
  useContext,
} from "react";

import axios from "axios";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(null);

  const fetchWishlist = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
      const response = await axios.get("http://localhost:8000/api/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWishlist(response.data.userWishlist);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  return (
    <WishlistContext.Provider value={{ wishlist, setWishlist, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  return useContext(WishlistContext);
};
