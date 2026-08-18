import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Search } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

import { API_URL } from "../../react-query/constants";
import { Service } from "../../types";

interface ServiceResponse {
  message: string;
  services: Service[];
}

/** The API filters on `keyword`; sending any other key silently returns everything. */
const searchServices = async (keyword: string): Promise<ServiceResponse> => {
  const response = await axios.post<ServiceResponse>(`${API_URL}/search-services`, { keyword });
  return response.data;
};

type ServiceSearchProps = {
  /** Results are rendered by the caller, in its own section. */
  onResults: (payload: { query: string; services: Service[] }) => void;
};

const ServiceSearch = ({ onResults }: ServiceSearchProps) => {
  const [keyword, setKeyword] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: searchServices,
    onError: (error: Error) => {
      console.error("Error searching services:", error);
      toast.error("We could not search services right now. Please try again.");
    },
  });

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const query = keyword.trim();
    if (!query) {
      toast.error("Enter a service title to search.");
      return;
    }

    mutate(query, {
      onSuccess: (data) => onResults({ query, services: data.services ?? [] }),
    });
  };

  return (
    <form onSubmit={handleSearch} className="mx-auto w-full max-w-2xl" role="search">
      <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
        <Search size={20} className="ml-3 shrink-0 text-slate-400" aria-hidden="true" />
        <label htmlFor="service-search" className="sr-only">
          Search services by title
        </label>
        <input
          id="service-search"
          type="search"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="Search by service, e.g., tile, brick, plaster work"
          className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 md:text-base"
        />
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-blue-700 px-5 text-sm font-bold text-white transition hover:bg-blue-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:cursor-not-allowed disabled:bg-blue-400 md:h-12 md:px-6"
        >
          {isPending ? (
            <>
              <span className="loading loading-spinner loading-sm" aria-hidden="true" />
              <span className="hidden md:inline">Searching…</span>
            </>
          ) : (
            <>
              <Search size={18} aria-hidden="true" />
              <span className="hidden md:inline">Search</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ServiceSearch;
