import { VITE_IMAGE_PATH_URL } from "../../react-query/constants";
import { CategoryCardProps } from "../../types";
import { Link } from "react-router-dom";

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <>
      {category && (
        <div className="bg-white rounded-md overflow-hidden">
          <Link to={`/service/${category.slug}`}>
            <img
              className="h-[140px] w-full object-cover"
              src={`${VITE_IMAGE_PATH_URL}/category/${category.cat_img}`}
              alt={category.slug}
            />
          </Link>
          <div className="p-4">
            <Link to={`/service/${category.slug}`}>
              <h3 className="mb-0 text-[14px] leading-7 font-semibold tracking-tight text-gray-900">{category.name}</h3>
            </Link>
            <p className="mb-3 text-[13px] font-normal text-gray-700 ">{category.description}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default CategoryCard;
