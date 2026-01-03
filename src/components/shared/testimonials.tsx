import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import Container from "./container";
import ClientCard from "./client-card";
import HeadingPrimary from "../typography/heading-primary";
import { useFetchClients } from "../../react-query/hooks";

const Testimonials = () => {
  const { data, isError, isLoading } = useFetchClients();
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
        <HeadingPrimary className="text-center mb-[50px]">What our client says</HeadingPrimary>
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
            {data.clients.map((client) => (
              <SwiperSlide key={client.id}>
                <ClientCard data={client} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Container>
    </div>
  );
};

export default Testimonials;
