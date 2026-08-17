import PublicLayout from "../app/layouts/PublicLayout";
import SEO from "../shared/components/SEO";

function TermsPage() {
  return (
    <PublicLayout>
      <SEO 
        title="Terms of Service — DayTree" 
        description="Read the Terms of Service for DayTree to understand our rules, guidelines, user responsibilities, and service conditions." 
      />
      <div className="landing-features" style={{ margin: "40px auto" }}>
        <h1 className="section-title">Terms of Service</h1>
        <p className="section-subtitle">Last updated: August 17, 2026</p>

        <div style={{
          border: "3px solid #000",
          background: "#fff",
          padding: "40px",
          boxShadow: "8px 8px 0 #000",
          lineHeight: "1.6"
        }}>
          <h2>1. Agreement to Terms</h2>
          <p>
            By accessing and using DayTree, you agree to comply with and be bound by these Terms of Service. If you 
            do not agree to these terms, you should not access or use the platform.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            DayTree is a cloud-based habit tracking application. We provide tools to schedule habits, record completions, 
            and visualize statistics. The service is provided "as is" and "as available."
          </p>

          <h2>3. User Accounts</h2>
          <p>
            When you create an account, you must provide accurate, complete, and current information. You are responsible 
            for safeguarding your account credentials (password and OTP verification code) and for all activities 
            that occur under your account.
          </p>
          <p>
            We reserve the right to suspend or terminate accounts that violate our guidelines or abuse our APIs (e.g. 
            by bypass rate limits or scraping data).
          </p>

          <h2>4. Prohibited Uses</h2>
          <p>
            You agree not to use DayTree to:
          </p>
          <ul style={{ paddingLeft: "20px" }}>
            <li style={{ marginBottom: "10px" }}>Violate any local, state, national, or international laws.</li>
            <li style={{ marginBottom: "10px" }}>Interfere with or disrupt the security or performance of the servers and network nodes.</li>
            <li style={{ marginBottom: "10px" }}>Use automated scrapers, scripts, or bots to interact with the service.</li>
          </ul>

          <h2>5. Limitation of Liability</h2>
          <p>
            In no event shall Paanipoorie, its developers, or its affiliates be liable for any indirect, incidental, 
            special, consequential, or punitive damages resulting from your use of or inability to use the service.
          </p>

          <h2>6. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. We will notify you of any changes by updating the 
            date at the top of this page. Your continued use of the platform after changes are posted constitutes 
            your acceptance of the new terms.
          </p>

          <h2>7. Contact</h2>
          <p>
            For questions regarding these Terms of Service, please contact us at: <a href="mailto:support@paanipoorie.com" style={{ textDecoration: "underline", fontWeight: "bold" }}>support@paanipoorie.com</a>.
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}

export default TermsPage;
