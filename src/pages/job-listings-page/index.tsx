import { useState } from "react";
import JobCard from "../../components/jobs/job-card";
import { Link } from "react-router-dom";
import JobCardSkeleton from "../../components/skeleton/job-card-skeleton";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { fetchJobCarousel, fetchJobs } from "../../react-query/apis";
import { SearchIcon } from "lucide-react";
import { useJobsCategory } from "../../react-query/hooks";
import { JobApiResponse } from "../../types";
import JobCategoryCarousel from "../../components/jobs/job-category-carousel";

export default function JobListingsPage() {
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [filters, setFilters] = useState({});

  const sliderData = useQuery({
    queryKey: ["job-sliders"],
    queryFn: fetchJobCarousel,
    enabled: true,
  });

  const { register, handleSubmit } = useForm({
    defaultValues: {
      location: "",
      category: "",
      experience: "",
      salary: "",
    },
  });

  const {
    data: jobApiResponse,
    isLoading,
    isError,
  } = useQuery<JobApiResponse>({
    queryKey: ["fetch-jobs", filters],
    queryFn: () => fetchJobs(filters),
    enabled: true,
  });

  const jobs = jobApiResponse?.jobs ?? [];

  const { data: Categories, isLoading: categoryLoading, isError: categoryError } = useJobsCategory();

  const onSubmit = (data) => {
    setFilters(data);
  };

  if (sliderData.isLoading) {
    return <p>Loading..</p>;
  }
  if (sliderData.isError) {
    return <p>Error loading job sliders</p>;
  }

  if (isLoading) return <JobCardSkeleton />;
  if (isError || categoryError) return <p>Error loading jobs or categories.</p>;

  console.log(sliderData.data);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div>
        <JobCategoryCarousel sliders={sliderData.data.sliders} />
      </div>
      <div className="flex justify-center items-center py-6 bg-accent/40 mb-10 rounded-md">
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-medium">Find Your Ideal Jobs</h2>
            <p>Search by Location, Industry, Experience, and Salary</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-center bg-white rounded-full px-5 py-2">
              {categoryLoading ? (
                "Loading..."
              ) : (
                <div className="w-full">
                  <select
                    {...register("category")}
                    defaultValue=""
                    className="select w-full outline-none focus:ring-0 bg-white focus:outline-none focus-within:outline-none focus-within:ring-0 focus::shadow-none focus:border-none"
                  >
                    <option value="" disabled>
                      Select category
                    </option>
                    {Categories?.categories?.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="w-full">
                <input
                  {...register("location")}
                  type="text"
                  placeholder="Search by location, name..."
                  className="input w-full input-md outline-none focus:ring-0 bg-white focus:outline-none focus-within:outline-none focus-within:ring-0 focus::shadow-none focus:border-none"
                />
              </div>
              <div>
                <button type="submit" className="btn btn-primary rounded-full">
                  <SearchIcon />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="container mx-auto md:px-4 mb-[100px]">
        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} expandedJob={expandedJob} setExpandedJob={setExpandedJob} />
            ))}
          </div>
        ) : (
          <p>No jobs available</p>
        )}

        <div className="mt-6 text-center">
          <Link to="/more-jobs" className="btn btn-secondary btn-link btn-sm">
            View more Jobs
          </Link>
        </div>
      </div>
    </div>
  );
}
