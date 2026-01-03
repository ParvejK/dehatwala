import { useNavigate, useParams } from "react-router-dom";
import ServiceDetailsCarousel from "../../components/services/details/service-details-carousel";
import Container from "../../components/shared/container";
import UserRatingCard from "../../components/shared/user-rating-card";
import DOMPurify from "dompurify";
import { useServiceDetail } from "../../react-query/hooks";

interface Tag {
  value: string;
}

const ServicesDetailsPage = () => {
  const { slug } = useParams();
  const redirect = useNavigate();
  const { data: serviceDetailData, isLoading, isError } = useServiceDetail(slug);

  if (isError) return <p>Error</p>;
  if (isLoading)
    return (
      <div className="space-y-6 mb-10">
        <div className="skeleton h-[300px] w-full rounded-none" />
        <div className="space-y-6 container mx-auto px-4">
          <div className="skeleton h-[32px] w-[30%]" />
          <div className="skeleton h-[32px] w-[40%]" />
          <div className="skeleton h-[32px] w-[60%]" />
          <div className="skeleton h-[32px] w-[70%]" />
          <div className="skeleton h-[32px] w-full" />
          <div className="skeleton h-[32px] w-full" />
          <div className="skeleton h-[32px] w-full" />
          <div className="skeleton h-[32px] w-full" />
          <div className="skeleton h-[32px] w-full" />
        </div>
        <div className="space-y-6 container mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="skeleton h-16 w-16 shrink-0 rounded-full" />
            <div className="flex flex-col gap-4 flex-1">
              <div className="skeleton h-4 w-[60%]" />
              <div className="skeleton h-4 w-[70%]" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="skeleton h-16 w-16 shrink-0 rounded-full" />
            <div className="flex flex-col gap-4 flex-1">
              <div className="skeleton h-4 w-[60%]" />
              <div className="skeleton h-4 w-[70%]" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="skeleton h-16 w-16 shrink-0 rounded-full" />
            <div className="flex flex-col gap-4 flex-1">
              <div className="skeleton h-4 w-[60%]" />
              <div className="skeleton h-4 w-[70%]" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="skeleton h-16 w-16 shrink-0 rounded-full" />
            <div className="flex flex-col gap-4 flex-1">
              <div className="skeleton h-4 w-[60%]" />
              <div className="skeleton h-4 w-[70%]" />
            </div>
          </div>
        </div>
      </div>
    );

  const { service, instant_service, permanent_service } = serviceDetailData;

  const tags: Tag[] = JSON.parse(service.tags || "[]");

  return (
    <div>
      {service.slider_image.length > 0 ? (
        <ServiceDetailsCarousel data={service.slider_image} />
      ) : (
        <div className="!bg-accent bg-no-repeat bg-cover bg-center h-[300px] flex justify-center items-center">
          <h3 className="text-2xl font-bold">Service Details</h3>
        </div>
      )}
      <Container className="mb-[80px]">
        <div className="md:px-6 space-y-6 mb-6">
          <div className="mt-8">
            <h2 className="text-2xl font-semibold">{service.title}</h2>
            <div className="mt-2 flex items-center gap-5">
              <span className="text-sm text-primary font-normal">
                {new Date(service.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="bg-accent text-primary text-xs px-3 py-1 rounded-md ml-2">{service.category_name}</span>
            </div>
            <p className="mt-2">{service.short_description}</p>
          </div>
        </div>
        <div className="md:flex md:gap-6">
          <div className="flex-1 px-0 md:px-6 space-y-6">
            <div>
              <h2 className="font-semibold text-lg">Description</h2>
              <div
                className="mt-4 md:mt-10"
                dangerouslySetInnerHTML={{
                  __html: service.description ? DOMPurify.sanitize(service.description) : "<p>No content available</p>",
                }}
              />
            </div>
            <div className="my-8">
              <div>
                <strong className="text-sm">Tags:</strong>
                {tags.map((tag, index) => (
                  <span key={index} className="bg-accent text-primary text-xs px-3 py-1 rounded-md ml-2">
                    {tag.value}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-base font-semibold md:text-lg mn-2">Instant services notes</h3>
              <div className="space-y-3">
                <div
                  className="bg-gray-100 rounded-md px-3 py-2"
                  dangerouslySetInnerHTML={{
                    __html: instant_service.includes_instument
                      ? DOMPurify.sanitize(instant_service.includes_instument)
                      : "<p>No content available</p>",
                  }}
                />
                <div
                  className="bg-gray-100 rounded-md px-3 py-2"
                  dangerouslySetInnerHTML={{
                    __html: instant_service.excludes_instument
                      ? DOMPurify.sanitize(instant_service.excludes_instument)
                      : "<p>No content available</p>",
                  }}
                />
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-base font-semibold md:text-lg mb-2">Permanent services notes</h3>
              <div className="space-y-3">
                <div
                  className="bg-gray-100 rounded-md px-3 py-2"
                  dangerouslySetInnerHTML={{
                    __html: permanent_service.includes_instument
                      ? DOMPurify.sanitize(permanent_service.includes_instument)
                      : "<p>No content available</p>",
                  }}
                />
                <div
                  className="bg-gray-100 rounded-md px-3 py-2"
                  dangerouslySetInnerHTML={{
                    __html: permanent_service.excludes_instument
                      ? DOMPurify.sanitize(permanent_service.excludes_instument)
                      : "<p>No content available</p>",
                  }}
                />
              </div>
            </div>
            <div>
              <hr className="mb-6" />
            </div>
            <div>
              <h2 className="font-semibold text-lg mb-6 mt-[60px]">Customer Reviews</h2>
              <hr className="mb-6" />
              <div className="space-y-6">
                <UserRatingCard reviews={service.reviews} />
              </div>
            </div>
            <div>
              <div className="md:flex md:justify-between mt-[100px] space-y-6 md:space-y-0">
                <button
                  onClick={() => redirect(`/permanent-service/${service.id}`)}
                  className="btn btn-primary w-full md:w-auto capitalize"
                  disabled={service.is_permanent_service != 1}
                >
                  Get permanent Service
                </button>
                <button
                  onClick={() => redirect(`/instant-service/${service.id}`)}
                  className="btn btn-primary w-full md:w-auto capitalize"
                  disabled={service.is_instant_service != 1}
                >
                  Get Instant Service
                </button>
              </div>
            </div>
          </div>
          <div className="w-[210px] p-6 md:p-0">{/* <p>Ads Area</p> */}</div>
        </div>
      </Container>
    </div>
  );
};

export default ServicesDetailsPage;
