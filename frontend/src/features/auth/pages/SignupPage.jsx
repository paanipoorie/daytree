import { useAuth } from "../../../app/providers/authContext";
import AuthForm from "../components/AuthForm";

function SignupPage({ onModeChange }) {
  const { signup, loginWithGoogle, authError, isAuthLoading } = useAuth();

  return (
    <AuthForm
      mode="signup"
      error={authError}
      isLoading={isAuthLoading}
      onSubmit={signup}
      onGoogleSubmit={loginWithGoogle}
      onModeChange={onModeChange}
    />
  );
}

export default SignupPage;
