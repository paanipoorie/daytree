import { Link } from "react-router-dom";
import { useAuth } from "../app/providers/authContext";
import SEO from "../shared/components/SEO";

function NotFoundPage() {
  const { isAuthenticated } = useAuth();

  return (
    <main className="not-found-shell">
      <SEO title="Page Not Found" noindex={true} />
      <div className="not-found-card">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for does not exist or has been moved.</p>
        <Link to={isAuthenticated ? "/home" : "/"} className="btn-primary">
          Go Back Home
        </Link>
      </div>
    </main>
  );
}

export default NotFoundPage;
