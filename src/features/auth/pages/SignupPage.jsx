import { useAuth } from "../../../app/providers/authContext";
import AuthForm from "../components/AuthForm";

function SignupPage({ onModeChange }) {
  const { signup, authError, isAuthLoading } = useAuth();

  return (
    <AuthForm
      mode="signup"
      error={authError}
      isLoading={isAuthLoading}
      onSubmit={signup}
      onModeChange={onModeChange}
    />
  );
}

export default SignupPage;
