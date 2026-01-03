import { Link } from "react-router-dom";

const MobileNavigationMenu = ({ categories, isLoading, isError, error, user }) => {
  return (
    <div className="form-control">
      <ul className="flex flex-col gap-6 mt-10">
        <li>
          <Link className="font-medium text-sm" to="/">
            Home
          </Link>
        </li>
        <li>
          <details>
            <summary className="font-medium text-sm">Category</summary>
            <ul>
              {isLoading && <li>Loading...</li>}
              {isError && <li>{error?.message || "Error loading categories"}</li>}
              {categories && categories.length > 0 ? (
                categories.map((category) => (
                  <li key={category.id} className="capitalize">
                    <Link to={`/service/${category.slug}`}>{category.name}</Link>
                  </li>
                ))
              ) : (
                <li>No categories found</li>
              )}
            </ul>
          </details>
        </li>
        <li>
          <Link className="font-medium text-sm" to="/about-us">
            About Us
          </Link>
        </li>
        <li>
          <Link className="font-medium text-sm" to="/jobs">
            Jobs
          </Link>
        </li>
        <li>
          <Link className="font-medium text-sm" to="/blog">
            Blogs
          </Link>
        </li>
        <li>
          <Link className="font-medium text-sm" to="/contact">
            Contact
          </Link>
        </li>
        {!user && (
          <li className="pr-6">
            <Link className="font-medium text-sm" to="/sign-in">
              Sign in
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default MobileNavigationMenu;
