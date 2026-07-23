import "./Hero.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

function Hero() {
  const banners = [
    "https://res.cloudinary.com/jwqnivpq/image/upload/v1784634302/mensBanner.png",
    "https://res.cloudinary.com/jwqnivpq/image/upload/v1784634434/bannerHome.png",
    "https://res.cloudinary.com/jwqnivpq/image/upload/v1784634643/electronicsBanner.png",
    "https://res.cloudinary.com/jwqnivpq/image/upload/v1784634485/groceryBanner.png",
  ];

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
              <img src={banner} alt={`Banner ${index + 1}`} />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <div className="category-hero">
        <div>
          <img
            src="https://res.cloudinary.com/jwqnivpq/image/upload/v1784637017/suit.png"
            alt="Fashion"
          />
          <p>Fashion</p>
        </div>

        <div>
          <img
            src="https://res.cloudinary.com/jwqnivpq/image/upload/v1784637014/school-bag.png"
            alt="Bags"
          />
          <p>Bags</p>
        </div>

        <div>
          <img
            src="https://res.cloudinary.com/jwqnivpq/image/upload/v1784637019/sneakers.png"
            alt="Footwear"
          />
          <p>Footwear</p>
        </div>

        <div>
          <img
            src="https://res.cloudinary.com/jwqnivpq/image/upload/v1784637015/basket.png"
            alt="Groceries"
          />
          <p>Groceries</p>
        </div>

        <div>
          <img
            src="https://res.cloudinary.com/jwqnivpq/image/upload/v1784637016/meditation.png"
            alt="Wellness"
          />
          <p>Wellness</p>
        </div>

        <div>
          <img
            src="https://res.cloudinary.com/jwqnivpq/image/upload/v1784637013/jewelry.png"
            alt="Jewellery"
          />
          <p>Jewellery</p>
        </div>

        <div>
          <img
            src="https://res.cloudinary.com/jwqnivpq/image/upload/v1784637385/makeup.png"
            alt="Beauty"
          />
          <p>Beauty</p>
        </div>

        <div>
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
