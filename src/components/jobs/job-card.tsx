import { ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";
import { JobProps } from "../../types";

interface JobCardProps {
  job: JobProps;
  expandedJob: string | null;
  setExpandedJob: (company: string | null) => void;
}

const JobCard = ({ job, expandedJob, setExpandedJob }: JobCardProps) => {
  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-semibold">{job.title}</h2>
          <div>
            <Link to={`/job-detail/${job.slug}`} className="btn btn-primary text-[11px] btn-sm btn-link uppercase">
              Apply Now
            </Link>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-gray-600 text-xs font-medium">Location: {job.location}</p>
          <p className="text-gray-600 text-xs font-medium">Daily Wage: ₹{job.salary}/day</p>
          <p className="text-gray-600 text-xs font-medium">Vacancy: {job.vaccancy} Post</p>
          <p className="text-gray-600 text-xs font-medium">Experience: {job.experience} Post</p>
        </div>
        <div className="mt-2 flex justify-between items-center">
          <button
            className="text-primary hover:underline flex items-center"
            onClick={() => setExpandedJob(expandedJob === job.title ? null : job.title)}
          >
            {expandedJob === job.title ? (
              <p className="text-xs font-medium flex items-center space-x-1">
                Less Info <ChevronUp size={19} />
              </p>
            ) : (
              <p className="text-xs font-medium flex items-center space-x-1">
                More Info <ChevronDown size={19} />
              </p>
            )}
          </button>
          <div>
            <p className="text-xs font-normal text-gray-500">
              Expiry Date: <span className="text-red-600">{job.last_date}</span>
            </p>
          </div>
        </div>
        {expandedJob === job.title && (
          <div className="mt-2 font-job">
            <p className="text-gray-600">Facilities: {job.facilities}</p>
            <div className="mt-1">
              <h3 className="font-semibold text-sm text-gray-700">Description</h3>
              <div className="text-gray-600" dangerouslySetInnerHTML={{ __html: job.description }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobCard;
