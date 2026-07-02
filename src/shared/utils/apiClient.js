const TOKEN_KEY = 'daytree_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Perform an HTTP request to the API
 * @param {String} url - API Endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} Response data
 */
export async function apiClient(url, options = {}) {
  const token = getToken();
  
  const headers = {
    ...options.headers,
  };
  
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // If the body is a plain object, stringify it and set Content-Type header
  let body = options.body;
  if (body && !(body instanceof FormData) && typeof body === 'object') {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
    body,
  });
  
  let result;
  try {
    result = await response.json();
  } catch {
    result = { success: false, message: 'Invalid response from server' };
  }
  
  if (!response.ok) {
    // If unauthorized, we could clear local token, but let caller handle it
    throw new Error(result.message || 'API request failed');
  }
  
  return result;
}
