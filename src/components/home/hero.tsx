"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { useHeroCarousel } from "../../react-query/hooks";
import { VITE_IMAGE_PATH_URL } from "../../react-query/constants";
import { Autoplay } from "swiper/modules";

const Hero = () => {
  const { data, isLoading, error, isError } = useHeroCarousel();

  if (isError) {
    return (
      <header className="hero min-h-[50vh] bg-base-200 bg-no-repeat bg-center bg-cover bg-fixed">
        <div className="hero-content text-center">
          <p>Oops something went wrong, try again {error.message}</p>
        </div>
      </header>
    );
  }

  if (isLoading) {
    return <div className="skeleton h-[50vh] w-full rounded-none"></div>;
  }

  return (
    <header className="min-h-[50vh] bg-base-200">
      <Swiper
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[Autoplay]}
        className="heroSwiper h-[400px]"
      >
        {data.sliders.map((item) => {
          return (
            <SwiperSlide
              key={item.id}
              className="bg-no-repeat bg-center bg-cover"
              style={{ backgroundImage: `url(${VITE_IMAGE_PATH_URL}/slider/${item.slider_img})` }}
            >
              <div className="container mx-auto px-4 flex justify-center items-center h-full">
                <div className="max-w-[650px] text-white text-center">
                  <h1 className="text-5xl font-bold leading-[52px]">{item.title}</h1>
                  <p className="py-6 text-lg">{item.tagline}</p>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </header>
  );
};

export default Hero;
