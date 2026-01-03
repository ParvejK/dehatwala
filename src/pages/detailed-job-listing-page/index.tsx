import { useState } from "react";
import { useParams } from "react-router-dom";
import JobCard from "../../components/jobs/job-card";
import JobCategorySkeleton from "../../components/skeleton/job-category-skeleton";
import { useJobsCategoryBySlug } from "../../react-query/hooks";

export default function DetailedJobListingPage() {
  const { slug } = useParams();
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  const { data, isLoading, isError } = useJobsCategoryBySlug(slug);

  if (isError) {
    return <p>Error, Something went wrong</p>;
  }

  if (isLoading) {
    return <JobCategorySkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex justify-center items-center h-[160px] md:h-[200px] bg-accent mb-10 rounded-md">
        <h2 className="text-lg md:text-2xl font-bold text-center">Jobs by Categories</h2>
      </div>
      <div className="container mx-auto px-0 md:px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.job.map((job) => (
            <JobCard key={job.id} job={job} expandedJob={expandedJob} setExpandedJob={setExpandedJob} />
          ))}
        </div>
        {data.job.length === 0 && (
          <div className="min-h-screen bg-gray-100 p-4">
            <div className="flex justify-center items-center mx-auto max-w-[330px] px-4 h-[200px] bg-gray-200 mb-10 rounded-md">
              <h2 className="text-2xl font-bold text-center">No jobs available in this category.</h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
