const PermanentServiceLoading = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="skeleton h-8 w-[80%] mt-10"></div>
      <div className="space-y-8 mt-4 mb-10">
        <div className="flex gap-4">
          <div className="skeleton h-[140px] w-full" />
          <div className="skeleton h-[140px] w-full hidden md:block" />
          <div className="skeleton h-[140px] w-full hidden md:block" />
          <div className="skeleton h-[140px] w-full hidden md:block" />
        </div>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <div className="skeleton h-8 w-full" key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermanentServiceLoading;
