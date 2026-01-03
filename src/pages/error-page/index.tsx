import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <div id="error-page" className="flex justify-center items-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <Link to="/" className="btn btn-primary">
          Back to home{" "}
        </Link>
      </div>
    </div>
  );
}
