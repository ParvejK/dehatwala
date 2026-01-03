import { useState } from "react";
import Container from "../shared/container";
import HeadingPrimary from "../typography/heading-primary";
import { useJobs } from "../../react-query/hooks";
import JobCardSkeleton from "../skeleton/job-card-skeleton";
import JobCard from "../jobs/job-card";
import { Link } from "react-router-dom";

const RecentJobs = () => {
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  const { data, isLoading, isError } = useJobs();
  if (isError) {
    return <p>Error, Something went wrong</p>;
  }

  if (isLoading) {
    return <JobCardSkeleton />;
  }

  return (
    <Container className="my-[100px]">
      <div className="text-center">
        <HeadingPrimary className="mb-10">Recent Jobs</HeadingPrimary>
      </div>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.jobs.slice(0, 4).map((job) => (
            <JobCard key={job.id} job={job} expandedJob={expandedJob} setExpandedJob={setExpandedJob} />
          ))}
        </div>
        {data.jobs.length === 0 && (
          <div className="min-h-screen bg-gray-100 p-4">
            <div className="flex justify-center items-center h-[200px] bg-gray-200 mb-10 rounded-md">
              <h2 className="text-2xl font-bold text-center">No jobs available in this category.</h2>
            </div>
          </div>
        )}
        <div className="mt-10 text-center">
          <Link to="/more-jobs" className="btn btn-primary btn-sm btn-link uppercase">
            View more Jobs
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default RecentJobs;
