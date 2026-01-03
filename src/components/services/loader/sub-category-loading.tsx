const SubCategoryLoading = () => {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <div className="flex items-center gap-4" key={index}>
          <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
          <div className="flex-1 flex flex-col gap-4">
            <div className="skeleton h-4 w-[80%]"></div>
            <div className="skeleton h-4 w-full"></div>
          </div>
        </div>
      ))}
    </>
  );
};

export default SubCategoryLoading;
