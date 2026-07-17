import { Link } from "react-router-dom";
import { useAuth } from "../app/providers/authContext";

function NotFoundPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="not-found-shell">
      <div className="not-found-card">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for does not exist or has been moved.</p>
        <Link to={isAuthenticated ? "/home" : "/"} className="btn-primary">
          Go Back Home
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
