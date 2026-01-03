import { Link, useParams } from "react-router-dom";
import { useFetchPolicies } from "../../react-query/hooks";
import DOMPurify from "dompurify";

const PolicyPage = () => {
  const { slug } = useParams();

  const { data, isError, isLoading } = useFetchPolicies(slug);
  if (isError) {
    return (
      <div className="container mx-auto p-14 min-h-[60vh] bg-gray-100 my-[60px] rounded-md flex flex-col gap-2 justify-center items-center">
        <div className="text-3xl font-bold">No data available...</div>
        <Link to="/" className="btn btn-primary">
          Back to home{" "}
        </Link>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div>
        <div className="container mx-auto p-14 min-h-[60vh] bg-gray-100 my-[60px] rounded-md">
          <div className="flex w-full flex-col gap-4">
            <div className="skeleton h-32 w-full"></div>
            <div className="skeleton h-4 w-28"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="container mx-auto p-14 min-h-[60vh] bg-gray-100 my-[60px] rounded-md">
        <h1 className="text-center text-3xl font-semibold">{data.page.title}</h1>
        <div>
          <div
            className="mt-10"
            dangerouslySetInnerHTML={{
              __html: data.page.content ? DOMPurify.sanitize(data.page.content) : "<p>No content available</p>",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PolicyPage;
