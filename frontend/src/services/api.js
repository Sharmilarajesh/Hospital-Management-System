const API_URL = 'http://localhost:5000/api';  // NO trailing slash!

// GET 
export const get = async (endpoint, token) => {
  try {
    const url = endpoint.startsWith('/') ? `${API_URL}${endpoint}` : `${API_URL}/${endpoint}`;
    console.log('GET Request to:', url); 
    
    const response = await fetch(url, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });
    const data = await response.json();
    console.log('GET Response:', data); 
    return data;
  } catch (error) {
    console.log('API Error:', error);
    return { message: 'Network error' };
  }
};

// POST 
export const post = async (endpoint, body, token) => {
  try {
    const url = endpoint.startsWith('/') ? `${API_URL}${endpoint}` : `${API_URL}/${endpoint}`;
    console.log('POST Request to:', url); 
    console.log('POST Body:', body); 
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    console.log('POST Response:', data); 
    return data;
  } catch (error) {
    console.log('API Error:', error);
    return { message: 'Network error' };
  }
};

// PUT 
export const put = async (endpoint, body, token) => {
  try {
    const url = endpoint.startsWith('/') ? `${API_URL}${endpoint}` : `${API_URL}/${endpoint}`;
    console.log('PUT Request to:', url); 
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('API Error:', error);
    return { message: 'Network error' };
  }
};

// DELETE 
export const del = async (endpoint, token) => {
  try {
    const url = endpoint.startsWith('/') ? `${API_URL}${endpoint}` : `${API_URL}/${endpoint}`;
    console.log('DELETE Request to:', url);
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('API Error:', error);
    return { message: 'Network error' };
  }
};