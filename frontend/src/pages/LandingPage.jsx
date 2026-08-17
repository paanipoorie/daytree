import { Link } from "react-router-dom";
import PublicLayout from "../app/layouts/PublicLayout";
import SEO from "../shared/components/SEO";

function LandingPage() {
  return (
    <PublicLayout>
      <SEO 
        title="Simple Habit Tracker for Daily Consistency" 
        description="DayTree is a simple habit tracker that helps you build daily routines, track habits, maintain streaks, and understand your progress over time." 
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebSite",
                "@id": "https://daytree.paanipoorie.com/#website",
                "url": "https://daytree.paanipoorie.com/",
                "name": "DayTree",
                "description": "A minimalist, brutalist habit tracker designed for high performers.",
                "publisher": {
                  "@id": "https://daytree.paanipoorie.com/#organization"
                }
              },
              {
                "@type": "Organization",
                "@id": "https://daytree.paanipoorie.com/#organization",
                "name": "DayTree",
                "url": "https://daytree.paanipoorie.com/",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://daytree.paanipoorie.com/favicon-96x96.png",
                  "caption": "DayTree Logo"
                },
                "contactPoint": {
                  "@type": "ContactPoint",
                  "email": "support@paanipoorie.com",
                  "contactType": "customer support"
                }
              },
              {
                "@type": "SoftwareApplication",
                "@id": "https://daytree.paanipoorie.com/#software",
                "name": "DayTree",
                "operatingSystem": "All",
                "applicationCategory": "ProductivityApplication",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                },
                "description": "A simple habit tracker for daily consistency. Build daily routines, track habits, maintain streaks, and analyze your progress with heatmap charts."
              }
            ]
          })
        }}
      />

      {/* Main Content */}
      <div className="landing-main">
        {/* Hero Section */}
        <section className="landing-hero">
          <div className="hero-content">
            <h1 className="hero-title" style={{ fontSize: "clamp(32px, 4.5vw, 48px)" }}>
              A Simple Habit Tracker for Daily Consistency
            </h1>
            <p className="hero-subtitle">
              DayTree is a minimalist, brutalist habit tracking application designed for focus. 
              Plan your day, track your consistency, and grow your personal tree of daily disciplines.
            </p>
            <div className="hero-actions">
              <Link to="/signup" className="btn-primary">Get Started</Link>
              <Link to="/features" className="btn-secondary">Explore Features</Link>
            </div>
          </div>

          <div className="hero-visual">
            <div className="browser-mockup">
              <div className="browser-header">
                <span className="dot dot-red" />
                <span className="dot dot-yellow" />
                <span className="dot dot-green" />
                <div className="browser-address">daytree.paanipoorie.com/home</div>
              </div>
              <div className="browser-content">
                <img 
                  src="/main-page.png" 
                  alt="DayTree Dashboard Preview" 
                  className="dashboard-preview-img"
                  width="1920"
                  height="1200"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 1 & 2: What is DayTree? / Daily Habit Tracking */}
        <section className="landing-features" style={{ marginTop: "40px", marginBottom: "40px" }}>
          <div style={{
            border: "3px solid #000",
            background: "#fff",
            padding: "40px",
            boxShadow: "8px 8px 0 #000",
            marginBottom: "40px",
            lineHeight: "1.6"
          }}>
            <h2 style={{ fontSize: "28px", textTransform: "uppercase", fontWeight: "900", fontFamily: "Arial" }}>What is DayTree?</h2>
            <p>
              DayTree is a modern habit-tracking web application built on the MERN stack. We strip away the gaming loops, 
              bloated features, and noisy popups found in other platforms to give you a stark, clean, distraction-free environment. 
              Our goal is simple: to help you build and maintain daily habits.
            </p>
            
            <h3 style={{ marginTop: "24px", textTransform: "uppercase", fontWeight: "900", fontFamily: "Arial" }}>Daily Habit Tracking</h3>
            <p>
              DayTree divides your commitments by day. Instead of looking at an intimidating list of tasks, 
              you focus solely on what needs to be done during the current day. It is a highly tactical tool 
              designed to keep your daily focus razor-sharp.
            </p>
          </div>
        </section>

        {/* Feature Grid: Sections 3, 4, 5, 6 */}
        <section id="features" className="landing-features">
          <h2 className="section-title">Designed for consistency</h2>
          <p className="section-subtitle">Ditch the noise. Focus on what you actually do every day.</p>
          
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <img src="/icons/calendar.png" alt="Daily Habit Tracking Icon" loading="lazy" width="48" height="48" />
              </div>
              <h3>Daily Habit Tracking</h3>
              <p>Focus purely on the current day's commitments. Clear your board every single day to build momentum.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <img src="/icons/backlog.png" alt="Backlog Management Icon" loading="lazy" width="48" height="48" />
              </div>
              <h3>Habit Backlogs</h3>
              <p>Incomplete tasks automatically move to a backlog. No guilt, just smart rescheduling whenever you are ready.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <img src="/icons/heatmap.png" alt="Heatmap Analytics Icon" loading="lazy" width="48" height="48" />
              </div>
              <h3>Progress & Heatmaps</h3>
              <p>Visualize your progress over time with Github-inspired contribution matrices that display long-term consistency.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <img src="/icons/streak.png" alt="Streak Tracking Icon" loading="lazy" width="48" height="48" />
              </div>
              <h3>Habit Streaks</h3>
              <p>Monitor your active daily streaks and watch your commitment grow. Keep the chain unbroken.</p>
            </div>
          </div>
        </section>

        {/* Section 6 & 7: Organizing habits throughout the day / How DayTree works */}
        <section className="landing-features" style={{ marginTop: "40px", marginBottom: "40px" }}>
          <div style={{
            border: "3px solid #000",
            background: "#fff",
            padding: "40px",
            boxShadow: "8px 8px 0 #000",
            marginBottom: "40px",
            lineHeight: "1.6"
          }}>
            <h2 style={{ fontSize: "28px", textTransform: "uppercase", fontWeight: "900", fontFamily: "Arial" }}>Organizing Habits Throughout the Day</h2>
            <p>
              Your energy flows differently from sunrise to sunset. DayTree allows you to organize your habits into four 
              distinct periods of the day: <strong>Morning, Afternoon, Evening, and Night</strong>. This scheduling helps 
              you anchor habits to specific times of day, increasing the likelihood of successful completion.
            </p>

            <h2 style={{ fontSize: "28px", textTransform: "uppercase", fontWeight: "900", fontFamily: "Arial", marginTop: "32px" }}>How DayTree Works</h2>
            <p>
              Building discipline is straightforward with our three-step cycle:
            </p>
            <ol style={{ paddingLeft: "20px" }}>
              <li style={{ marginBottom: "8px" }}><strong>Plan:</strong> Create habits and assign them to Morning, Afternoon, Evening, or Night.</li>
              <li style={{ marginBottom: "8px" }}><strong>Execute & Log:</strong> Check off habits during their designated periods on your dashboard.</li>
              <li style={{ marginBottom: "8px" }}><strong>Review:</strong> View your streaks and complete heatmap analytics on your Tally board.</li>
            </ol>
          </div>
        </section>

        {/* Section 8 & 9: Why use DayTree? / FAQ Summary */}
        <section className="landing-features" style={{ marginTop: "40px", marginBottom: "40px" }}>
          <div className="feature-grid" style={{ gap: "20px" }}>
            <div style={{
              border: "3px solid #000",
              background: "#fff",
              padding: "30px",
              boxShadow: "5px 5px 0 #000",
              lineHeight: "1.6"
            }}>
              <h2 style={{ fontSize: "22px", textTransform: "uppercase", fontWeight: "900", fontFamily: "Arial" }}>Why Use DayTree?</h2>
              <p>
                Unlike bloated productivity applications, DayTree doesn't waste your time. It loads instantly, runs securely, 
                and keeps you focused. By using a guilt-free backlog instead of harsh penalties, we encourage consistent, 
                long-term behavior modification over short-lived motivation spikes.
              </p>
            </div>

            <div style={{
              border: "3px solid #000",
              background: "#fff",
              padding: "30px",
              boxShadow: "5px 5px 0 #000",
              lineHeight: "1.6"
            }}>
              <h2 style={{ fontSize: "22px", textTransform: "uppercase", fontWeight: "900", fontFamily: "Arial" }}>Quick FAQ</h2>
              <p><strong>Is DayTree free?</strong> Yes, DayTree is 100% free and has no premium paywalls.</p>
              <p><strong>Can I track streaks?</strong> Yes, we track both current active streaks and longest records.</p>
              <p>For more answers, visit our dedicated <Link to="/faq" style={{ textDecoration: "underline", fontWeight: "bold" }}>FAQ Page</Link>.</p>
            </div>
          </div>
        </section>

        {/* Section 10: Final CTA */}
        <section className="landing-cta">
          <div className="cta-box">
            <h2>Ready to grow daily?</h2>
            <p>Create your free account and start tracking your path today.</p>
            <Link to="/signup" className="btn-primary cta-btn">Create Free Account</Link>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}

export default LandingPage;
