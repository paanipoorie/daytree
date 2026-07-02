import AuthActions from "./AuthActions";
import AuthInput from "./AuthInput";
import AuthTreePanel from "./AuthTreePanel";
import BrandMark from "../../../shared/components/BrandMark";
import { useAuthForm } from "../hooks/useAuthForm";

function AuthForm({ mode, error, isLoading, onSubmit, onModeChange }) {
  const isLogin = mode === "login";
  const {
    values,
    showPassword,
    updateField,
    togglePasswordVisibility,
  } = useAuthForm({
    email: "",
    password: "",
  });

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(values);
  }

  return (
    <main className="auth-shell">
      <section className="auth-frame">
        <form className="auth-card" onSubmit={handleSubmit}>
          <BrandMark size="medium" />
          <p className="auth-tagline">Grow daily. Stay consistent.</p>

          <h1>{isLogin ? "Sign In" : "Create Account"}</h1>
          <p>Enter your credentials</p>

          <AuthInput
            label="Email"
            type="email"
            name="email"
            value={values.email}
            disabled={isLoading}
            onChange={updateField}
          />

          <div className="password-row">
            <AuthInput
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={values.password}
              disabled={isLoading}
              onChange={updateField}
            />

            <button type="button" disabled={isLoading} onClick={togglePasswordVisibility}>
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {isLogin && (
            <div className="auth-options">
              <label>
                <input type="checkbox" disabled={isLoading} /> Remember me
              </label>
              <button type="button" disabled={isLoading}>Forgot Password?</button>
            </div>
          )}

          {error && <p className="form-error">{error}</p>}

          <button className="auth-submit" type="submit" disabled={isLoading}>
            {isLoading ? "Working..." : isLogin ? "Sign In" : "Create Account"}
          </button>

          <AuthActions mode={mode} onModeChange={onModeChange} />
        </form>

        <AuthTreePanel />
      </section>
    </main>
  );
}

export default AuthForm;
