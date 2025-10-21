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
  
  console.log('Uploading file:', {
    name: file.name,
    size: file.size,
    type: file.type,
    isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  });
  
  try {
    const response = await axios.post(`${API_URL}/api/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000 // 1 dakika timeout
    });
    
    console.log('Upload successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Upload error:', error);
    
    // Mobil için özel error handling
    if (error.code === 'ECONNABORTED') {
      throw new Error('Dosya yükleme zaman aşımına uğradı. Tekrar deneyin.');
    } else if (error.response?.status === 413) {
      throw new Error('Dosya çok büyük. Daha küçük bir fotoğraf seçin.');
    }
    
    throw error;
  }
};

export const processImage = async (imageData, selections) => {
  try {
    // Mobil uyumluluk için hem base64 hem de file object'i kontrol et
    let imageUrl = imageData;
    
    // Eğer imageData bir File object ise, önce upload et
    if (imageData instanceof File) {
      console.log('File object detected, uploading first...');
      const uploadResult = await uploadImage(imageData);
      imageUrl = uploadResult.imageUrl;
    }
    
    console.log('🌐 API_URL:', API_URL);
    console.log('📤 Sending process request to backend...', {
      hasImageUrl: !!imageUrl,
      imageUrlLength: imageUrl?.length || 0,
      imageUrlType: typeof imageUrl,
      selections,
      isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    });
    
    // Test: Backend'e erişilebiliyor mu?
    try {
      const testResponse = await axios.get(`${API_URL}/health`, { timeout: 5000 });
      console.log('✅ Backend health check OK:', testResponse.data);
    } catch (healthError) {
      console.error('❌ Backend health check FAILED:', healthError.message);
      throw new Error(`Backend erişilemedi: ${API_URL} - ${healthError.message}`);
    }
    
    const response = await axios.post(`${API_URL}/api/process`, {
      imageUrl,
      selections
    }, {
      timeout: 300000, // 5 dakika timeout (mobil için uzun)
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Process response received:', response.data);
    return response.data;
  } catch (error) {
    console.error('Process error:', error);
    
    // Mobil için daha detaylı error handling
    if (error.code === 'ECONNABORTED') {
      throw new Error('İstek zaman aşımına uğradı. Lütfen tekrar deneyin.');
    } else if (error.response?.status === 413) {
      throw new Error('Dosya çok büyük. Daha küçük bir fotoğraf seçin.');
    } else if (error.response?.status === 403) {
      throw new Error('Kullanım limitiniz doldu. Premium\'a geçin.');
    } else if (error.response?.status >= 500) {
      throw new Error('Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
    } else if (!error.response) {
      throw new Error('İnternet bağlantınızı kontrol edin.');
    }
    
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