import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import ProductSection from "../../componets/ProductSection/ProductSection";
import FilterSidebar from "../../componets/FilterSidebar/FilterSidebar";
import { useFilter } from "../../context/FilterContext";
import { useLocation } from "react-router-dom";
import "./Products.css";
import API_URL from "../../config/api.js";

function Products() {
  const [products, setProducts] = useState([]);

  const { search, category, setSearch, setCategory } = useFilter();

  const location = useLocation();
  const previousPath = useRef(null);

  const [price, setPrice] = useState(100000);
  const [rating, setRating] = useState("");
  const [sortBy, setSortBy] = useState("recommended");

  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const productsPerPage = 8;

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products`);

      setProducts(response.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (search.trim() !== "") {
      setCategory("");
      setPrice(100000);
      setRating("");
      setSortBy("recommended");
      setCurrentPage(1);
    }
  }, [search]);

  const clearFilters = () => {
    setCategory("");
    setSearch("");
    setPrice(100000);
    setRating("");
    setSortBy("recommended");
    setCurrentPage(1);
  };

  const categories = [
    ...new Set(products.map((product) => product.category).filter(Boolean)),
  ];

  const filteredProducts = products
    .filter((product) => {
      const searchText = search.trim().toLowerCase();

      const productTitle = product.title?.toLowerCase().trim();

      const matchSearch =
        searchText === "" || productTitle?.includes(searchText);

      const matchCategory =
        category === "" || category === "All" || product.category === category;

      const productPrice = Number(product.price || 0);

      const matchPrice = productPrice <= Number(price);

      const productRating = Number(product.rating || 0);

      let matchRating = true;

      if (rating !== "") {
        const selectedRating = Number(rating);

        if (selectedRating === 1) {
          matchRating = productRating >= 1 && productRating < 2;
        } else if (selectedRating === 2) {
          matchRating = productRating >= 2 && productRating < 3;
        } else if (selectedRating === 3) {
          matchRating = productRating >= 3 && productRating < 4;
        } else if (selectedRating === 4) {
          matchRating = productRating >= 4;
        } else if (selectedRating === 5) {
          matchRating = productRating === 5;
        }
      }

      return matchSearch && matchCategory && matchPrice && matchRating;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") {
        return Number(a.price || 0) - Number(b.price || 0);
      }

      if (sortBy === "price-high") {
        return Number(b.price || 0) - Number(a.price || 0);
      }

      if (sortBy === "name-asc") {
        return (a.title || "").localeCompare(b.title || "");
      }

      if (sortBy === "name-desc") {
        return (b.title || "").localeCompare(a.title || "");
      }

      if (sortBy === "newest") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }

      return 0;
    });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const startIndex = (currentPage - 1) * productsPerPage;

  const endIndex = startIndex + productsPerPage;

  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const handlePageChange = (page) => {
    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="products-page">
      <div className="products-layout">
        <div
          className={`products-filter-wrapper ${
            showMobileFilter ? "mobile-filter-open" : ""
          }`}
        >
          <FilterSidebar
            categories={categories}
            selectedCategory={category}
            setSelectedCategory={setCategory}
            price={price}
            setPrice={setPrice}
            rating={rating}
            setRating={setRating}
            clearFilters={clearFilters}
          />
        </div>

        <div className="products-content">
          <div className="products-toolbar">
            <div className="toolbar-left">
              <button
                type="button"
                className="view-btn active"
                title="Grid View"
              >
                ▦
              </button>

              <span className="products-count">
                There are <strong>{filteredProducts.length}</strong> products.
              </span>

              <button
                type="button"
                className="mobile-filter-btn"
                onClick={() => setShowMobileFilter((prev) => !prev)}
              >
                <i className="fa-solid fa-sliders"></i>
                {showMobileFilter ? "Hide Filter" : "Add Filter"}
              </button>
            </div>

            <div className="toolbar-right">
              <span className="sort-label">Sort By</span>

              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="sort-select"
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
                <option value="name-asc">Name, A to Z</option>
                <option value="name-desc">Name, Z to A</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          <ProductSection
            products={currentProducts}
            limit={currentProducts.length}
            className="product-page-items"
          />

          {totalPages > 1 && (
            <div className="pagination">
              <button
                type="button"
                className="pagination-arrow"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                ‹
              </button>

              {Array.from(
                {
                  length: Math.min(3, totalPages),
                },
                (_, index) => {
                  let page;

                  if (totalPages <= 3) {
                    page = index + 1;
                  } else if (currentPage === 1) {
                    page = index + 1;
                  } else if (currentPage === totalPages) {
                    page = totalPages - 2 + index;
                  } else {
                    page = currentPage - 1 + index;
                  }

                  return (
                    <button
                      type="button"
                      key={page}
                      className={`pagination-btn ${
                        currentPage === page ? "active" : ""
                      }`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  );
                },
              )}

              <button
                type="button"
                className="pagination-arrow"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                ›
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;
