import { twMerge } from "tailwind-merge";
import { useCategories } from "../../react-query/hooks";
import { Link, useParams } from "react-router-dom";
import { SubCategory } from "../../types";

interface SubCategoryProps {
  subCategories: SubCategory[];
}

const ListingSideBar = ({ subCategories }: SubCategoryProps) => {
  const { category_slug, sub_category_slug } = useParams();

  // Category
  const { data: CategoryData, isLoading, isError, error } = useCategories();

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col gap-6">
        <div className="space-y-2">
          <div className="skeleton h-6 w-full rounded-md"></div>
          <div className="skeleton h-6 w-full rounded-md"></div>
          <div className="skeleton h-6 w-full rounded-md"></div>
          <div className="skeleton h-6 w-full rounded-md"></div>
        </div>
        <div className="space-y-2">
          <div className="skeleton h-6 w-full rounded-md"></div>
          <div className="skeleton h-6 w-full rounded-md"></div>
          <div className="skeleton h-6 w-full rounded-md"></div>
          <div className="skeleton h-6 w-full rounded-md"></div>
        </div>
      </div>
    );
  }

  if (isError) <p>Oops! Something went wrong! {error.message}</p>;

  const { categories } = CategoryData;

  return (
    <div className="border-r border-accent h-full min-h-[600px] overflow-y-auto space-y-3">
      <div>
        <h2 className="text-base font-semibold mb-4">Category</h2>
        <ul className="space-y-3">
          {categories.map((category) => (
            <li
              key={category.id}
              className={twMerge(
                "text-xs font-medium text-gray-500",
                category.slug === category_slug ? "font-medium text-black" : ""
              )}
            >
              <Link to={`/service/${category.slug}`}>{category.name}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="text-base font-semibold mb-4 mt-6">Sub Category</h2>
        <ul className="space-y-3">
          {subCategories.map((subCategory) => (
            <li
              key={subCategory.id}
              className={twMerge(
                "text-xs font-medium text-gray-500",
                subCategory.slug === sub_category_slug ? "font-medium text-black" : ""
              )}
            >
              <Link to={`/service/${category_slug}/${subCategory.slug}`}>{subCategory.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ListingSideBar;
