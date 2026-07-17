import { apiClient, setToken, removeToken } from "../../../shared/utils/apiClient";

/**
 * Log in an existing user
 * @param {Object} credentials - email, password
 * @returns {Promise<Object>} user data
 */
export async function loginUser(credentials) {
  const response = await apiClient("/api/v1/auth/login", {
    method: "POST",
    body: credentials,
  });

  const { user, token } = response.data;
  setToken(token);
  return user;
}

/**
 * Register a new user
 * @param {Object} credentials - email, password, username
 * @returns {Promise<Object>} user data
 */
export async function signupUser(credentials) {
  const response = await apiClient("/api/v1/auth/signup", {
    method: "POST",
    body: credentials,
  });

  const { user, token } = response.data;
  setToken(token);
  return user;
}

/**
 * Fetch current logged-in user profile details (useful for persistent session on page refresh)
 * @returns {Promise<Object>} user data
 */
export async function fetchCurrentUser() {
  const response = await apiClient("/api/v1/auth/me", {
    method: "GET",
  });
  return response.data.user;
}

/**
 * Log out user (calls backend and clears local storage token)
 */
export async function logoutUser() {
  try {
    await apiClient("/api/v1/auth/logout", {
      method: "POST",
    });
  } catch (error) {
    console.error("Logout request failed:", error.message);
  } finally {
    removeToken();
  }
}

/**
 * Log in / Sign up with Google OAuth token
 * @param {string} idToken - Google credential ID token
 * @returns {Promise<Object>} user data
 */
export async function googleLoginUser(idToken) {
  const response = await apiClient("/api/v1/auth/google", {
    method: "POST",
    body: { token: idToken },
  });

  const { user, token } = response.data;
  setToken(token);
  return user;
}

/**
 * Send OTP verification code
 * @param {string} email 
 */
export async function sendOtp(email) {
  const response = await apiClient("/api/v1/auth/send-otp", {
    method: "POST",
    body: { email },
  });
  return response.data;
}

/**
 * Verify OTP code
 * @param {string} email 
 * @param {string} otp 
 * @returns {Promise<Object>} user data
 */
export async function verifyOtpCode(email, otp) {
  const response = await apiClient("/api/v1/auth/verify-otp", {
    method: "POST",
    body: { email, otp },
  });

  const { user, token } = response.data;
  if (token) {
    setToken(token);
  }
  return user;
}

/**
 * Resend OTP verification code
 * @param {string} email 
 */
export async function resendOtp(email) {
  const response = await apiClient("/api/v1/auth/resend-otp", {
    method: "POST",
    body: { email },
  });
  return response.data;
}

/**
 * Update user onboarding profile picture and username
 * @param {String} username - Updated username
 * @param {File} file - Profile picture image file (optional)
 * @returns {Promise<Object>} updated user data
 */
export async function setupUserProfile(username, file) {
  const formData = new FormData();
  formData.append("username", username);
  if (file) {
    formData.append("profilePicture", file);
  }

  const response = await apiClient("/api/v1/users/setup-profile", {
    method: "POST",
    body: formData,
  });

  return response.data.user;
}

/**
 * Fetch public auth config (Google Client ID)
 * @returns {Promise<Object>} config data
 */
export async function fetchAuthConfig() {
  const response = await apiClient("/api/v1/auth/config", {
    method: "GET",
  });
  return response.data;
}
