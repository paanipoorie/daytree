import PublicLayout from "../app/layouts/PublicLayout";
import SEO from "../shared/components/SEO";

function PrivacyPage() {
  return (
    <PublicLayout>
      <SEO 
        title="Privacy Policy — DayTree" 
        description="Read the Privacy Policy for DayTree to understand how we protect and manage your personal data and habit tracking statistics." 
      />
      <div className="landing-features" style={{ margin: "40px auto" }}>
        <h1 className="section-title">Privacy Policy</h1>
        <p className="section-subtitle">Last updated: August 17, 2026</p>

        <div style={{
          border: "3px solid #000",
          background: "#fff",
          padding: "40px",
          boxShadow: "8px 8px 0 #000",
          lineHeight: "1.6"
        }}>
          <h2>1. Introduction</h2>
          <p>
            At DayTree, we respect your privacy and are committed to protecting your personal data. This Privacy Policy 
            explains how we collect, store, and use your information when you visit our website and use our application.
          </p>

          <h2>2. Information We Collect</h2>
          <ul style={{ paddingLeft: "20px" }}>
            <li style={{ marginBottom: "10px" }}><strong>Account Details:</strong> We collect your email address, username, and password hash when you register an account. If you sign in via Google, we receive your email and profile picture.</li>
            <li style={{ marginBottom: "10px" }}><strong>Habit Data:</strong> We collect the names, schedules, periods, and completion states of the habits you track on the platform.</li>
            <li style={{ marginBottom: "10px" }}><strong>Profile Pictures:</strong> If you upload a profile picture, we store it securely via Cloudinary.</li>
          </ul>

          <h2>3. How We Use Your Data</h2>
          <p>
            We use your data strictly to operate, maintain, and provide the features of the DayTree application. 
            Specifically, we use it to authenticate your login, save your habits, calculate your completion percentages, 
            render your streaks, and show your activity heatmap.
          </p>
          <p>
            We do not sell, trade, or share your personal data with third-party advertisers or data brokers.
          </p>

          <h2>4. Data Retention & Security</h2>
          <p>
            Your account and habit data are stored in a secure cloud database hosted on MongoDB Atlas. We implement 
            password hashing using bcrypt and secure routes using JWT (JSON Web Tokens). 
          </p>
          <p>
            Your data is stored for as long as your account remains active. You can request deletion of your account and 
            all associated habits at any time by contacting us.
          </p>

          <h2>5. Cookies & Tracking</h2>
          <p>
            We use minimal cookies necessary for authentication and session management. We do not use third-party 
            advertising cookies or cross-site tracking systems.
          </p>

          <h2>6. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy or your data, please contact us at: <a href="mailto:support@paanipoorie.com" style={{ textDecoration: "underline", fontWeight: "bold" }}>support@paanipoorie.com</a>.
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}

export default PrivacyPage;
