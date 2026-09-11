import "./Hero.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useNavigate } from "react-router-dom";
import { useFilter } from "../../context/FilterContext";

function Hero() {
  const banners = [
    {
      image:
        "https://res.cloudinary.com/jwqnivpq/image/upload/v1784634302/mensBanner.png",
      category: "Fashion",
    },
    {
      image:
        "https://res.cloudinary.com/jwqnivpq/image/upload/v1784634434/bannerHome.png",
      category: "All",
    },
    {
      image:
        "https://res.cloudinary.com/jwqnivpq/image/upload/v1784634643/electronicsBanner.png",
      category: "Electronics",
    },
    {
      image:
        "https://res.cloudinary.com/jwqnivpq/image/upload/v1784634485/groceryBanner.png",
      category: "Groceries",
    },
  ];
  const navigate = useNavigate();
  const { setCategory } = useFilter();

  return (
    <>
      <section className="hero">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          loop={true}
          className="hero-swiper"
        >
          {banners.map((banner, index) => (
            <SwiperSlide key={index}>
              <div
                className="banner-click"
                onClick={() => {
                  setCategory(banner.category);
                  navigate("/products");
                }}
              >
                <img src={banner.image} alt={`Banner ${index + 1}`} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <div className="category-hero">
        <div
          onClick={() => {
            setCategory("Fashion");
            navigate("/products");
          }}
        >
          <img
            src="https://res.cloudinary.com/jwqnivpq/image/upload/v1784637017/suit.png"
            alt="Fashion"
          />
          <p>Fashion</p>
        </div>

        <div
          onClick={() => {
            setCategory("Bags");
            navigate("/products");
          }}
        >
          <img
            src="https://res.cloudinary.com/jwqnivpq/image/upload/v1784637014/school-bag.png"
            alt="Bags"
          />
          <p>Bags</p>
        </div>

        <div
          onClick={() => {
            setCategory("Footwear");
            navigate("/products");
          }}
        >
          <img
            src="https://res.cloudinary.com/jwqnivpq/image/upload/v1784637019/sneakers.png"
            alt="Footwear"
          />
          <p>Footwear</p>
        </div>

        <div
          onClick={() => {
            setCategory("Groceries");
            navigate("/products");
          }}
        >
          <img
            src="https://res.cloudinary.com/jwqnivpq/image/upload/v1784637015/basket.png"
            alt="Groceries"
          />
          <p>Groceries</p>
        </div>

        <div
          onClick={() => {
            setCategory("Wellness");
            navigate("/products");
          }}
        >
          <img
            src="https://res.cloudinary.com/jwqnivpq/image/upload/v1784637016/meditation.png"
            alt="Wellness"
          />
          <p>Wellness</p>
        </div>

        <div
          onClick={() => {
            setCategory("Jewellery");
            navigate("/products");
          }}
        >
          <img
            src="https://res.cloudinary.com/jwqnivpq/image/upload/v1784637013/jewelry.png"
            alt="Jewellery"
          />
          <p>Jewellery</p>
        </div>

        <div
          onClick={() => {
            setCategory("Beauty");
            navigate("/products");
          }}
        >
          <img
            src="https://res.cloudinary.com/jwqnivpq/image/upload/v1784637385/makeup.png"
            alt="Beauty"
          />
          <p>Beauty</p>
        </div>

        <div
          onClick={() => {
            setCategory("Electronics");
            navigate("/products");
          }}
        >
          <img
            src="https://res.cloudinary.com/jwqnivpq/image/upload/v1784637013/gadgets.png"
            alt="Electronics"
          />
          <p>Electronics</p>
        </div>
      </div>
    </>
  );
}

export default Hero;
