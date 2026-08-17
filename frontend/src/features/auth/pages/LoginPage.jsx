import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../app/providers/authContext";
import AuthForm from "../components/AuthForm";
import SEO from "../../../shared/components/SEO";

function LoginPage({ onModeChange }) {
  const { login, loginWithGoogle, authError, isAuthLoading } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(credentials) {
    try {
      await login(credentials);
    } catch (err) {
      if (err.message === "Please verify your email first") {
        navigate(`/verify-email?email=${encodeURIComponent(credentials.email)}`);
      }
      // Error already shown via toast in AuthProvider
    }
  }

  return (
    <>
      <SEO title="Login" robots="noindex, follow" description="Log in to your DayTree account to track your daily habits and review consistency analytics." />
      <AuthForm
        mode="login"
        error={authError}
        isLoading={isAuthLoading}
        onSubmit={handleSubmit}
        onGoogleSubmit={loginWithGoogle}
        onModeChange={onModeChange}
      />
    </>
  );
}

export default LoginPage;
