import { Swiper, SwiperSlide } from "swiper/react";
import { VITE_IMAGE_PATH_URL } from "../../../react-query/constants";
import { Autoplay, Navigation } from "swiper/modules";

const ServiceDetailsCarousel = ({ data }) => {
  return (
    <Swiper
      navigation={true} // Enables navigation arrows
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      modules={[Navigation, Autoplay]} // Attach Autoplay and Navigation
      className="serviceDetailCarousel"
    >
      {data.map((item: string) => (
        <SwiperSlide
          key={item}
          className="!bg-gray-200 bg-no-repeat bg-cover bg-center h-[350px]"
          style={{
            backgroundImage: `url(${VITE_IMAGE_PATH_URL}/service/${encodeURIComponent(item)})`,
          }}
        />
      ))}
    </Swiper>
  );
};

export default ServiceDetailsCarousel;
