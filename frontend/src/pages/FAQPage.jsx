import { Link } from "react-router-dom";
import PublicLayout from "../app/layouts/PublicLayout";
import SEO from "../shared/components/SEO";

function FAQPage() {
  const faqs = [
    {
      q: "What is DayTree?",
      a: "DayTree is a minimal, brutalist habit tracker designed to help you focus on your daily commitments. By removing visual noise and unnecessary features, DayTree keeps you focused on building and maintaining daily routines."
    },
    {
      q: "How does DayTree track habits?",
      a: "You create habits and assign them to specific periods of the day. As you complete them, you check them off. Any incomplete habit at the end of the day automatically moves to your backlog list, so you can reschedule it when ready without feeling guilt."
    },
    {
      q: "Can I track multiple habits?",
      a: "Yes, you can track as many daily habits as you need. However, to stay consistent and prevent burnout, we recommend starting with 3 to 5 core habits and expanding from there."
    },
    {
      q: "Does DayTree track habit streaks?",
      a: "Yes! The system calculates your active consecutive daily streaks and your longest streaks based on your completion history, displaying them on your Tally page."
    },
    {
      q: "Can I organize habits by time of day?",
      a: "Absolutely. DayTree organizes your board into four distinct periods: Morning, Afternoon, Evening, and Night. This helps you build habits that naturally fit into your existing daily routine."
    },
    {
      q: "Can I see my habit history?",
      a: "Yes, the Tally page features a Github-inspired contribution matrix/heatmap that displays your completion percentages for each day over the past several months."
    },
    {
      q: "Is DayTree free?",
      a: "Yes, DayTree is 100% free to use. All tracking features, history, and streaks are fully available without any paywalls."
    },
    {
      q: "Is DayTree available on mobile?",
      a: "Yes, the application is designed to be fully responsive. It works perfectly on desktop, tablet, and mobile browsers, and features large, touch-friendly tap targets."
    },
    {
      q: "How does habit tracking help with consistency?",
      a: "By tracking habits daily, you create a visual feedback loop that reinforces your discipline. Seeing your streak grow and your heatmap fill up acts as a powerful psychological trigger to stay consistent."
    }
  ];

  return (
    <PublicLayout>
      <SEO 
        title="Frequently Asked Questions — DayTree FAQ" 
        description="Got questions about DayTree? Find answers to questions about daily habit tracking, backlog scheduling, streak calculations, and our minimalist philosophy." 
      />
      <div className="landing-features" style={{ margin: "40px auto" }}>
        <h1 className="section-title">Frequently Asked Questions</h1>
        <p className="section-subtitle">Everything you need to know about DayTree.</p>

        <div style={{
          display: "grid",
          gap: "20px",
          marginBottom: "50px"
        }}>
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              style={{
                border: "3px solid #000",
                background: "#fff",
                padding: "24px",
                boxShadow: "5px 5px 0 #000"
              }}
            >
              <h3 style={{
                margin: "0 0 10px 0",
                fontFamily: "Arial, sans-serif",
                textTransform: "uppercase",
                fontSize: "18px",
                fontWeight: "900"
              }}>
                {faq.q}
              </h3>
              <p style={{
                margin: 0,
                lineHeight: "1.6",
                color: "#333"
              }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        <div className="cta-box">
          <h2>Still have questions?</h2>
          <p>The best way to understand DayTree is to try it. Setup takes less than a minute.</p>
          <Link to="/signup" className="btn-primary cta-btn">Try DayTree Free</Link>
        </div>
      </div>
    </PublicLayout>
  );
}

export default FAQPage;
