import { Link } from "react-router-dom";
import BrandMark from "../../shared/components/BrandMark";

function PublicLayout({ children }) {
  return (
    <div className="landing-shell">
      {/* Landing Navbar */}
      <header className="landing-header">
        <div className="landing-header-container">
          <Link to="/" className="landing-logo-link">
            <BrandMark size="medium" />
          </Link>
          <nav className="landing-nav">
            <Link to="/features" className="landing-nav-link">Features</Link>
            <Link to="/about" className="landing-nav-link">About</Link>
            <Link to="/faq" className="landing-nav-link">FAQ</Link>
            <Link to="/blog" className="landing-nav-link">Blog</Link>
          </nav>
          <div className="landing-auth-buttons">
            <Link to="/login" className="landing-nav-link login-text-link">Login</Link>
            <Link to="/signup" className="btn-get-started">Get Started</Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="landing-main">
        {children}
      </main>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <p>&copy; {new Date().getFullYear()} DayTree. All rights reserved.</p>
          <div className="footer-links">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <a href="https://github.com" target="_blank" rel="noreferrer">Github</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PublicLayout;
