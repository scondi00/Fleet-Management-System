import { Link } from "react-router-dom";
export default function HomePage() {
  return (
    <div>
      <h1>Page not found</h1>
      <Link to="/about">Go to About Page</Link>
    </div>
  );
}
