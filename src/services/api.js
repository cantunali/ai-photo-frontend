import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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