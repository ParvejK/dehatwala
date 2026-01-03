import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Service } from "../../types";
import { VITE_IMAGE_PATH_URL } from "../../react-query/constants";
import ServiceRating from "../shared/service-rating";

const ListingCard = ({ data }: { data: Service }) => {
  return (
    <div className="card card-side bg-base-100 shadow-xl">
      <figure>
        <Link to={`/services-detail/${data.slug}`}>
          <img
            className="w-[150px] h-full object-cover"
            src={`${VITE_IMAGE_PATH_URL}/service/${data.service_image}`}
            alt="Movie"
          />
        </Link>
      </figure>
      <div className="card-body p-4 space-y-4">
        <div className="flex flex-wrap justify-between">
          <div>
            <Link to={`/services-detail/${data.slug}`}>
              <h2 className="card-title text-sm md:text-base font-bold">{data.title}</h2>
            </Link>
            <div className="mb-2 flex justify-between items-center">
              <span className="text-xs bg-accent text-primary py-[2px] leading-4 px-2 rounded-md">
                {data.category_name}
              </span>
            </div>
            <p className="text-xs md:text-sm">{data.short_description}</p>
          </div>
          <div className="flex items-center md:flex-col gap-1 mt-2 lg:mt-0">
            <div className="badge">
              <Calendar size={12} className="text-primary" />{" "}
              <span className="pl-2 text-[10px] md:text-xs">
                {new Date(data.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            {/* <div className="badge">
              <p className="flex items-center gap-1">
                <MapPin size={12} className="text-primary" />{" "}
                <span className="text-[10px] md:text-xs">45, Street Delhi</span>
              </p>
            </div> */}
          </div>
        </div>
        <div className="card-actions justify-between items-center">
          <div className="space-y-1">
            <ServiceRating reviews={data.reviews} rating={data.rating} />
          </div>
          <Link to={`/services-detail/${data.slug}`}>
            <button className="btn btn-sm btn-primary font-medium">View Details</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
