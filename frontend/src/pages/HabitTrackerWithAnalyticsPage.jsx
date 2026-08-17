import { Link } from "react-router-dom";
import PublicLayout from "../app/layouts/PublicLayout";
import SEO from "../shared/components/SEO";

function HabitTrackerWithAnalyticsPage() {
  return (
    <PublicLayout>
      <SEO 
        title="Habit Tracker with Analytics — Analyze Your Habits Visually" 
        description="Track your progress with DayTree's visual habit tracker analytics. Monitor completion averages, streaks, and fill out your consistency heatmap." 
      />
      <div className="landing-features" style={{ margin: "40px auto" }}>
        <h1 className="section-title">Habit Tracker with Analytics</h1>
        <p className="section-subtitle">Visualize your long-term consistency and make data-driven improvements.</p>

        <div style={{
          border: "3px solid #000",
          background: "#fff",
          padding: "40px",
          boxShadow: "8px 8px 0 #000",
          marginBottom: "40px",
          lineHeight: "1.6"
        }}>
          <h2>Why Visual Analytics Work</h2>
          <p>
            Numbers tell a story, but visual grids reveal patterns. By seeing your habits charted on a grid, 
            you can instantly spot which days of the week you struggle with, identify seasonal drops in consistency, 
            and track your progress over months rather than just days.
          </p>

          <h2 style={{ marginTop: "32px" }}>The DayTree Analytics Suite</h2>
          <p>
            DayTree provides a clean, distraction-free Tally dashboard that visualizes your statistics without 
            the usual bloat. Key analytical metrics include:
          </p>
          <ul style={{ paddingLeft: "20px", marginTop: "16px" }}>
            <li style={{ marginBottom: "12px" }}>
              <strong>GitHub-Style Heatmap:</strong> A dynamic historical matrix mapping your completions over the past months. As you complete habits, the blocks shift from white to shades of green.
            </li>
            <li style={{ marginBottom: "12px" }}>
              <strong>Daily Completion Averages:</strong> Track the average percentage of habits you complete each day to monitor overall productivity.
            </li>
            <li style={{ marginBottom: "12px" }}>
              <strong>Real-Time Database Tallies:</strong> All percentages and streak calculations are computed instantly via MongoDB aggregate pipelines on the backend, ensuring speed and reliability.
            </li>
          </ul>

          <h2 style={{ marginTop: "32px" }}>How to Leverage Analytics for Better Habits</h2>
          <ol style={{ paddingLeft: "20px" }}>
            <li style={{ marginBottom: "10px" }}><strong>Identify Weak Spots:</strong> Check if your heatmap shows lighter columns on weekends, and adjust your weekend routine.</li>
            <li style={{ marginBottom: "10px" }}><strong>Observe Trends:</strong> Watch your daily average percent. Aim for gradual, steady growth rather than sudden spikes of activity followed by burnout.</li>
            <li style={{ marginBottom: "10px" }}><strong>Celebrate Milestones:</strong> Use the filled heatmap blocks as a visual reward for your hard work.</li>
          </ol>
        </div>

        <div className="cta-box">
          <h2>Get visual insights into your discipline</h2>
          <p>Sign up now to build your consistency matrix. Free forever.</p>
          <Link to="/signup" className="btn-primary cta-btn">View My Analytics</Link>
        </div>
      </div>
    </PublicLayout>
  );
}

export default HabitTrackerWithAnalyticsPage;
