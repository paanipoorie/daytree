import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../app/providers/authContext";
import AuthForm from "../components/AuthForm";

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
    <AuthForm
      mode="signup"
      error={authError}
      isLoading={isAuthLoading}
      onSubmit={handleSubmit}
      onGoogleSubmit={loginWithGoogle}
      onModeChange={onModeChange}
    />
  );
}

export default SignupPage;
