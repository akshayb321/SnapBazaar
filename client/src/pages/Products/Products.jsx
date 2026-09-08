import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import ProductSection from "../../componets/ProductSection/ProductSection";
import FilterSidebar from "../../componets/FilterSidebar/FilterSidebar";
import { useFilter } from "../../context/FilterContext";
import { useLocation } from "react-router-dom";
import "./Products.css";

function Products() {
  const [products, setProducts] = useState([]);

  const { search, category, setSearch, setCategory } = useFilter();

  const location = useLocation();
  const previousPath = useRef(null);

  // =========================
  // FILTER STATES
  // =========================

  const [price, setPrice] = useState(100000);
  const [rating, setRating] = useState("");
  const [sortBy, setSortBy] = useState("recommended");

  // =========================
  // PAGINATION
  // =========================

  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 8;

  // =========================
  // FETCH PRODUCTS
  // =========================

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

  // =========================
  // RESET FILTERS WHEN SEARCHING
  // =========================
  // Search should work independently
  // from category, price and rating filters.

  useEffect(() => {
    if (search.trim() !== "") {
      setCategory("");
      setPrice(100000);
      setRating("");
      setSortBy("recommended");
      setCurrentPage(1);
    }
  }, [search]);

  // =========================
  // CLEAR ALL FILTERS
  // =========================

  const clearFilters = () => {
    setCategory("");
    setSearch("");
    setPrice(100000);
    setRating("");
    setSortBy("recommended");
    setCurrentPage(1);
  };

  // =========================
  // GET CATEGORIES
  // =========================

  const categories = [
    ...new Set(products.map((product) => product.category).filter(Boolean)),
  ];

  // =========================
  // FILTER PRODUCTS
  // =========================

  const filteredProducts = products
    .filter((product) => {
      // =========================
      // SEARCH
      // =========================

      const searchText = search.trim().toLowerCase();

      const productTitle = product.title?.toLowerCase().trim();

      const matchSearch =
        searchText === "" || productTitle?.includes(searchText);

      // =========================
      // CATEGORY
      // =========================

      const matchCategory =
        category === "" || category === "All" || product.category === category;

      // =========================
      // PRICE
      // =========================

      const productPrice = Number(product.price || 0);

      const matchPrice = productPrice <= Number(price);

      // =========================
      // RATING
      // =========================

      const productRating = Number(product.rating || 0);

      let matchRating = true;

      if (rating !== "") {
        const selectedRating = Number(rating);

        // 1 Star → 1.0 - 1.9
        if (selectedRating === 1) {
          matchRating = productRating >= 1 && productRating < 2;
        }

        // 2 Stars → 2.0 - 2.9
        else if (selectedRating === 2) {
          matchRating = productRating >= 2 && productRating < 3;
        }

        // 3 Stars → 3.0 - 3.9
        else if (selectedRating === 3) {
          matchRating = productRating >= 3 && productRating < 4;
        }

        // 4 Stars & Above
        else if (selectedRating === 4) {
          matchRating = productRating >= 4;
        }

        // Exactly 5 Stars
        else if (selectedRating === 5) {
          matchRating = productRating === 5;
        }
      }

      // =========================
      // FINAL FILTER RESULT
      // =========================

      return matchSearch && matchCategory && matchPrice && matchRating;
    })

    // =========================
    // SORT PRODUCTS
    // =========================

    .sort((a, b) => {
      // Price Low → High
      if (sortBy === "price-low") {
        return Number(a.price || 0) - Number(b.price || 0);
      }

      // Price High → Low
      if (sortBy === "price-high") {
        return Number(b.price || 0) - Number(a.price || 0);
      }

      // Name A → Z
      if (sortBy === "name-asc") {
        return (a.title || "").localeCompare(b.title || "");
      }

      // Name Z → A
      if (sortBy === "name-desc") {
        return (b.title || "").localeCompare(a.title || "");
      }

      // Newest
      if (sortBy === "newest") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }

      // Recommended
      return 0;
    });

  // =========================
  // PAGINATION LOGIC
  // =========================

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const startIndex = (currentPage - 1) * productsPerPage;

  const endIndex = startIndex + productsPerPage;

  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // =========================
  // SAFETY
  // =========================
  // If filtering/searching makes the current
  // page invalid, automatically go to page 1.

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  // =========================
  // PAGINATION BUTTONS
  // =========================

  const handlePageChange = (page) => {
    setCurrentPage(page);

    // Scroll to top of products section
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="products-page">
      <div className="products-layout">
        {/* =========================
            FILTER SIDEBAR
        ========================= */}

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

        {/* =========================
            PRODUCTS CONTENT
        ========================= */}

        <div className="products-content">
          {/* =========================
              PRODUCTS TOOLBAR
          ========================= */}

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
            </div>

            {/* =========================
                SORT
            ========================= */}

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

          {/* =========================
              PRODUCTS
          ========================= */}

          <ProductSection
            products={currentProducts}
            limit={currentProducts.length}
            className="product-page-items"
          />

          {/* =========================
              PAGINATION
          ========================= */}

          {totalPages > 1 && (
            <div className="pagination">
              {/* PREVIOUS */}

              <button
                type="button"
                className="pagination-arrow"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                ‹
              </button>

              {/* PAGE NUMBERS */}
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
              {/* NEXT */}

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
