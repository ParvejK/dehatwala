import { Link } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";

const NavigationMenu = ({ categories, isLoading, isError, error, user }) => {
  return (
    <div className="form-control">
      <ul className="flex items-center gap-6">
        <li>
          <Link className="font-medium text-sm" to="/">
            Home
          </Link>
        </li>
        <li>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="font-medium text-sm m-1 flex items-center gap-3">
              Category <FaChevronDown />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow min-w-[320px]"
            >
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
          </div>
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

export default NavigationMenu;
