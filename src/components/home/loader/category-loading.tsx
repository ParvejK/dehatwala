import CardSkeleton from "../../skeleton/card-skeleton";

const CategoryLoading = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="skeleton h-[42px] w-full max-w-[400px] mx-auto px-3 mb-6"></div>
      <div className="grid grid-cols-4 gap-4 w-full">
        {Array.from({ length: 12 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

export default CategoryLoading;
