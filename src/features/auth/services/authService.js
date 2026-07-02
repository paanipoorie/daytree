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
