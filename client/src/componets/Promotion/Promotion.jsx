import React from "react";
import "./Promotion.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function PromoSection() {
  return (
    <section className="promo-section">
      {/* Left Slider */}
      <div className="promo-slider">
        <Swiper
          modules={[Pagination, Autoplay]}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          loop={true}
        >
          <SwiperSlide>
            <img
              src="https://assets.aboutamazon.com/dims4/default/f6f0887/2147483647/strip/false/crop/1280x720+0+0/resize/1280x720!/quality/90/?url=https%3A%2F%2Famazon-blogs-brightspot.s3.amazonaws.com%2F4b%2Fb3%2F4d4cb3ff46b8a5575290b4737e82%2Flaptop-banner.jpg"
              alt="banner2"
            />
          </SwiperSlide>

          <SwiperSlide>
            <img
              src="https://mir-s3-cdn-cf.behance.net/project_modules/max_3840_webp/34b5bf180145769.6505ae7623131.jpg"
              alt="Banner 2"
            />
          </SwiperSlide>
        </Swiper>
      </div>

      {/* Right Side */}
      <div className="promo-right">
        <div className="promo-card">
          <img
            src="https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/c6175d59503015.5a251db6b8fc5.jpg"
            alt="Top Banner"
          />
        </div>

        <div className="promo-card">
          <img
            src="https://m.media-amazon.com/images/S/aplus-media-library-service-media/72dd3000-4b6b-413e-89a5-65b60799c17e.__CR0,0,970,600_PT0_SX970_V1___.png"
            alt="Bottom Banner"
          />
        </div>
      </div>
    </section>
  );
}

export default PromoSection;
