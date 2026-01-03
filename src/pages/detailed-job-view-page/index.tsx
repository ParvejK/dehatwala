import { useParams } from "react-router-dom";
import JobDetailSkelton from "../../components/skeleton/job-detal-skeltton";
import { useJobsBySlug } from "../../react-query/hooks";
import { useNavigate } from "react-router-dom";

export default function JobDetailedViewPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useJobsBySlug(slug);

  if (isError) {
    return <p>Error, Something went wrong</p>;
  }
  if (isLoading) {
    return <JobDetailSkelton />;
  }

  const job = data?.job;

  const handleClick = () => {
    navigate(`/job-detail/${slug}/${data.job.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 md:mb-[100px]">
      <div className="md:max-w-2xl md:mx-auto md:px-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <img
              src={job.image_link || "https://dummyimage.com/300x200/000/fff"}
              alt="Company Logo"
              className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-md object-contain"
            />
          </div>
          <h1 className="text-lg md:text-2xl font-bold text-center mb-2 md:mb-6">{job.title}</h1>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm md:font-base font-semibold">Post:</p>
                <p className="text-sm md:font-base">{job.post}</p>
              </div>
              <div>
                <p className="text-sm md:font-base font-semibold">Vacancy:</p>
                <p className="text-sm md:font-base">{job.vaccancy} Post</p>
              </div>
              <div>
                <p className="text-sm md:font-base font-semibold">Daily wages:</p>
                <p className="text-sm md:font-base">{job.salary}/Day</p>
              </div>
              <div>
                <p className="text-sm md:font-base font-semibold">Facilities:</p>
                <p className="text-sm md:font-base">{job.facilities}</p>
              </div>
              <div>
                <p className="text-sm md:font-base font-semibold">Experience:</p>
                <p className="text-sm md:font-base">{job.experience}</p>
              </div>
              <div>
                <p className="text-sm md:font-base font-semibold">Job Skill:</p>
                <p className="text-sm md:font-base">{job.skill}</p>
              </div>
              <div>
                <p className="text-sm md:font-base font-semibold">Location:</p>
                <p className="text-sm md:font-base">{job.location}</p>
              </div>
              <div>
                <p className="text-sm md:font-base font-semibold">Expiry Date:</p>
                <p className="text-sm md:font-base">{job.last_date}</p>
              </div>
            </div>
            <div>
              <p className="text-sm md:font-base font-semibold">Job description:</p>
              <div
                className="text-gray-600 !text-xs md:!text-base"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            </div>
          </div>
          <div className="mt-6 flex flex-col md:flex-row justify-center gap-3 md:gap-0 md:space-x-4">
            {/* <button className="btn btn-primary">Call Now</button> */}
            <button className="btn btn-primary text-white" onClick={handleClick}>
              Apply Now
            </button>
            {/* <button className="btn btn-accent text-primary">WhatsApp</button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
