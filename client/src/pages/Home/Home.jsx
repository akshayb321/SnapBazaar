import React, { useEffect, useState } from "react";
import "./Home.css";
import Header from "../../componets/Header/Header";
import Hero from "../../componets/Hero/Hero";
import ProductSection from "../../componets/ProductSection/ProductSection";
import axios from "axios";
import Special from "../../componets/Special/Special";

function Home() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get("http://localhost:8000/api/products");

      setProducts(response.data.products);
    };
    fetchProducts();
  }, []);

  const featuredProducts = products.filter(
    (product) => product.tag === "featured",
  );

  const latestProducts = products.filter((product) => product.tag === "none");

  const popularProducts = products.filter((product) => product.tag === "none");
  return (
    <div className="home">
      <Header />

      <Hero />

      <ProductSection title="Popular Products" products={popularProducts} />
      <Special />
      <ProductSection title="latest Products" products={latestProducts} />
    </div>
  );
}

export default Home;
