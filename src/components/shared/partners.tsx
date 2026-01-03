import Container from "./container";
import HeadingPrimary from "../typography/heading-primary";
import { useFetchPartners } from "../../react-query/hooks";
import { VITE_IMAGE_PATH_URL } from "../../react-query/constants";

const Partners = () => {
  const { data, isError, isLoading } = useFetchPartners();
  if (isError) {
    return <p>Oops something went wrong...</p>;
  }
  if (isLoading) {
    return (
      <Container className="mb-[100px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex w-52 flex-col gap-4">
              <div className="flex items-center gap-4" key={index}>
                <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
                <div className="flex flex-col gap-4">
                  <div className="skeleton h-4 w-20"></div>
                  <div className="skeleton h-4 w-28"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    );
  }
  return (
    <div className="bg-accent py-8 mb-[100px]">
      <Container className="mb-[100px]">
        <HeadingPrimary className="mb-10 text-center">Our partners</HeadingPrimary>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {data.partners.map((partner) => (
            <div
              key={partner.id}
              className="w-full border bg-white rounded-lg flex justify-center items-center gap-5 py-6"
            >
              <img
                className="w-[62px] h-[48px] object-cover rounded-md"
                src={`${VITE_IMAGE_PATH_URL}/partner/${partner.logo}`}
                alt=""
              />
              <h3>{partner.name}</h3>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default Partners;
