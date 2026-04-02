// src/utils/api.ts

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  // 1. Grab the current access token
  let token = localStorage.getItem('access') || localStorage.getItem('token');

  // 2. Set up the standard headers
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
    ...options.headers,
  };

  // 3. Make the initial request to Django
  let response = await fetch(url, { ...options, headers, credentials: 'include' });

  // 4. THE MAGIC: If Django says the token is expired (401), intercept it!
  if (response.status === 401) {
    console.warn("⚠️ Access token expired! Attempting silent refresh...");

    try {
      // Ask Django's refresh endpoint for a new token
      const refreshResponse = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
        method: 'POST',
        credentials: 'include', // 🚨 Crucial: Sends the secure refresh cookie!
        headers: { 'Content-Type': 'application/json' }
      });

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        
        // Save the brand new token
        if (data.access) {
          localStorage.setItem('access', data.access);
          token = data.access;
        }

        console.log("✅ Token successfully refreshed! Retrying original request...");

        // 5. Retry the original request with the NEW token
        const retryHeaders = {
          ...headers,
          'Authorization': `Bearer ${token}`
        };

        response = await fetch(url, { ...options, headers: retryHeaders, credentials: 'include' });
      } else {
        // The refresh token is ALSO expired. The user must log in again.
        console.error("🚨 Refresh failed. Forcing logout.");
        localStorage.removeItem('access');
        localStorage.removeItem('token');
        window.location.href = '/'; // Send them back to the login screen
      }
    } catch (refreshError) {
      console.error("Network error during refresh:", refreshError);
    }
  }

  // Return the final response (either the original success, or the retry success)
  return response;
};