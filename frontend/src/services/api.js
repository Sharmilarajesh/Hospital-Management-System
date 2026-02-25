const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const get = async (endpoint, token) => {
  try {
    const url = endpoint.startsWith('/') ? `${API_URL}${endpoint}` : `${API_URL}/${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });
    return await response.json();
  } catch (error) {
    console.log('API Error:', error);
    return { message: 'Network error' };
  }
};

export const post = async (endpoint, body, token) => {
  try {
    const url = endpoint.startsWith('/') ? `${API_URL}${endpoint}` : `${API_URL}/${endpoint}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify(body)
    });
    return await response.json();
  } catch (error) {
    console.log('API Error:', error);
    return { message: 'Network error' };
  }
};

export const put = async (endpoint, body, token) => {
  try {
    const url = endpoint.startsWith('/') ? `${API_URL}${endpoint}` : `${API_URL}/${endpoint}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify(body)
    });
    return await response.json();
  } catch (error) {
    console.log('API Error:', error);
    return { message: 'Network error' };
  }
};

export const del = async (endpoint, token) => {
  try {
    const url = endpoint.startsWith('/') ? `${API_URL}${endpoint}` : `${API_URL}/${endpoint}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });
    return await response.json();
  } catch (error) {
    console.log('API Error:', error);
    return { message: 'Network error' };
  }
};