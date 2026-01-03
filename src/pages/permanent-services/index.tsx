import { Link, useParams } from "react-router-dom";
import BookServicesForm from "../../components/services/book-service-form";
import Container from "../../components/shared/container";
import ServicesCarouselCard from "../../components/shared/services-carousel-card";
import { usePermanentServices } from "../../react-query/hooks";
import PermanentServiceLoading from "../../components/services/loader/permanent-service-loading";
import DOMPurify from "dompurify";

const PermanentServices = () => {
  const { id } = useParams();
  const { data, status } = usePermanentServices(parseInt(id));

  if (status === "error") {
    return <div className="min-h-screen flex justify-center items-center">Something went wrong try again</div>;
  }

  if (status === "pending") {
    return <PermanentServiceLoading />;
  }

  const { permanent_service } = data;
  return (
    <div>
      <Container className="my-10 min-h-[60vh]">
        <div className="breadcrumbs text-sm">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>Permanent Services</li>
          </ul>
        </div>
        <h2 className="text-[24px] font-semibold mt-4">Permanent Services</h2>
        <ServicesCarouselCard data={data.slider_slogans} />
        <div className="text-[24px] font-semibold mb-6">
          <BookServicesForm
            serviceId={data.permanent_service.service_id}
            permanentServiceId={data.permanent_service.id}
          />
        </div>
        <div className="mt-10">
          <h3 className="text-base font-semibold md:text-lg">Notes</h3>
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
        <div className="bg-accent p-6 rounded-md mt-10">
          <h2 className="text-xl md:text-[38px] font-semibold text-center mb-6">Customercare services</h2>
          <h2 className="text-base md:text-[24px] font-medium text-center">+00-8676767676767</h2>
          <div className="md:flex md:justify-center md:gap-5 space-y-3 md:space-y-0 mt-10">
            <div className="text-center md:text-left">
              <p className="italic text-sm font-semibold text-blue-600">WhatsApp</p>
              <p className="text-xs font-medium">+91-898989898999</p>
            </div>
            <div className="text-center md:text-left">
              <p className="italic text-sm font-semibold text-blue-600">Email</p>
              <p className="text-xs font-medium">+91-898989898999</p>
            </div>
            <div className="text-center md:text-left">
              <p className="italic text-sm font-semibold text-blue-600">Office</p>
              <p className="text-xs font-medium">+91-898989898999</p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default PermanentServices;
