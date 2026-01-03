import { Link } from "react-router-dom";

const ListingBanner = () => {
  return (
    <div className="w-full h-[240px] bg-accent p-4 flex justify-center items-center bg-hero-background bg-cover bg-center flex-col">
      <div className="breadcrumbs max-w-xs text-sm text-white">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>Services Listing</li>
        </ul>
      </div>
    </div>
  );
};

export default ListingBanner;
