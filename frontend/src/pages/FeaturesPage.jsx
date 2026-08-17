import { Link } from "react-router-dom";
import PublicLayout from "../app/layouts/PublicLayout";
import SEO from "../shared/components/SEO";

function FeaturesPage() {
  return (
    <PublicLayout>
      <SEO 
        title="Product Features — DayTree Habit Tracker" 
        description="Explore the features that make DayTree the ultimate distraction-free habit tracker: daily period scheduling, guilt-free backlogs, streaks, and heatmap matrices." 
      />
      <div className="landing-features" style={{ margin: "40px auto" }}>
        <h1 className="section-title">DayTree Features</h1>
        <p className="section-subtitle">A minimal interface engineered for daily consistency.</p>

        <div className="feature-grid" style={{ marginBottom: "50px" }}>
          <div className="feature-card">
            <div className="feature-icon">
              <img src="/icons/calendar.png" alt="Daily Scheduling" width="48" height="48" />
            </div>
            <h3>Period-Based Day Layout</h3>
            <p>
              Divide your commitments into four natural intervals: <strong>Morning, Afternoon, Evening, and Night</strong>. 
              Instead of an endless, flat list of tasks, build a routine that flows naturally with your day.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <img src="/icons/backlog.png" alt="Backlog Rescheduling" width="48" height="48" />
            </div>
            <h3>Guilt-Free Backlog System</h3>
            <p>
              Missed a habit? It doesn't disappear. It automatically moves to your **Backlog Panel**. 
              No red marks, no broken hearts, just a clean space to reschedule when you are ready.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <img src="/icons/heatmap.png" alt="Heatmap Matrix" width="48" height="48" />
            </div>
            <h3>Analytics Heatmap</h3>
            <p>
              Track your long-term consistency with a <strong>Github-style history matrix</strong>. 
              Watch your grid fill up with green blocks as you maintain your habits week after week.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <img src="/icons/streak.png" alt="Streak Tracking" width="48" height="48" />
            </div>
            <h3>Active Streaks</h3>
            <p>
              Keep the chain unbroken. Track your active daily streaks and your all-time longest streak 
              directly on the Tally page, computed securely on our database.
            </p>
          </div>
        </div>

        <div style={{
          border: "3px solid #000",
          background: "#fff",
          padding: "40px",
          boxShadow: "8px 8px 0 #000",
          marginBottom: "40px",
          lineHeight: "1.6"
        }}>
          <h2>How It Works Under the Hood</h2>
          <p>
            DayTree is designed for rapid execution and reliability. Here is how we ensure your data is always safe and quick to access:
          </p>
          <ul style={{ paddingLeft: "20px" }}>
            <li style={{ marginBottom: "10px" }}><strong>Database Indexing:</strong> We run optimized compound indexes on habit completions so your heatmaps load in milliseconds.</li>
            <li style={{ marginBottom: "10px" }}><strong>Secure Sessions:</strong> Support for password authentication with otp verification, plus fast Google OAuth integration.</li>
            <li style={{ marginBottom: "10px" }}><strong>Local Timezone Alignment:</strong> Daily rollovers align perfectly with your browser's local timezone.</li>
          </ul>
        </div>

        <div className="cta-box">
          <h2>Experience the features yourself</h2>
          <p>Sign up in less than 60 seconds. Free forever.</p>
          <Link to="/signup" className="btn-primary cta-btn">Get Started Now</Link>
        </div>
      </div>
    </PublicLayout>
  );
}

export default FeaturesPage;
