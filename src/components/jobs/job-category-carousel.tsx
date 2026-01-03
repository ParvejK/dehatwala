import { Pagination, Autoplay  } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { JobSliderProps } from "../../types";

const JobCategoryCarousel = ({ sliders }: JobSliderProps) => {
  return (
    <Swiper
      pagination={{
        dynamicBullets: true,
      }}
      autoplay={{
        delay: 3000,         // 3 seconds per slide
        disableOnInteraction: false, // keeps autoplay after user interaction
      }}
      modules={[Pagination, Autoplay]}   // Include Autoplay module
      loop={true}                         // Optional: make it infinite
      className="mySwiper"
    >
      {sliders.map((item) => (
        <SwiperSlide key={item.id}>
          <div
            style={{ backgroundImage: `url(${item.image_link})` }}
            className="bg-cover bg-center bg-no-repeat h-[300px]"
          >
            <div className="flex flex-col justify-center items-center h-full p-4">
              <h3 className="text-lg font-medium">{item.title} B</h3>
              <h3 className="text-base font-normal">{item.tagline} A</h3>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default JobCategoryCarousel;
