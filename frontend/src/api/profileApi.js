// API service for profile and stats endpoints
const API_BASE_URL = 'http://localhost:8000';

const getAuthToken = () => {
  return localStorage.getItem('access_token');
};

const headers = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAuthToken()}`,
});

const handleUnauthorized = () => {
  // Limpiar tokens si recibimos 401
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  // Recargar la página para mostrar login
  window.location.reload();
};

export const profileApi = {
  // Get current user profile
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/me/`, {
      method: 'GET',
      headers: headers(),
    });
    if (response.status === 401) {
      handleUnauthorized();
      throw new Error('Token expirado, inicia sesión de nuevo');
    }
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await fetch(`${API_BASE_URL}/me/`, {
      method: 'PATCH',
      headers: headers(),
      body: JSON.stringify(profileData),
    });
    if (response.status === 401) {
      handleUnauthorized();
      throw new Error('Token expirado, inicia sesión de nuevo');
    }
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
  },

  // Get user statistics
  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/me/stats/`, {
      method: 'GET',
      headers: headers(),
    });
    if (response.status === 401) {
      handleUnauthorized();
      throw new Error('Token expirado, inicia sesión de nuevo');
    }
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },

  // Get global ranking data
  getRanking: async (limit = 25) => {
    const response = await fetch(`${API_BASE_URL}/ranking/?limit=${limit}`, {
      method: 'GET',
      headers: headers(),
    });
    if (response.status === 401) {
      handleUnauthorized();
      throw new Error('Token expirado, inicia sesión de nuevo');
    }
    if (!response.ok) throw new Error('Failed to fetch ranking');
    return response.json();
  },
};
