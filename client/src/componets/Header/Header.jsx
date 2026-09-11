import React, { useEffect, useState } from "react";
import AnnouncementBar from "../AnnouncementBar/AnnouncementBar";
import Navbar from "../Navbar/Navbar";
import CategoryBar from "../CategoryBar/CategoryBar";
import "./Header.css";

function Header({ search, setSearch, category, setCategory }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? "scrolled" : ""}`}>
      <AnnouncementBar isScrolled={isScrolled} />

      <Navbar
        isScrolled={isScrolled}
        search={search}
        setSearch={setSearch}
        onMenuClick={() => setIsCategoryOpen(true)}
      />

      <CategoryBar
        isScrolled={isScrolled}
        category={category}
        setCategory={setCategory}
        isCategoryOpen={isCategoryOpen}
        setIsCategoryOpen={setIsCategoryOpen}
      />
    </header>
  );
}

export default Header;
