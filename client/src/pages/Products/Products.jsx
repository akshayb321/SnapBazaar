import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductSection from "../../componets/ProductSection/ProductSection";
import { useFilter } from "../../context/FilterContext";
import "./Products.css";
import { useLocation } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);
  const { search, category } = useFilter();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/products") {
      setSearch("");
    }
  }, [location.pathname]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/products");

      setProducts(response.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchCategory = category === "All" || product.category === category;

    const matchSearch = product.title
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  return (
    <div className="products-page">
      <ProductSection
        products={filteredProducts}
        limit={filteredProducts.length}
      />
    </div>
  );
}

export default Products;
