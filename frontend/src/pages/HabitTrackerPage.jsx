import { Link } from "react-router-dom";
import PublicLayout from "../app/layouts/PublicLayout";
import SEO from "../shared/components/SEO";

function HabitTrackerPage() {
  return (
    <PublicLayout>
      <SEO 
        title="Minimalist Habit Tracker App for Daily Consistency" 
        description="DayTree is a free, distraction-free habit tracker. Design a consistent daily routine, track your commitments, and see your progress in real-time." 
      />
      <div className="landing-features" style={{ margin: "40px auto" }}>
        <h1 className="section-title">Minimalist Habit Tracker</h1>
        <p className="section-subtitle">Ditch the noise. Build discipline one day at a time.</p>

        <div style={{
          border: "3px solid #000",
          background: "#fff",
          padding: "40px",
          boxShadow: "8px 8px 0 #000",
          marginBottom: "40px",
          lineHeight: "1.6"
        }}>
          <h2>What is a Habit Tracker?</h2>
          <p>
            A habit tracker is a simple tool that allows you to measure whether you did a habit or task. 
            By keeping a record of your completions, you create a visual proof of your progress. 
            <strong>DayTree</strong> takes this concept and applies a minimalist, brutalist aesthetic.
          </p>

          <h2 style={{ marginTop: "32px" }}>Why DayTree is the Ultimate Distraction-Free Habit Tracker</h2>
          <p>
            Most modern applications are designed to hook you into using the app itself. They rely on colorful 
            gamified dashboards, notification badges, and complex settings. DayTree is designed to help you 
            complete your habits and close the app.
          </p>
          <ul style={{ paddingLeft: "20px", marginTop: "16px" }}>
            <li style={{ marginBottom: "12px" }}>
              <strong>Stark Monochrome UI:</strong> Designed to minimize visual distraction and keep you focused on your tasks.
            </li>
            <li style={{ marginBottom: "12px" }}>
              <strong>Period Partitioning:</strong> Organize your habits into Morning, Afternoon, Evening, and Night intervals.
            </li>
            <li style={{ marginBottom: "12px" }}>
              <strong>Smart Backlog:</strong> Missed a habit? It moves to your backlog list, so you can reschedule it without guilt.
            </li>
          </ul>

          <h2 style={{ marginTop: "32px" }}>How to Build a Consistent Habit Routine</h2>
          <ol style={{ paddingLeft: "20px" }}>
            <li style={{ marginBottom: "10px" }}><strong>Start Small:</strong> Focus on 2 or 3 critical habits first. Do not overload your board.</li>
            <li style={{ marginBottom: "10px" }}><strong>Anchor Your Habits:</strong> Associate your habit with a time of day (e.g., Morning: Meditate; Evening: Read).</li>
            <li style={{ marginBottom: "10px" }}><strong>Stay Accountable:</strong> Check your board daily and monitor your completion heatmap.</li>
          </ol>
        </div>

        <div className="cta-box">
          <h2>Start tracking today</h2>
          <p>Create a free, secure account and configure your first habit in seconds.</p>
          <Link to="/signup" className="btn-primary cta-btn">Create Free Account</Link>
        </div>
      </div>
    </PublicLayout>
  );
}

export default HabitTrackerPage;
