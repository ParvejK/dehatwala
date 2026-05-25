import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import Container from "./container";
import HeadingPrimary from "../typography/heading-primary";
import { useFetchLabourTestimonials } from "../../react-query/hooks";
import { VITE_IMAGE_PATH_URL } from "../../react-query/constants";

const LabourTestimonials = () => {
  const { data, isError, isLoading } = useFetchLabourTestimonials();

  if (isError) {
    return <p>Oops something went wrong...</p>;
  }
  if (isLoading) {
    return (
      <Container className="my-[200px]">
        <div className="flex justify-center items-center">
          <div className="flex w-52 flex-col gap-4">
            <div className="flex items-center flex-col gap-4">
              <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
              <div className="flex flex-col gap-4">
                <div className="skeleton h-4 w-28"></div>
                <div className="skeleton h-4 w-[230px]"></div>
                <div className="skeleton h-4 w-[230px]"></div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <div className="bg-white py-[60px] border-t border-accent">
      <Container>
        <HeadingPrimary className="text-center mb-[50px]">What our labours say</HeadingPrimary>
        <div className="max-w-[500px] mx-auto">
          <Swiper
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{
              dynamicBullets: true,
            }}
            modules={[Pagination, Autoplay]}
            className="testimonialsCarousel"
          >
            {data.labour_testimonials.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="flex flex-col justify-center items-center text-center">
                  <img
                    src={`${VITE_IMAGE_PATH_URL}/labour_testimonials/${item.labour_image}`}
                    alt=""
                    className="w-[120px] h-[120px] rounded-full block mb-5 object-cover"
                  />
                  <article className="mb-10">
                    <h3 className="text-base leading-5 font-semibold text-primary mt-3">{item.name}</h3>
                    <small className="text-xs font-base text-gray-400 block mb-3">
                      {item.company}
                      {item.designation ? `, ${item.designation}` : ""}
                    </small>
                    <p className="text-xs font-normal">{item.content}</p>
                  </article>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Container>
    </div>
  );
};

export default LabourTestimonials;
