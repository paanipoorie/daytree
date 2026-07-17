const TOKEN_KEY = 'daytree_token';

// Global registry of active AbortControllers to cancel in-flight requests on logout
const activeControllers = new Set();

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
 * Abort all active API requests (to prevent late response delivery across users)
 */
export function abortAllActiveRequests() {
  for (const controller of activeControllers) {
    try {
      controller.abort();
    } catch (err) {
      console.error('Failed to abort request:', err);
    }
  }
  activeControllers.clear();
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
  
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

  // Setup AbortController if not provided in options
  let controller;
  let signal = options.signal;
  if (!signal) {
    controller = new AbortController();
    signal = controller.signal;
    // Don't abort logout requests to ensure server session is cleaned up
    if (url !== '/api/v1/auth/logout' && !options.bypassAbortRegister) {
      activeControllers.add(controller);
    }
  }

  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers,
      body,
      signal,
    });
    
    let result;
    try {
      result = await response.json();
    } catch {
      if (response.status >= 500) {
        result = { success: false, message: 'Server error. Please try again later.' };
      } else {
        result = { success: false, message: 'Invalid response from server' };
      }
    }
    
    if (!response.ok) {
      let errMsg = result.message || 'Request failed';
      
      // Provide user-friendly messages for common error scenarios
      if (response.status === 401) {
        if (url.includes('/login') || url.includes('/signup')) {
          errMsg = result.message || 'Invalid credentials';
        } else {
          errMsg = 'Your session has expired. Please log in again.';
        }
      } else if (response.status === 403) {
        errMsg = 'You do not have permission to perform this action.';
      } else if (response.status === 404) {
        errMsg = 'The requested resource was not found.';
      } else if (response.status === 413) {
        errMsg = 'File too large. Please upload a smaller image.';
      } else if (response.status >= 500) {
        errMsg = 'Server error. Please try again later.';
      } else if (result.errors && result.errors.length > 0) {
        errMsg = result.errors.map(e => e.message).join(', ');
      }
      
      throw new Error(errMsg);
    }
    
    return result;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error;
    }
    // Network error (connection refused, DNS, etc.)
    if (error instanceof TypeError && (error.message.includes('fetch') || error.message.includes('Failed to fetch') || error.message.includes('Load failed'))) {
      throw new Error('Network error. Check your connection and try again.');
    }
    throw error;
  } finally {
    if (controller) {
      activeControllers.delete(controller);
    }
  }
}
