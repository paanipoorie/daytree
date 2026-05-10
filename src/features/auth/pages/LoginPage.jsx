import { useAuth } from "../../../app/providers/authContext";
import AuthForm from "../components/AuthForm";

function LoginPage({ onModeChange }) {
  const { login, authError, isAuthLoading } = useAuth();

  return (
    <AuthForm
      mode="login"
      error={authError}
      isLoading={isAuthLoading}
      onSubmit={login}
      onModeChange={onModeChange}
    />
  );
}

export default LoginPage;
