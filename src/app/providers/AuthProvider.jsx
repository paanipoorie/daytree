import { useState } from "react";
import { loginUser, signupUser } from "../../features/auth/services/authService";
import { AuthContext } from "./authContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  async function login(credentials) {
    setIsAuthLoading(true);
    setAuthError("");

    try {
      const loggedInUser = await loginUser(credentials);
      setUser(loggedInUser);
    } catch {
      setAuthError("Could not sign in.");
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
    } catch {
      setAuthError("Could not create account.");
    } finally {
      setIsAuthLoading(false);
    }
  }

  function logout() {
    setUser(null);
  }

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isAuthLoading,
    authError,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
