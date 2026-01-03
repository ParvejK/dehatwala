const BlogSkelton = () => {
  return (
    <div className="flex w-full gap-6">
      <div className="skeleton w-[200px] h-32"></div>
      <div className="space-y-5 flex-1">
        <div className="skeleton h-4 w-28"></div>
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-full"></div>
      </div>
    </div>
  );
};

export default BlogSkelton;
