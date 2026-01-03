import { Link } from "react-router-dom";
import { VITE_IMAGE_PATH_URL } from "../../react-query/constants";
import { useBlogs } from "../../react-query/hooks";
import SingleBlogCardLoading from "./loader/single-blog-card-loading";

const SingleBlogCard = ({ blogId }: { blogId: string }) => {
  const { data, status } = useBlogs();

  if (status === "pending") {
    return <SingleBlogCardLoading />;
  }

  if (status === "error") {
    return <p>Oops something went wrong try again!</p>;
  }

  if (status === "success") {
    const { blogs } = data;
    const otherBlogData = blogs.filter((blog) => blog.slug !== blogId);

    return (
      <>
        {otherBlogData.map((blog) => (
          <div className="flex bg-white h-[130px]" key={blog.id}>
            <div className="w-[110px] md:w-[140px] h-full">
              <img className="h-[130px] object-cover" src={`${VITE_IMAGE_PATH_URL}/blog/${blog.blogimg}`} alt="" />
            </div>
            <div className="flex-1 p-4">
              <h3 className="text-xs md:text-sm font-semibold mb-2">{blog.title}</h3>
              <p className="text-xs md:text-sm font-normal">{blog.short_description.slice(0, 60)}</p>
              <Link to={`/blog/${blog.id}`} className="text-xs font-semibold text-blue-600">
                Read more
              </Link>
            </div>
          </div>
        ))}
      </>
    );
  }

  return <p>No blog post available</p>;
};

export default SingleBlogCard;
