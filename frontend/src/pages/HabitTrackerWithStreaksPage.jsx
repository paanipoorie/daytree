import { Link } from "react-router-dom";
import PublicLayout from "../app/layouts/PublicLayout";
import SEO from "../shared/components/SEO";

function HabitTrackerWithStreaksPage() {
  return (
    <PublicLayout>
      <SEO 
        title="Habit Tracker with Streaks — Build Unstoppable Momentum" 
        description="Track your active streaks and longest consistency counts with DayTree. Learn the science behind habit chains and how to build daily discipline." 
      />
      <div className="landing-features" style={{ margin: "40px auto" }}>
        <h1 className="section-title">Habit Tracker with Streaks</h1>
        <p className="section-subtitle">Keep the chain unbroken. Track your active daily consistency streaks.</p>

        <div style={{
          border: "3px solid #000",
          background: "#fff",
          padding: "40px",
          boxShadow: "8px 8px 0 #000",
          marginBottom: "40px",
          lineHeight: "1.6"
        }}>
          <h2>The Psychology of Streaks</h2>
          <p>
            Jerry Seinfeld famously described his productivity hack: write every day, and cross it off on a 
            wall calendar. After a few days, you have a chain. "Your only job," he said, "is to not break the chain."
            A streak creates a visible momentum that makes it painful to quit, pushing you to show up even on tough days.
          </p>

          <h2 style={{ marginTop: "32px" }}>How DayTree Calculates Streaks</h2>
          <p>
            DayTree provides real-time tracking of both your <strong>Active Streak</strong> and your 
            <strong>Longest Streak</strong>. Unlike apps that store calculations locally, our statistics are computed 
            securely on the backend using Mongoose database queries.
          </p>
          <ul style={{ paddingLeft: "20px", marginTop: "16px" }}>
            <li style={{ marginBottom: "12px" }}>
              <strong>Current Active Streak:</strong> The number of consecutive days you have completed at least one habit, leading up to today.
            </li>
            <li style={{ marginBottom: "12px" }}>
              <strong>Longest All-Time Streak:</strong> The historical peak number of consecutive days you've maintained your completions.
            </li>
            <li style={{ marginBottom: "12px" }}>
              <strong>Timezone Safety:</strong> Because completions are stored as local date strings, your streaks remain completely intact when you travel.
            </li>
          </ul>

          <h2 style={{ marginTop: "32px" }}>The Healthy Way to View Streaks</h2>
          <p>
            Streaks are a great guide, but they shouldn't become a source of anxiety. If you miss a day, your active 
            streak will reset to zero, but your long-term consistency is what counts. Use DayTree's backlog system 
            to reschedule missed habits without losing your momentum. Learn more in our article about 
            <Link to="/blog/backlog-resilient-habit-loop" style={{ textDecoration: "underline", color: "#000" }}>Backlog Resilience</Link>.
          </p>
        </div>

        <div className="cta-box">
          <h2>Start building your streak today</h2>
          <p>Register in seconds and see how long you can keep the chain going.</p>
          <Link to="/signup" className="btn-primary cta-btn">Start My Streak</Link>
        </div>
      </div>
    </PublicLayout>
  );
}

export default HabitTrackerWithStreaksPage;
