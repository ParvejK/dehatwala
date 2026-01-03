import HeadingPrimary from "../typography/heading-primary";
import CategoryCard from "../shared/category-card";
import { useCategories } from "../../react-query/hooks";
import CategoryLoading from "./loader/category-loading";

const Category = () => {
  const { data, isLoading, isError, error } = useCategories();

  if (isLoading) {
    return <CategoryLoading />;
  }

  if (isError) <p>Oops! Something went wrong! {error.message}</p>;

  // Category data
  // const categories = data?.categories || [];
  const { categories } = data;
  // const topCategories = categories.slice(0, 8);

  return (
    <div className="bg-accent">
      <div className="container mx-auto px-4 py-10">
        <HeadingPrimary className="mb-6 mt-6 text-center">Categories</HeadingPrimary>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Category;
