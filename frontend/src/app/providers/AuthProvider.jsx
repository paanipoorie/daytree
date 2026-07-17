import { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { 
  loginUser, 
  signupUser, 
  fetchCurrentUser, 
  logoutUser, 
  setupUserProfile,
  googleLoginUser,
  verifyOtpCode,
  resendOtp
} from "../../features/auth/services/authService";
import { AuthContext } from "./authContext";
import { useToast } from "./useToast";
import { getToken, removeToken, abortAllActiveRequests } from "../../shared/utils/apiClient";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const { success: showSuccess, error: showError } = useToast();

  // Restore session on mount/refresh
  useEffect(() => {
    async function restoreSession() {
      const token = getToken();
      if (!token) {
        setIsAuthLoading(false);
        return;
      }

      try {
        const currentUser = await fetchCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error("Session restoration failed:", err.message);
        removeToken();
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    }

    restoreSession();
  }, []);

  const login = useCallback(async (credentials) => {
    setIsAuthLoading(true);
    setAuthError("");

    try {
      const loggedInUser = await loginUser(credentials);
      setUser(loggedInUser);
      showSuccess("Welcome back! You're signed in.");
    } catch (err) {
      setAuthError(err.message || "Could not sign in.");
      showError(err.message || "Could not sign in.");
      throw err;
    } finally {
      setIsAuthLoading(false);
    }
  }, [showSuccess, showError]);

  const signup = useCallback(async (credentials) => {
    setIsAuthLoading(true);
    setAuthError("");

    try {
      const createdUser = await signupUser(credentials);
      setUser(createdUser);
      showSuccess("Account created! Please verify your email to continue.");
    } catch (err) {
      setAuthError(err.message || "Could not create account.");
      showError(err.message || "Could not create account.");
      throw err;
    } finally {
      setIsAuthLoading(false);
    }
  }, [showSuccess, showError]);

  const loginWithGoogle = useCallback(async (idToken) => {
    setIsAuthLoading(true);
    setAuthError("");

    try {
      const loggedInUser = await googleLoginUser(idToken);
      setUser(loggedInUser);
      showSuccess("Welcome back! Signed in with Google.");
    } catch (err) {
      setAuthError(err.message || "Google authentication failed.");
      showError(err.message || "Google authentication failed.");
      throw err;
    } finally {
      setIsAuthLoading(false);
    }
  }, [showSuccess, showError]);

  const verifyOtp = useCallback(async (email, otp) => {
    setIsAuthLoading(true);
    setAuthError("");
    try {
      const verifiedUser = await verifyOtpCode(email, otp);
      setUser(verifiedUser);
      showSuccess("Email verified! Let's set up your profile.");
    } catch (err) {
      setAuthError(err.message || "Verification failed.");
      showError(err.message || "Verification failed.");
      throw err;
    } finally {
      setIsAuthLoading(false);
    }
  }, [showSuccess, showError]);

  const resendOtpCode = useCallback(async (email) => {
    setAuthError("");
    try {
      await resendOtp(email);
      showSuccess("A new verification code has been sent.");
    } catch (err) {
      setAuthError(err.message || "Failed to resend code.");
      showError(err.message || "Failed to resend code.");
      throw err;
    }
  }, [showSuccess, showError]);

  const logout = useCallback(async () => {
    abortAllActiveRequests();
    
    setIsAuthLoading(true);
    try {
      await logoutUser();
      setUser(null);
      showSuccess("You've been logged out.");
    } catch (err) {
      console.error("Logout failed:", err.message);
      setUser(null);
    } finally {
      setIsAuthLoading(false);
    }
  }, [showSuccess]);

  const completeOnboarding = useCallback(async (username, file) => {
    setIsAuthLoading(true);
    setAuthError("");
    try {
      const updatedUser = await setupUserProfile(username, file);
      setUser(updatedUser);
      showSuccess("Welcome to DayTree! 👋 Let's create your first habit.");
    } catch (err) {
      setAuthError(err.message || "Could not save profile.");
      showError(err.message || "Could not save profile.");
      throw err;
    } finally {
      setIsAuthLoading(false);
    }
  }, [showSuccess, showError]);

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    isAuthLoading,
    authError,
    login,
    signup,
    logout,
    completeOnboarding,
    loginWithGoogle,
    verifyOtp,
    resendOtpCode,
  }), [
    user,
    isAuthLoading,
    authError,
    login,
    signup,
    logout,
    completeOnboarding,
    loginWithGoogle,
    verifyOtp,
    resendOtpCode
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
