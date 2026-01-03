const SingleBlogPageLoading = () => {
  return (
    <div className="container mx-auto px-4 py-6 grid grid-cols-12">
      <div className="space-y-6 col-span-12 md:col-span-8">
        <div className="skeleton h-[32px] w-full"></div>
        <div className="skeleton h-[400px] w-full"></div>
        <div className="skeleton h-[400px] w-full"></div>
        <div className="skeleton h-32 w-[80%]"></div>
        <div className="skeleton h-32 full"></div>
      </div>
    </div>
  );
};

export default SingleBlogPageLoading;
