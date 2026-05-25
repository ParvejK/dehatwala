import Container from "./container";
import HeadingPrimary from "../typography/heading-primary";
import { useFetchTopCompanies } from "../../react-query/hooks";
import { VITE_IMAGE_PATH_URL } from "../../react-query/constants";

const TopCompanies = () => {
  const { data, isError, isLoading } = useFetchTopCompanies();

  if (isError) {
    return <p>Oops something went wrong...</p>;
  }

  return (
    <div className="bg-white py-[60px] border-t border-accent">
      <Container>
        <HeadingPrimary className="text-center mb-[40px]">
          Top Companies Choose Dehatwala For their Construction Hiring
        </HeadingPrimary>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-20 w-full rounded-md" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center">
            {data.top_companies.map((company) => (
              <div
                key={company.id}
                className="bg-white border border-accent rounded-md flex justify-center items-center p-4 h-24"
              >
                <img
                  className="max-h-12 max-w-full object-contain"
                  src={`${VITE_IMAGE_PATH_URL}/top_companies/${company.logo}`}
                  alt={company.name}
                />
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};

export default TopCompanies;
