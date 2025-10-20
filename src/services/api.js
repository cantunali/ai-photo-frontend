import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Token'ı localStorage'dan al
const getToken = () => {
  return localStorage.getItem('authToken');
};

// Axios interceptor ekle
axios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  
  try {
    const response = await axios.post(`${API_URL}/api/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

export const processImage = async (imageUrl, selections) => {
  try {
    const response = await axios.post(`${API_URL}/api/process`, {
      imageUrl,
      selections
    });
    return response.data;
  } catch (error) {
    console.error('Process error:', error);
    throw error;
  }
};

// Authentication API functions
export const verifyToken = async (idToken) => {
  try {
    console.log('API_URL:', API_URL);
    console.log('Sending idToken to backend, length:', idToken?.length);
    
    const response = await axios.post(`${API_URL}/api/auth/verify`, {
      idToken
    });
    
    console.log('Backend response received:', response.data);
    
    // Token'ı localStorage'a kaydet
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      console.log('Auth token saved to localStorage');
    }
    
    return response.data;
  } catch (error) {
    console.error('Token verification error:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    throw error;
  }
};

export const getUserInfo = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/auth/user`);
    return response.data;
  } catch (error) {
    console.error('Get user info error:', error);
    throw error;
  }
};