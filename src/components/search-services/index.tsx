import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Service } from "../../types";
import { useCategories } from "../../react-query/hooks";
import ServicesCard from "../shared/services-card";
import { IoIosSearch } from "react-icons/io";
import HeadingPrimary from "../typography/heading-primary";
import { API_URL } from "../../react-query/constants";

interface SearchData {
  category_id: number;
  kyword: string;
}

interface ServiceResponse {
  message: string;
  services: Service[];
}

const SearchServices = () => {
  const [categoryId, setCategoryId] = useState("");
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<Service[]>([]);

  // Mutation function for searching services
  const searchServices = async (searchData: SearchData): Promise<ServiceResponse> => {
    const response = await axios.post<ServiceResponse>(`${API_URL}/search-services`, searchData);
    return response.data;
  };

  // useMutation hook
  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: searchServices,
    onSuccess: (data: ServiceResponse) => {
      setResults(data.services || []);
    },
    onError: (error: Error) => {
      console.error("Error searching services:", error);
      alert("Failed to fetch services. Please try again.");
    },
  });

  // Form submit handler
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const searchData: SearchData = {
      category_id: Number(categoryId),
      kyword: keyword,
    };
    // Trigger the mutation
    mutate(searchData);
  };

  // Get Services
  const { data, error, isLoading, isError: serviceError } = useCategories();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center bg-gray-100 p-3 rounded">
        <div className="skeleton h-[100px] w-full max-w-[800px] mx-auto px-3 mb-6" />
      </div>
    );
  }

  if (serviceError) {
    return <p>Error{error.message}</p>;
  }

  return (
    <div className="bg-accent p-3">
      <div className="flex justify-center items-center px-4">
        <form onSubmit={handleSearch} className="w-full max-w-3xl">
          <div className="flex flex-col md:flex-row md:items-stretch bg-white rounded-2xl md:rounded-full border border-gray-200 shadow-sm overflow-hidden divide-y md:divide-y-0 md:divide-x divide-gray-200">
            <select
              className="flex-1 min-w-0 py-3 md:py-4 px-5 outline-none bg-white text-sm md:text-base text-gray-700 cursor-pointer"
              id="category_id"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              {data.categories.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>

            <div className="flex-1 min-w-0 flex items-center md:gap-2 px-2 md:px-3 py-2">
              <input
                type="text"
                id="kyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search by service title..."
                className="flex-1 min-w-0 py-2 md:py-3 px-3 outline-none text-sm md:text-base placeholder:text-gray-400"
              />
              <button
                type="submit"
                disabled={isPending}
                aria-label="Search"
                className="btn btn-secondary text-white rounded-full px-4 md:px-5 min-h-0 h-10 md:h-12 flex items-center gap-1 disabled:opacity-60"
              >
                {isPending ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  <>
                    <IoIosSearch size={22} />
                    <span className="hidden md:inline text-sm">Search</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {isError && <p>Error fetching services.</p>}

      {isSuccess && (
        <div className="container mx-auto px-0 md:px-4">
          <div className="pb-[100px]">
            {results.length ? <HeadingPrimary className="mb-6 mt-6 text-center">Search Results</HeadingPrimary> : null}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              {results.length > 0 && results.map((service) => <ServicesCard key={service.id} data={service} />)}
            </div>
            {!results.length && (
              <div className="flex justify-center items-center min-h-[200px]">
                <div className="text-center">
                  <h3 className="text-xl font-medium">No services are available at the moment. </h3>
                  <p className="font-lg">Please check back later!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchServices;
