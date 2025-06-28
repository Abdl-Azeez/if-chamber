// Utility function for admin API calls with proper error handling
export async function adminApiCall(url, options = {}) {
  const token = localStorage.getItem("token");
  
  if (!token) {
    throw new Error("No authentication token found. Please login again.");
  }

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    const data = await response.json();

    if (!response.ok) {
      // Handle authentication errors
      if (response.status === 401) {
        // Clear token and redirect to login
        localStorage.removeItem("token");
        window.location.href = "/admin/login";
        throw new Error(data.error || "Authentication failed. Please login again.");
      }
      
      throw new Error(data.error || data.message || "Request failed");
    }

    return data;
  } catch (error) {
    if (error.message.includes("Authentication failed") || error.message.includes("No authentication token")) {
      // Don't throw again, just redirect
      return;
    }
    throw error;
  }
}

// Helper function to check if user is authenticated
export function isAuthenticated() {
  const token = localStorage.getItem("token");
  return !!token;
}

// Helper function to logout user
export function logout() {
  localStorage.removeItem("token");
  window.location.href = "/admin/login";
} 