import { Link } from "react-router-dom";
import { useSubCategories } from "../../react-query/hooks";
import { VITE_IMAGE_PATH_URL } from "../../react-query/constants";
import SubCategoryLoading from "./loader/sub-category-loading";

const ServicesListingCard = ({ categoryId }: { categoryId: number }) => {
  const { data, status } = useSubCategories(categoryId);

  if (status === "pending") {
    return <SubCategoryLoading />;
  }

  if (status === "error") {
    return <p>Error something went wrong!</p>;
  }

  const subCategoryData = data.sub_category;

  if (!subCategoryData) {
    return <div>No data available</div>;
  }

  return (
    <>
      {subCategoryData.map((data) => (
        <Link to="/services-listing" key={data.id}>
          <div className="card card-side bg-base-100 shadow-xl">
            <figure>
              <img
                className="h-[80px] w-[100px]"
                src={`${VITE_IMAGE_PATH_URL}/category/${data.cat_img}`}
                alt={data.slug}
              />
            </figure>
            <div className="card-body px-4 py-0 justify-center">
              <h2 className="card-title text-base font-normal">{data.name}</h2>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
};

export default ServicesListingCard;
