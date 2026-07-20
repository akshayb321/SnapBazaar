import "./Hero.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

function Hero() {
  const banners = [
    "https://classyshop-server.advanceuitechniques.com/download/1782903826918_NewProject(11).jpg",
    "https://classyshop-server.advanceuitechniques.com/download/1782903801050_NewProject(8).jpg",
    "https://classyshop-server.advanceuitechniques.com/download/1782903771274_NewProject(6).jpg",
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
            src="https://classyshop-server.advanceuitechniques.com/download/1783055942833_file_1734525204708_fash.png"
            alt="Fashion"
          />
          <p>Fashion</p>
        </div>

        <div>
          <img
            src="https://classyshop-server.advanceuitechniques.com/download/1783056003682_file_1734525231018_bag.png"
            alt="Bags"
          />
          <p>Bags</p>
        </div>

        <div>
          <img
            src="https://classyshop-server.advanceuitechniques.com/download/1783056034254_file_1734525239704_foot.png"
            alt="Footwear"
          />
          <p>Footwear</p>
        </div>

        <div>
          <img
            src="https://classyshop-server.advanceuitechniques.com/download/1783056054463_file_1734525248057_gro.png"
            alt="Groceries"
          />
          <p>Groceries</p>
        </div>

        <div>
          <img
            src="https://classyshop-server.advanceuitechniques.com/download/1783056090735_file_1734525275367_well.png"
            alt="Wellness"
          />
          <p>Wellness</p>
        </div>

        <div>
          <img
            src="https://classyshop-server.advanceuitechniques.com/download/1783056106515_file_1734525286186_jw.png"
            alt="Jewellery"
          />
          <p>Jewellery</p>
        </div>

        <div>
          <img
            src="https://classyshop-server.advanceuitechniques.com/download/1783056142957_file_1734525255799_beauty_(1).png"
            alt="Beauty"
          />
          <p>Beauty</p>
        </div>

        <div>
          <img
            src="https://classyshop-server.advanceuitechniques.com/download/1783147651856_ele.png"
            alt="Electronics"
          />
          <p>Electronics</p>
        </div>
      </div>
    </>
  );
}

export default Hero;
