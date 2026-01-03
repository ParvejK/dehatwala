const InstantServiceLoading = () => {
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
        <div className="space-y-6">
          <div className="skeleton h-[400px] w-full" />
          <div className="skeleton h-[100px] w-full" />
          <div className="skeleton h-[200px] w-full" />
        </div>
      </div>
    </div>
  );
};

export default InstantServiceLoading;
