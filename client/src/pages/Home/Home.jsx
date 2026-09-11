import React, { useEffect, useState } from "react";
import "./Home.css";
import Hero from "../../componets/Hero/Hero";
import ProductSection from "../../componets/ProductSection/ProductSection";
import axios from "axios";
import Special from "../../componets/Special/Special";
import Special2 from "../../componets/Special/Special2/Special2";
import Promotion from "../../componets/Promotion/Promotion";
import API_URL from "../../config/api.js";

function Home() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");

  const categories = [
    "All",
    "Fashion",
    "Bags",
    "Footwear",
    "Groceries",
    "Wellness",
    "Jewellery",
    "Beauty",
    "Electronics",
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/products`);

        setProducts(response.data.products);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

  // Popular Products
  const popularProducts =
    category === "All"
      ? products.filter((product) => product.tag === "popular")
      : products.filter((product) => product.category === category);

  // Latest Products
  const latestProducts = products.filter((product) => product.tag === "latest");

  // Featured Products
  const featuredProducts = products.filter(
    (product) => product.tag === "featured",
  );

  return (
    <div className="home">
      <Hero />

      <ProductSection
        title="Popular Products"
        products={popularProducts}
        showCategories={true}
        categories={categories}
        selectedCategory={category}
        setSelectedCategory={setCategory}
        limit={6}
        showViewAll={true}
      />

      <Promotion />

      <Special />

      <ProductSection
        title="Latest Products"
        products={latestProducts}
        limit={6}
        showViewAll={true}
      />

      <ProductSection
        title="Featured Products"
        products={featuredProducts}
        limit={6}
        showViewAll={true}
      />

      <Special2 />
    </div>
  );
}

export default Home;
