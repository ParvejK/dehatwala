import Container from "../shared/container";
import BlogCard from "../shared/blog-card";
import HeadingPrimary from "../typography/heading-primary";
import { useBlogs } from "../../react-query/hooks";
import BlogLoading from "./loader/blog-loading";

const Blogs = () => {
  const { data, status } = useBlogs();

  if (status === "pending") {
    return <BlogLoading />;
  }

  if (status === "error") {
    return <p>Oops something went wrong try again!</p>;
  }

  const { blogs } = data;

  return (
    <Container className="mb-[100px]">
      <HeadingPrimary className="mb-10 text-center">Latest Blog post</HeadingPrimary>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {blogs?.slice(0, 4)?.map((blog) => (
          <BlogCard key={blog.id} data={blog} />
        ))}
      </div>
    </Container>
  );
};

export default Blogs;
