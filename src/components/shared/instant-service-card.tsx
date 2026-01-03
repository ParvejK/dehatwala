import { Link } from "react-router-dom";
import RoadImage from "../../assets/images/road.jpg";

const ServiceCard = ({ title, message, buttonText }) => {
  return (
    <div className="min-h-[300px] bg-white border border-gray-200 rounded-lg flex flex-col">
      <div>
        <Link to="#">
          <img className="rounded-t-lg h-[100px] w-full object-cover" src={RoadImage} alt="" />
        </Link>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h2 className="mb-2 text-[18px] leading-7 font-semibold tracking-tight text-gray-900 ">{title}</h2>
        <p className="text-base mb-4">{message}</p>
        <button className="btn btn-sm mt-auto self-start">{buttonText}</button>
      </div>
    </div>
  );
};

export default ServiceCard;
