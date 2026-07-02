import { useState, useEffect } from "react";
import { 
  loginUser, 
  signupUser, 
  fetchCurrentUser, 
  logoutUser, 
  setupUserProfile 
} from "../../features/auth/services/authService";
import { AuthContext } from "./authContext";
import { getToken } from "../../shared/utils/apiClient";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true); // Start as true to check token first
  const [authError, setAuthError] = useState("");

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
        // Clear invalid token
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    }

    restoreSession();
  }, []);

  async function login(credentials) {
    setIsAuthLoading(true);
    setAuthError("");

    try {
      const loggedInUser = await loginUser(credentials);
      setUser(loggedInUser);
    } catch (err) {
      setAuthError(err.message || "Could not sign in.");
      throw err;
    } finally {
      setIsAuthLoading(false);
    }
  }

  async function signup(credentials) {
    setIsAuthLoading(true);
    setAuthError("");

    try {
      const createdUser = await signupUser(credentials);
      setUser(createdUser);
    } catch (err) {
      setAuthError(err.message || "Could not create account.");
      throw err;
    } finally {
      setIsAuthLoading(false);
    }
  }

  async function logout() {
    setIsAuthLoading(true);
    try {
      await logoutUser();
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err.message);
    } finally {
      setIsAuthLoading(false);
    }
  }

  async function completeOnboarding(username, file) {
    setIsAuthLoading(true);
    setAuthError("");
    try {
      const updatedUser = await setupUserProfile(username, file);
      setUser(updatedUser);
    } catch (err) {
      setAuthError(err.message || "Could not save profile.");
      throw err;
    } finally {
      setIsAuthLoading(false);
    }
  }

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isAuthLoading,
    authError,
    login,
    signup,
    logout,
    completeOnboarding,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
