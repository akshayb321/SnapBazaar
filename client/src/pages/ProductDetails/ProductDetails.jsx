import React, { useEffect, useState } from "react";
import "./ProductDetails.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import toast from "react-hot-toast";
import ProductSection from "../../componets/ProductSection/ProductSection";
function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");

  const { fetchCart } = useCart();
  const { wishlist, fetchWishlist } = useWishlist();
  const isWishlisted = wishlist?.items?.some(
    (item) => item.productId?._id === product?._id,
  );
  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:8000/api/cart/add",
        {
          productId: product._id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await fetchCart();

      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleAddToWishlist = async () => {
    if (isWishlisted) return;

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:8000/api/wishlist/add",
        {
          productId: product._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await fetchWishlist();

      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  const fetchProducts = async (category) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/products?category=${category}`,
      );

      setProducts(response.data.products);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/products/${id}`,
      );

      setProduct(response.data.product);
      setSelectedImage(response.data.product.image[0]);
      fetchProducts(response.data.product.category);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (!product) {
    return <h2 className="pd-loading">Loading...</h2>;
  }

  return (
    <section className="pd-page">
      <div className="pd-container">
        {/* LEFT SIDE */}
        <div className="pd-left">
          <div className="pd-images">
            <div className="pd-thumbnails">
              {product.image.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={product.title}
                  className={selectedImage === img ? "pd-active-thumb" : ""}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>

            <div className="pd-main-image">
              <img
                key={selectedImage}
                className="pd-main-img"
                src={selectedImage}
                alt={product.title}
              />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}

        <div className="pd-info">
          <h1 className="pd-title">{product.title}</h1>

          {/* Brand & Rating */}
          <div className="pd-rating-row">
            <span className="pd-brand">
              <strong>Brand:</strong> {product.brand}
            </span>

            <span className="pd-stars">★★★★☆</span>

            <span className="pd-review">(1,294 Reviews)</span>
          </div>

          {/* Price */}
          <div className="pd-price-section">
            <span className="pd-old-price">₹{product.oldPrice}</span>

            <span className="pd-price">₹{product.price}</span>

            <div className="pd-stock">
              <span> Available In Stock:</span>
              <span className="pd-stock1"> {product.stock} Items</span>
            </div>
          </div>

          {/* Description */}
          <p className="pd-description">
            Experience premium quality and modern design with this product,
            crafted for everyday comfort, durability, and style. Made from
            high-quality materials with attention to detail, it offers reliable
            performance and a sleek finish. Whether for daily use or special
            occasions, this product combines functionality and elegance to suit
            your lifestyle.
          </p>

          {/* Delivery */}
          <div className="pd-delivery">
            <p> Free Shipping (Estimated Delivery: 2–5 Days)</p>
          </div>

          {/* Buttons */}

          <div className="pd-action-buttons">
            <button className="pd-cart-btn" onClick={handleAddToCart}>
              <i className="fa-solid fa-cart-shopping"></i>
              Add To Cart
            </button>

            <div
              className={`pd-wishlist ${isWishlisted ? "active" : ""}`}
              onClick={handleAddToWishlist}
            >
              <i
                className={
                  isWishlisted ? "fa-solid fa-heart" : "fa-regular fa-heart"
                }
              ></i>

              <span>{isWishlisted ? "Wishlisted" : "Add to Wishlist"}</span>
            </div>
          </div>
        </div>
      </div>
      <ProductSection title="Related Products" products={products} />
    </section>
  );
}

export default ProductDetails;
