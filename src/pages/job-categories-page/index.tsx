import { Link } from "react-router-dom";
import JobCategoryCarousel from "../../components/jobs/job-category-carousel";
import { useJobsCategory } from "../../react-query/hooks";
import JobCategorySkeleton from "../../components/skeleton/job-category-skeleton";
import { useQuery } from "@tanstack/react-query";
import { fetchJobCarousel } from "../../react-query/apis";
import { JobSliderProps } from "../../types";

export default function JobCategoriesPage() {
  const { data, isLoading, isError } = useJobsCategory();

  const sliderData = useQuery<JobSliderProps, Error>({
    queryKey: ["job-sliders"],
    queryFn: fetchJobCarousel,
    enabled: true,
  });

  if (isError) {
    return <p>Error, Something went wrong</p>;
  }
  if (isLoading) {
    return <JobCategorySkeleton />;
  }

  if (sliderData.isLoading) {
    return <JobCategorySkeleton />;
  }
  if (sliderData.isError) {
    return <p>Error loading job sliders</p>;
  }

  console.log(sliderData.data);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="mb-6">
        <JobCategoryCarousel sliders={sliderData.data.sliders} />
      </div>
      <div className="mx-auto max-w-[500px] h-[60px] mb-0 md:mb-10 rounded-md flex justify-center items-center">
        <h2 className="text-base md:text-2xl font-bold text-center">Choose Job by Categories</h2>
      </div>
      <div className="container mx-auto px-0 md:px-4 mb-[100px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.categories.map((category) => (
            <Link to={`/more-jobs/${category.slug}`}>
              <div key={category.id} className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-base font-semibold">{category.name}</h3>
                <p className="text-gray-600 text-sm">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
