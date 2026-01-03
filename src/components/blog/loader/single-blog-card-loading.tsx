import BlogSkelton from "../../skeleton/blog-sekeleton";

const SingleBlogCardLoading = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="skeleton h-[42px] w-full max-w-[400px] mb-6"></div>
      <div className="grid grid-cols-1 gap-6 w-full">
        {Array.from({ length: 4 }).map((_, index) => (
          <BlogSkelton key={index} />
        ))}
      </div>
    </div>
  );
};

export default SingleBlogCardLoading;
