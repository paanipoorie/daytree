import { Link } from "react-router-dom";
import PublicLayout from "../app/layouts/PublicLayout";
import SEO from "../shared/components/SEO";

function AboutPage() {
  return (
    <PublicLayout>
      <SEO 
        title="About Us — The Philosophy Behind DayTree" 
        description="Learn about the design philosophy, team, and technology behind DayTree—the brutalist habit tracker designed for focus and consistency." 
      />
      <div className="landing-features" style={{ margin: "40px auto" }}>
        <h1 className="section-title">About DayTree</h1>
        <p className="section-subtitle">Ditch the noise. Focus on what you actually do every day.</p>
        
        <div style={{
          border: "3px solid #000",
          background: "#fff",
          padding: "40px",
          boxShadow: "8px 8px 0 #000",
          marginBottom: "40px",
          lineHeight: "1.6"
        }}>
          <h2>Our Philosophy</h2>
          <p>
            Most habit trackers today are designed to grab your attention. They send constant notifications,
            nag you with gamified rings, and overwhelm you with statistics. 
          </p>
          <p>
            <strong>DayTree is different.</strong> Inspired by brutalist web design, we strip away all the friction
            and clutter. We believe that habit building is a quiet, personal daily discipline. You don't need
            another app to gamify your life—you need a simple, reliable dashboard that tells you what needs to be
            done today, and lets you do it.
          </p>

          <h2 style={{ marginTop: "30px" }}>Key Design Principles</h2>
          <ul style={{ paddingLeft: "20px" }}>
            <li style={{ marginBottom: "10px" }}><strong>Zero Fluff:</strong> No avatars leveling up, no virtual coins, no streaks that make you feel guilty. Just pure, daily tracking.</li>
            <li style={{ marginBottom: "10px" }}><strong>Monochrome Brutalism:</strong> A stark, high-contrast visual system that respects your cognitive load and device battery.</li>
            <li style={{ marginBottom: "10px" }}><strong>Day-Based Focus:</strong> Habits are partitioned by morning, afternoon, evening, and night. Complete them in their window, or let them roll to backlog.</li>
          </ul>

          <h2 style={{ marginTop: "30px" }}>The Team & Tech</h2>
          <p>
            DayTree was built by the developers at <strong>Paanipoorie</strong>. We build clean, high-performance web products that deliver utility first.
          </p>
          <p>
            DayTree is engineered using a modern JavaScript stack: <strong>React</strong> for fluid user interfaces, 
            <strong>Express and Node.js</strong> for a reliable API server, and <strong>MongoDB Atlas</strong> for secure cloud data storage.
          </p>

          <h2 style={{ marginTop: "30px" }}>Open Source & Support</h2>
          <p>
            We believe in open, discoverable web architectures. You can find the DayTree repository on GitHub or get in touch with our team for questions, feedback, or support at <a href="mailto:support@paanipoorie.com" style={{ textDecoration: "underline", fontWeight: "bold" }}>support@paanipoorie.com</a>.
          </p>
        </div>

        <div className="cta-box">
          <h2>Ready to build daily discipline?</h2>
          <p>Create your free account and start tracking your path today.</p>
          <Link to="/signup" className="btn-primary cta-btn">Create Free Account</Link>
        </div>
      </div>
    </PublicLayout>
  );
}

export default AboutPage;
