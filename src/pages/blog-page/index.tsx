import BlogLoading from "../../components/home/loader/blog-loading";
import BlogCard from "../../components/shared/blog-card";
import Container from "../../components/shared/container";
import SmallBanner from "../../components/shared/small-banner";
import { useBlogs } from "../../react-query/hooks";

const BlogPage = () => {
  const { data, status } = useBlogs();

  if (status === "pending") {
    return <BlogLoading />;
  }

  if (status === "error") {
    return <p>Oops something went wrong try again!</p>;
  }

  const { blogs } = data;
  return (
    <div>
      <SmallBanner
        title="Noteworthy technology acquisitions 2021"
        content="Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order."
      />
      <Container className="my-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} data={blog} />
          ))}
        </div>
      </Container>
    </div>
  );

  return <p>No data found.</p>;
};

export default BlogPage;
