import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../app/providers/authContext";
import BrandMark from "../../../shared/components/BrandMark";
import AuthTreePanel from "../components/AuthTreePanel";

function VerifyEmailPage() {
  const { user, verifyOtp, resendOtpCode, logout, isAuthLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const email = searchParams.get("email") || user?.email || "";
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (!email) {
      setError("No email address provided. Please go back to login.");
    }
  }, [email]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit code.");
      return;
    }

    setError("");
    setInfoMessage("");
    setIsVerifying(true);

    try {
      await verifyOtp(email, otp);
      setInfoMessage("Verification successful! Redirecting you to profile setup...");
      setTimeout(() => {
        navigate("/profile-setup");
      }, 1000);
    } catch (err) {
      setError(err.message || "Failed to verify email. Please check your code.");
      setIsVerifying(false);
    }
  }

  async function handleResend() {
    if (!email || countdown > 0 || isResending) return;
    setIsResending(true);
    setError("");
    setInfoMessage("");
    try {
      await resendOtpCode(email);
      setInfoMessage("A new verification code has been sent to your email.");
      setCountdown(60);
    } catch (err) {
      setError(err.message || "Failed to resend verification code.");
    } finally {
      setIsResending(false);
    }
  }

  async function handleBackToLogin() {
    try {
      await logout();
      navigate("/login");
    } catch {
      navigate("/login");
    }
  }

  const isBusy = isVerifying || isAuthLoading || isResending;

  return (
    <main className="auth-shell">
      <section className="auth-frame">
        <form className="auth-card" onSubmit={handleSubmit}>
          <BrandMark size="medium" />
          <p className="auth-tagline">Grow daily. Stay consistent.</p>

          <h1>Verify Email</h1>
          <p style={{ marginBottom: "20px", color: "var(--color-text-secondary, #6b7280)", fontSize: "14px" }}>
            We've sent a 6-digit verification code to <strong>{email}</strong>
          </p>

          <div style={{ marginBottom: "20px" }}>
            <label 
              htmlFor="otp-input"
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "12px",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: "var(--color-text-secondary, #9ca3af)"
              }}
            >
              6-Digit Code
            </label>
            <input
              id="otp-input"
              type="text"
              maxLength={6}
              placeholder="e.g. 123456"
              value={otp}
              disabled={isBusy || !email}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                setOtp(val);
              }}
              style={{
                width: "100%",
                padding: "12px",
                fontSize: "20px",
                letterSpacing: "4px",
                textAlign: "center",
                borderRadius: "6px",
                border: "1px solid var(--color-border, #374151)",
                backgroundColor: "var(--color-bg-input, #1f2937)",
                color: "var(--color-text, #f9fafb)",
                outline: "none"
              }}
            />
          </div>

          {error && (
            <p className="form-error" style={{ color: "#ef4444", fontSize: "14px", margin: "0 0 16px 0" }}>
              {error}
            </p>
          )}

          {infoMessage && (
            <p style={{ color: "#10b981", fontSize: "14px", margin: "0 0 16px 0", textAlign: "center" }}>
              {infoMessage}
            </p>
          )}

          <button 
            className="auth-submit" 
            type="submit" 
            disabled={isBusy || !email || otp.length !== 6}
            style={{ width: "100%", marginBottom: "16px" }}
          >
            {isVerifying || isAuthLoading ? "Verifying..." : "Verify Code"}
          </button>

          <div 
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              marginTop: "12px"
            }}
          >
            <button
              type="button"
              disabled={isBusy || countdown > 0}
              onClick={handleResend}
              style={{
                border: "none",
                background: "none",
                color: (isBusy || countdown > 0) ? "var(--color-text-secondary, #9ca3af)" : "var(--color-primary, #6366f1)",
                cursor: (isBusy || countdown > 0) ? "not-allowed" : "pointer",
                fontSize: "14px",
                fontWeight: "500",
                padding: 0
              }}
            >
              {isResending ? "Sending..." : countdown > 0 ? `Resend Code (${countdown}s)` : "Resend Code"}
            </button>
            <button
              type="button"
              disabled={isBusy}
              onClick={handleBackToLogin}
              style={{
                border: "none",
                background: "none",
                color: isBusy ? "var(--color-text-secondary, #9ca3af)" : "var(--color-text-secondary, #9ca3af)",
                cursor: isBusy ? "not-allowed" : "pointer",
                fontSize: "14px",
                fontWeight: "500",
                padding: 0
              }}
            >
              Back to Login
            </button>
          </div>
        </form>

        <AuthTreePanel />
      </section>
    </main>
  );
}

export default VerifyEmailPage;
