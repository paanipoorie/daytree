import { Link } from "react-router-dom";
import PublicLayout from "../app/layouts/PublicLayout";
import SEO from "../shared/components/SEO";

function HabitTrackerForStudentsPage() {
  return (
    <PublicLayout>
      <SEO 
        title="Habit Tracker for Students — Build Better Study Routines" 
        description="Designed for academic success, DayTree is the ultimate distraction-free habit tracker for students. Plan study sessions, track classes, and build study discipline." 
      />
      <div className="landing-features" style={{ margin: "40px auto" }}>
        <h1 className="section-title">Habit Tracker for Students</h1>
        <p className="section-subtitle">Manage study sessions, assignments, and daily student routines without distraction.</p>

        <div style={{
          border: "3px solid #000",
          background: "#fff",
          padding: "40px",
          boxShadow: "8px 8px 0 #000",
          marginBottom: "40px",
          lineHeight: "1.6"
        }}>
          <h2>Balancing Academics and Life</h2>
          <p>
            Student life is filled with unstructured time. Between lectures, assignments, and study sessions, 
            it is easy to lose track of daily priorities. DayTree helps students partition their days and build 
            reliable habits that fit their academic schedules.
          </p>

          <h2 style={{ marginTop: "32px" }}>Why Students Prefer DayTree</h2>
          <p>
            Traditional task managers are too complex, and social productivity apps introduce more distractions. 
            DayTree's minimal, monochrome design makes it the ideal tool for focusing on what matters.
          </p>
          <ul style={{ paddingLeft: "20px", marginTop: "16px" }}>
            <li style={{ marginBottom: "12px" }}>
              <strong>Period-Based Schedule:</strong> Group your habits around classes. Track morning prep, afternoon study sessions, and evening revision blocks.
            </li>
            <li style={{ marginBottom: "12px" }}>
              <strong>Zero Distraction:</strong> No notifications or gamification badges to draw you away from your desk.
            </li>
            <li style={{ marginBottom: "12px" }}>
              <strong>Smart Rescheduling:</strong> When midterms or deadlines hit, use the backlog system to reschedule habits without stress or broken chains.
            </li>
          </ul>

          <h2 style={{ marginTop: "32px" }}>Top Habits for Students to Track</h2>
          <ol style={{ paddingLeft: "20px" }}>
            <li style={{ marginBottom: "10px" }}><strong>Study Blocks:</strong> Track focused 50-minute Pomodoro study sessions.</li>
            <li style={{ marginBottom: "10px" }}><strong>Daily Review:</strong> Review class notes for 15 minutes every afternoon.</li>
            <li style={{ marginBottom: "10px" }}><strong>Physical Health:</strong> Track daily exercise, hydration, and sleep times to maintain brain performance.</li>
          </ol>
        </div>

        <div className="cta-box">
          <h2>Boost your academic performance today</h2>
          <p>Create your free account. No credit card required. Free forever.</p>
          <Link to="/signup" className="btn-primary cta-btn">Sign Up as a Student</Link>
        </div>
      </div>
    </PublicLayout>
  );
}

export default HabitTrackerForStudentsPage;
