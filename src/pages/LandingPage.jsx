import { Link } from "react-router-dom";
import BrandMark from "../shared/components/BrandMark";

function LandingPage() {
  return (
    <div className="landing-shell">
      {/* Landing Navbar */}
      <header className="landing-header">
        <div className="landing-header-container">
          <Link to="/" className="landing-logo-link">
            <BrandMark size="medium" />
          </Link>
          <nav className="landing-nav">
            <a href="#features" className="landing-nav-link">Product</a>
            <a href="#features" className="landing-nav-link">Features</a>
            <a href="#about" className="landing-nav-link">About</a>
          </nav>
          <div className="landing-auth-buttons">
            <Link to="/login" className="landing-nav-link login-text-link">Login</Link>
            <Link to="/signup" className="btn-get-started">Get Started</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Build better habits.<br />
            <span>One day at a time.</span>
          </h1>
          <p className="hero-subtitle">
            A minimal, brutalist habit tracker designed for high performers. Plan your day, track your consistency, and grow your personal tree of daily disciplines.
          </p>
          <div className="hero-actions">
            <Link to="/signup" className="btn-primary">Get Started</Link>
            <a href="#features" className="btn-secondary">Learn More</a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="browser-mockup">
            <div className="browser-header">
              <span className="dot dot-red" />
              <span className="dot dot-yellow" />
              <span className="dot dot-green" />
              <div className="browser-address">daytree.app/dashboard</div>
            </div>
            <div className="browser-content">
              <img 
                src="/main-page.png" 
                alt="DayTree Dashboard Preview" 
                className="dashboard-preview-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="landing-features">
        <h2 className="section-title">Designed for consistency</h2>
        <p className="section-subtitle">Ditch the noise. Focus on what you actually do every day.</p>
        
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <img src="/icons/calendar.png" alt="Daily Habit Tracking" />
            </div>
            <h3>Daily Habit Tracking</h3>
            <p>Focus purely on the current day's commitments. Clear your board every single day to build momentum.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <img src="/icons/backlog.png" alt="Backlog Management" />
            </div>
            <h3>Backlog Management</h3>
            <p>Incomplete tasks automatically move to backlog. No guilt, just smart rescheduling whenever you are ready.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <img src="/icons/heatmap.png" alt="Heatmap Analytics" />
            </div>
            <h3>Heatmap Analytics</h3>
            <p>Visualize your progress over time with Github-inspired contribution matrices that display long-term consistency.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <img src="/icons/streak.png" alt="Streak Tracking" />
            </div>
            <h3>Streak Tracking</h3>
            <p>Monitor your active daily streaks and watch your commitment grow. Keep the chain unbroken.</p>
          </div>
        </div>
      </section>

      {/* About / Final CTA */}
      <section id="about" className="landing-cta">
        <div className="cta-box">
          <h2>Ready to grow daily?</h2>
          <p>Create your free account and start tracking your path today.</p>
          <Link to="/signup" className="btn-primary cta-btn">Create Free Account</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <p>&copy; {new Date().getFullYear()} DayTree. All rights reserved.</p>
          <div className="footer-links">
            <a href="#features">Privacy</a>
            <a href="#features">Terms</a>
            <a href="https://github.com" target="_blank" rel="noreferrer">Github</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
