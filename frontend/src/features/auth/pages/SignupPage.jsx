import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../app/providers/authContext";
import AuthForm from "../components/AuthForm";
import SEO from "../../../shared/components/SEO";

function SignupPage({ onModeChange }) {
  const { signup, loginWithGoogle, authError, isAuthLoading } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(credentials) {
    try {
      await signup(credentials);
      navigate(`/verify-email?email=${encodeURIComponent(credentials.email)}`);
    } catch {
      // Error handled in AuthProvider via toast
    }
  }

  return (
    <>
      <SEO title="Sign Up" robots="noindex, follow" description="Create a DayTree account to start building consistency and growing your personal tree of daily habits." />
      <AuthForm
        mode="signup"
        error={authError}
        isLoading={isAuthLoading}
        onSubmit={handleSubmit}
        onGoogleSubmit={loginWithGoogle}
        onModeChange={onModeChange}
      />
    </>
  );
}

export default SignupPage;
