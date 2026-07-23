import React, { useEffect, useState } from "react";
import "./Home.css";
import Header from "../../componets/Header/Header";
import Hero from "../../componets/Hero/Hero";
import ProductSection from "../../componets/ProductSection/ProductSection";
import axios from "axios";
import Special from "../../componets/Special/Special";
import Special2 from "../../componets/Special/Special2/Special2";
import Footer from "../../componets/Footer/Footer";
import Promotion from "../../componets/Promotion/Promotion";

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
        const response = await axios.get("http://localhost:8000/api/products");

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

  const latestProducts = products.filter((product) => product.tag === "none");

  const popularProducts = products.filter((product) => product.tag === "none");
  return (
    <div className="home">
      <Header />

      <Hero />

      <ProductSection
        title="Popular Products"
        products={popularProducts}
        showCategories={true}
        categories={categories}
        selectedCategory={category}
        setSelectedCategory={setCategory}
      />

      <Promotion />

      <Special />

      <ProductSection title="Latest Products" products={latestProducts} />

      <ProductSection title="Featured Products" products={featuredProducts} />

      <Special2 />

      <Footer />
    </div>
  );
}

export default Home;
