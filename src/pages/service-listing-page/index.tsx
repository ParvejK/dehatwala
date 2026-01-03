import { useParams } from "react-router-dom";
import { fetchServices } from "../../react-query/apis";
import { useMutation } from "@tanstack/react-query";
import ListingBanner from "../../components/services/listing-banner";
import ListingSideBar from "../../components/services/listing-sidebar";
import Container from "../../components/shared/container";
import SearchBox from "../../components/shared/search-box";
import ListingCard from "../../components/services/listing-card";
import { useEffect, useState } from "react";
import { IoMdMenu } from "react-icons/io";

const ServiceListingPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { category_slug, sub_category_slug } = useParams();

  // Service Filter data
  const mutation = useMutation({
    mutationFn: (filters: { category_slug: string; sub_category_slug: string; keyword: string }) =>
      fetchServices(filters),
  });

  const filters = {
    category_slug: category_slug,
    sub_category_slug: sub_category_slug,
    keyword: searchQuery,
  };

  useEffect(() => {
    mutation.mutate(filters, {
      onSuccess: (data) => {
        console.log("Services fetched successfully:", data);
      },
      onError: (error) => {
        console.error("Error fetching services:", error);
      },
    });
  }, [category_slug, sub_category_slug, searchQuery]);

  const subCategories = mutation.isSuccess && mutation.data.sub_categories;

  return (
    <div>
      <div>
        <ListingBanner />
      </div>
      <Container className="my-[80px]">
        <div className="md:flex">
          <div className="hidden md:block w-[180px] xl:w-[300px] sticky top-0">
            {subCategories && <ListingSideBar subCategories={subCategories} />}
            {!subCategories && (
              <div className="min-h-[80vh] flex flex-col gap-6">
                <div className="space-y-2">
                  <div className="skeleton h-6 w-full rounded-md"></div>
                  <div className="skeleton h-6 w-full rounded-md"></div>
                  <div className="skeleton h-6 w-full rounded-md"></div>
                  <div className="skeleton h-6 w-full rounded-md"></div>
                </div>
                <div className="space-y-2">
                  <div className="skeleton h-6 w-full rounded-md"></div>
                  <div className="skeleton h-6 w-full rounded-md"></div>
                  <div className="skeleton h-6 w-full rounded-md"></div>
                  <div className="skeleton h-6 w-full rounded-md"></div>
                </div>
              </div>
            )}
          </div>
          <div className="md:flex-1 md:px-6 space-y-5">
            <div>
              <SearchBox setSearchQuery={setSearchQuery} />
            </div>
            <div>
              {mutation.isPending && (
                <div className="space-y-5">
                  <div className="skeleton h-32 w-full rounded-md"></div>
                  <div className="skeleton h-32 w-full rounded-md"></div>
                  <div className="skeleton h-32 w-full rounded-md"></div>
                  <div className="skeleton h-32 w-full rounded-md"></div>
                </div>
              )}
              {mutation.isError && <p>Error: {mutation.error?.message || "Something went wrong"}</p>}
            </div>
            <>
              <div className="drawer">
                <input id="category-drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content flex justify-between items-center w-full md:hidden">
                  <div className="font-semibold">All Category List:</div>
                  <label htmlFor="category-drawer" className="btn btn-link">
                    <IoMdMenu size={27} />
                  </label>
                </div>
                <div className="drawer-side z-20">
                  <label htmlFor="category-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                  <div className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                    {subCategories && <ListingSideBar subCategories={subCategories} />}
                    {!subCategories && (
                      <div className="min-h-[80vh] flex flex-col gap-6">
                        <div className="space-y-2">
                          <div className="skeleton h-6 w-full rounded-md"></div>
                          <div className="skeleton h-6 w-full rounded-md"></div>
                          <div className="skeleton h-6 w-full rounded-md"></div>
                          <div className="skeleton h-6 w-full rounded-md"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="skeleton h-6 w-full rounded-md"></div>
                          <div className="skeleton h-6 w-full rounded-md"></div>
                          <div className="skeleton h-6 w-full rounded-md"></div>
                          <div className="skeleton h-6 w-full rounded-md"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
            {mutation.data?.services?.map((service) => (
              <ListingCard key={service.id} data={service} />
            ))}
          </div>
          <div className="md:w-[200px] mt-6 md:mt-0 px-6 hidden xl:block">{/* <p>Adds area</p> */}</div>
        </div>
      </Container>
    </div>
  );
};

export default ServiceListingPage;
