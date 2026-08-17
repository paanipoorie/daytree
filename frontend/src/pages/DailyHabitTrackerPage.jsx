import { Link } from "react-router-dom";
import PublicLayout from "../app/layouts/PublicLayout";
import SEO from "../shared/components/SEO";

function DailyHabitTrackerPage() {
  return (
    <PublicLayout>
      <SEO 
        title="Daily Habit Tracker App — Build Rhythms Every Day" 
        description="Optimize your day-to-day life with DayTree's daily habit tracker. Build consistent daily rhythms, manage backlogs, and stick to your goals." 
      />
      <div className="landing-features" style={{ margin: "40px auto" }}>
        <h1 className="section-title">Daily Habit Tracker</h1>
        <p className="section-subtitle">Sticking to a routine requires showing up every single day.</p>

        <div style={{
          border: "3px solid #000",
          background: "#fff",
          padding: "40px",
          boxShadow: "8px 8px 0 #000",
          marginBottom: "40px",
          lineHeight: "1.6"
        }}>
          <h2>Why Tracking Every Day Matters</h2>
          <p>
            The difference between a wish and a habit is consistency. Research shows that tracking your goals 
            daily dramatically increases the likelihood of long-term behavior change. By recording your completions 
            every day, you reinforce your identity as a disciplined person.
          </p>

          <h2 style={{ marginTop: "32px" }}>Features Engineered for Daily Use</h2>
          <p>
            DayTree is designed to be the fastest part of your daily routine. We want you to track your habits 
            and get back to your life. Here is how we support daily consistency:
          </p>
          <ul style={{ paddingLeft: "20px", marginTop: "16px" }}>
            <li style={{ marginBottom: "12px" }}>
              <strong>Local Timezone Alignment:</strong> Daily rollovers align perfectly with your browser's local timezone. You don't have to worry about UTC servers resetting your day early. Learn more in our <Link to="/blog/timezone-safe-habit-tracking" style={{ textDecoration: "underline", color: "#000" }}>Timezone-Safe Guide</Link>.
            </li>
            <li style={{ marginBottom: "12px" }}>
              <strong>Active Streaks:</strong> Track your current daily streak to build momentum and see how long you can keep the chain going.
            </li>
            <li style={{ marginBottom: "12px" }}>
              <strong>Distraction-Free Interface:</strong> No popups, ads, or social feeds. Just your daily checklist.
            </li>
          </ul>

          <h2 style={{ marginTop: "32px" }}>How to Succeed with a Daily Routine</h2>
          <ol style={{ paddingLeft: "20px" }}>
            <li style={{ marginBottom: "10px" }}><strong>Define Small Steps:</strong> Instead of "read 1 hour," start with "read 5 pages."</li>
            <li style={{ marginBottom: "10px" }}><strong>Integrate with Your Schedule:</strong> Divide habits into morning, afternoon, and night blocks.</li>
            <li style={{ marginBottom: "10px" }}><strong>Reschedule Missed Items:</strong> Use DayTree's backlog system to handle skipped days without breaking your motivation. Read about it in <Link to="/blog/backlog-resilient-habit-loop" style={{ textDecoration: "underline", color: "#000" }}>Backlog Resilience</Link>.</li>
          </ol>
        </div>

        <div className="cta-box">
          <h2>Start your daily habit tracking now</h2>
          <p>Create a free account and take control of your day-to-day discipline.</p>
          <Link to="/signup" className="btn-primary cta-btn">Start Tracking Today</Link>
        </div>
      </div>
    </PublicLayout>
  );
}

export default DailyHabitTrackerPage;
