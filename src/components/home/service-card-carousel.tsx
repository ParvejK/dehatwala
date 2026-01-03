import { Swiper, SwiperSlide } from "swiper/react";
import ServiceCard from "../shared/instant-service-card";

import { Autoplay, FreeMode, Pagination, Navigation } from "swiper/modules";

const ServiceCardCarousel = () => {
  return (
    <Swiper
      slidesPerView={4}
      spaceBetween={16}
      freeMode={true}
      navigation={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      modules={[FreeMode, Pagination, Autoplay, Navigation]}
      className="mySwiper"
    >
      <SwiperSlide>
        <ServiceCard
          title="Banner Title"
          message="Get instant Helper and mason in just 30 min"
          buttonText="Get Service"
        />
      </SwiperSlide>
      <SwiperSlide>
        <ServiceCard
          title="Banner Title"
          message="No more delay in casting work. Get instant RMC workers"
          buttonText="Get Service"
        />
      </SwiperSlide>
      <SwiperSlide>
        <ServiceCard
          title="Banner Title"
          message="Site pe permanent manpower chahiye? Tension mat lo, Pehalsala hai na!!"
          buttonText="Request For Service"
        />
      </SwiperSlide>
      <SwiperSlide>
        <ServiceCard
          title="Banner Title"
          message="Guaranteed instant loading unloading workers at your door step"
          buttonText="Get Service"
        />
      </SwiperSlide>
      <SwiperSlide>
        <ServiceCard
          title="Banner Title"
          message="Save your time and picking and dropping charges for binding. Instant steel binder."
          buttonText="Get Service"
        />
      </SwiperSlide>
      <SwiperSlide>
        <ServiceCard title="Banner Title" message="विभिन्न प्रकार के मज़दूर के लिए हमसे जुड़ें" buttonText="Join us" />
      </SwiperSlide>
    </Swiper>
  );
};

export default ServiceCardCarousel;
