import React, { useState, useCallback, useEffect } from 'react';
import { Upload, Camera, ChevronRight, Check, Loader2, Download, ArrowLeft, Sparkles, Palette, MapPin, Image, LogOut, User, Crown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { uploadImage, processImage as processImageAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const MainApp = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [uploadMethod, setUploadMethod] = useState('file');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState(null);
  const [error, setError] = useState('');
  const [userUsage, setUserUsage] = useState({ used: 0, limit: 5, remaining: 5 });
  const [userRole, setUserRole] = useState('free');
  const [debugLog, setDebugLog] = useState([]); // Debug log for mobile
  
  // Seçim state'leri
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedEnvironment, setSelectedEnvironment] = useState('');
  
  // Mobile debug logger
  const addDebugLog = (message, data = null) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}${data ? '\n' + JSON.stringify(data, null, 2) : ''}`;
    console.log(logEntry);
    setDebugLog(prev => [...prev.slice(-20), logEntry]); // Keep last 20 logs
  };

  // Stil seçenekleri
  const clothingStyles = [
    { id: 'suit', label: 'Takım Elbise', icon: '👔', description: 'Profesyonel iş görünümü' },
    { id: 'smart_casual', label: 'Smart Casual', icon: '👕', description: 'Şık günlük kombinler' },
    { id: 'casual', label: 'Günlük', icon: '👖', description: 'Rahat günlük kıyafetler' },
    { id: 'sport', label: 'Spor', icon: '🏃', description: 'Aktif ve sportif' },
    { id: 'business', label: 'Business', icon: '💼', description: 'İş kıyafetleri' },
    { id: 'party', label: 'Parti', icon: '🎉', description: 'Gece ve parti kıyafetleri' }
  ];

  // Renk seçenekleri
  const colorOptions = [
    { id: 'black', hex: '#000000', label: 'Siyah' },
    { id: 'navy', hex: '#1e3a8a', label: 'Lacivert' },
    { id: 'gray', hex: '#6b7280', label: 'Gri' },
    { id: 'white', hex: '#ffffff', label: 'Beyaz', border: true },
    { id: 'blue', hex: '#2563eb', label: 'Mavi' },
    { id: 'burgundy', hex: '#881337', label: 'Bordo' },
    { id: 'brown', hex: '#7c2d12', label: 'Kahverengi' },
    { id: 'beige', hex: '#d4d4d8', label: 'Bej' }
  ];

  // Ortam seçenekleri
  const environments = [
    { id: 'office', label: 'Ofis', icon: '🏢', prompt: 'Professional office environment' },
    { id: 'beach', label: 'Deniz Kenarı', icon: '🏖️', prompt: 'Beach seaside environment' },
    { id: 'cafe', label: 'Kafe', icon: '☕', prompt: 'Cafe restaurant environment' },
    { id: 'party', label: 'Parti', icon: '🎊', prompt: 'Party nightclub environment' },
    { id: 'outdoor', label: 'Açık Hava', icon: '🌳', prompt: 'Outdoor nature park environment' },
    { id: 'studio', label: 'Stüdyo', icon: '📸', prompt: 'Professional studio environment' },
    { id: 'city', label: 'Şehir', icon: '🏙️', prompt: 'Urban city environment' },
    { id: 'home', label: 'Ev', icon: '🏠', prompt: 'Cozy home environment' }
  ];

  // Kullanıcı bilgisini al
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const token = localStorage.getItem('authToken');
        if (token) {
          const response = await axios.get(`${API_URL}/api/auth/user`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const userData = response.data.user;
          setUserRole(userData.role || 'free');
          setUserUsage(userData.usage || { used: 0, limit: 5, remaining: 5 });
        }
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    };
    fetchUserInfo();
  }, []);

  // Dosya yükleme
  const handleFileUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      // Android Chrome uyumluluğu için file size kontrolü
      if (file.size > 10 * 1024 * 1024) {
        setError('Dosya boyutu 10MB\'dan büyük olamaz');
        return;
      }
      
      // Mobil uyumluluk için hem FileReader hem de direkt file object'i sakla
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageFile({
          base64: e.target.result,
          file: file, // Original file object'i de sakla
          name: file.name,
          size: file.size,
          type: file.type
        });
        setImageUrl('');
        setError('');
        console.log('File uploaded successfully:', {
          name: file.name,
          size: file.size,
          type: file.type
        });
      };
      
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        setError('Dosya okuma hatası. Lütfen tekrar deneyin.');
      };
      
      reader.readAsDataURL(file);
    } else {
      setError('Lütfen geçerli bir resim dosyası seçin (JPEG, PNG, WebP)');
    }
  };

  // Drag & Drop
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  }, []);

  // URL'den yükleme
  const handleUrlUpload = () => {
    if (imageUrl && imageUrl.trim()) {
      setImageFile(imageUrl);
      setError('');
    } else {
      setError('Lütfen geçerli bir URL girin');
    }
  };

  // İndirme fonksiyonu
  const downloadImage = async () => {
    if (processedImage) {
      try {
        // Cloudinary URL'sinden indirme
        const response = await fetch(processedImage);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `ai-photo-${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        // Hata durumunda direkt link ile indir
        const link = document.createElement('a');
        link.href = processedImage;
        link.download = `ai-photo-${Date.now()}.jpg`;
        link.target = '_blank';
        link.setAttribute('download', '');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  // N8N'e gönderme (Demo)
  const processImage = async () => {
    setIsProcessing(true);
    setCurrentStep(4);
    
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    addDebugLog('🚀 Process başladı');
    addDebugLog('🌐 API URL', { url: API_URL });
    
    try {
      // Mobil uyumluluk için file object'i öncelikle kullan
      const imageData = imageFile?.file || imageFile?.base64 || imageFile;
      addDebugLog('📷 Image data hazır', {
        hasFile: !!imageFile?.file,
        hasBase64: !!imageFile?.base64,
        dataType: typeof imageData
      });
      
      addDebugLog('🎨 Seçimler gönderiliyor', {
        style: selectedStyle,
        color: selectedColor,
        environment: selectedEnvironment
      });
      
      const result = await processImageAPI(imageData, {
        clothingStyle: selectedStyle,
        clothingColor: selectedColor,
        environment: selectedEnvironment
      });
      
      addDebugLog('✅ Backend response alındı', result);
      
      // N8N'den gelen gerçek resmi göster
      if (result.processedImageUrl && !result.demo) {
        setProcessedImage(result.processedImageUrl);
      } else {
        setProcessedImage(result.imageUrl || imageFile);
      }
      
      // Kullanım bilgisini güncelle
      if (result.usage) {
        setUserUsage(result.usage);
      }
      
      setIsProcessing(false);
      setCurrentStep(5);
    } catch (error) {
      console.error('Process error:', error);
      addDebugLog('❌ Hata oluştu', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Limit aşıldı hatası
      if (error.response?.data?.limitReached) {
        setError(error.response.data.message + ' Premium\'a geçmek için tıklayın.');
        setCurrentStep(3); // Onay sayfasına geri dön
      } else {
        setError(error.message || 'İşlem sırasında hata oluştu');
      }
      
      setIsProcessing(false);
    }
  };

  // Adım kontrolü
  const nextStep = () => {
    if (currentStep === 1 && !imageFile) {
      setError('Lütfen bir fotoğraf yükleyin');
      return;
    }
    if (currentStep === 2 && (!selectedStyle || !selectedColor || !selectedEnvironment)) {
      setError('Lütfen tüm seçimleri yapın');
      return;
    }
    if (currentStep === 3) {
      processImage();
      return;
    }
    setError('');
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError('');
    }
  };

  const reset = () => {
    setCurrentStep(1);
    setImageFile(null);
    setImageUrl('');
    setSelectedStyle('');
    setSelectedColor('');
    setSelectedEnvironment('');
    setProcessedImage(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="w-full px-6 py-4">
          <div className="max-w-screen-2xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  AI Fotoğraf Dönüştürücü
                </h1>
              </div>
              
              {/* User Menu */}
              <div className="flex items-center gap-4">
                {/* Usage Badge */}
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  userRole === 'premium' 
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {userRole === 'premium' ? (
                    <span>⭐ Premium {userUsage.used}/{userUsage.limit}</span>
                  ) : (
                    <span>📸 {userUsage.remaining}/{userUsage.limit} kaldı</span>
                  )}
                </div>
                
                {/* Premium Button (Free users only) */}
                {userRole === 'free' && (
                  <Link 
                    to="/premium"
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 text-white rounded-lg font-bold hover:shadow-2xl hover:scale-105 transition-all animate-pulse shadow-lg border-2 border-purple-500"
                  >
                    <Crown className="w-5 h-5" />
                    ⭐ Premium'a Geç
                  </Link>
                )}
                
                <div className="flex items-center gap-2 text-gray-700">
                  <User className="w-5 h-5" />
                  <span className="font-medium">{currentUser?.displayName || currentUser?.email}</span>
                </div>
                <button
                  onClick={async () => {
                    await logout();
                    navigate('/');
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Çıkış
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="w-full px-6 py-3">
          <div className="max-w-screen-2xl mx-auto">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all
                    ${currentStep >= step 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-500'}`}>
                    {step}
                  </div>
                  {step < 5 && (
                    <div className={`flex-1 h-1 mx-2 transition-all
                      ${currentStep > step ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-3 text-xs text-gray-600">
              <span className="flex-1 text-center">Yükle</span>
              <span className="flex-1 text-center">Stil Seç</span>
              <span className="flex-1 text-center">Onayla</span>
              <span className="flex-1 text-center">İşleniyor</span>
              <span className="flex-1 text-center">Sonuç</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-6 py-8">
        <div className="max-w-screen-xl mx-auto">
          {/* Step 1: Upload */}
          {currentStep === 1 && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold mb-2">Fotoğrafınızı Yükleyin</h2>
              <p className="text-gray-600 mb-8">AI ile dönüştürmek istediğiniz fotoğrafı seçin</p>

              {/* Upload Method Selector */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setUploadMethod('file')}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all
                    ${uploadMethod === 'file' 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  <Upload className="w-5 h-5 inline mr-2" />
                  Dosya Yükle
                </button>
                <button
                  onClick={() => setUploadMethod('url')}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all
                    ${uploadMethod === 'url' 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  <Image className="w-5 h-5 inline mr-2" />
                  URL'den Yükle
                </button>
              </div>

              {/* File Upload */}
              {uploadMethod === 'file' && (
                <div className="space-y-4">
                  {/* Drag & Drop Area - Desktop Only */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`hidden md:block border-3 border-dashed rounded-xl p-12 text-center transition-all
                      ${isDragging 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-300 hover:border-purple-400 bg-gray-50'}`}>
                    <Camera className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-lg font-medium mb-2">
                      Fotoğrafı buraya sürükleyip bırakın
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                      veya
                    </p>
                    
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={(e) => handleFileUpload(e.target.files[0])}
                    className="hidden"
                    id="fileInput"
                  />
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <label 
                      htmlFor="fileInput" 
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all cursor-pointer w-full sm:w-auto">
                      <Upload className="w-5 h-5 mr-2" />
                      Dosya Seç
                    </label>
                    
                    {/* Mobil için Camera Button */}
                    <input
                      type="file"
                      accept="image/*"
                      capture="user"
                      onChange={(e) => handleFileUpload(e.target.files[0])}
                      className="hidden"
                      id="cameraInput"
                    />
                    <label 
                      htmlFor="cameraInput" 
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-medium hover:shadow-lg transition-all cursor-pointer w-full sm:w-auto">
                      <Camera className="w-5 h-5 mr-2" />
                      Kamera
                    </label>
                  </div>
                    
                    <p className="text-xs text-gray-500 mt-4">
                      Desteklenen formatlar: JPEG, PNG, WebP (Max: 10MB)
                    </p>
                  </div>
                  
                  {/* Mobile Upload Buttons */}
                  <div className="md:hidden space-y-4 mt-6">
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={(e) => handleFileUpload(e.target.files[0])}
                      className="hidden"
                      id="mobileFileInput"
                    />
                    
                    <input
                      type="file"
                      accept="image/*"
                      capture="user"
                      onChange={(e) => handleFileUpload(e.target.files[0])}
                      className="hidden"
                      id="mobileCameraInput"
                    />
                    
                    <div className="flex flex-col gap-4">
                      <label 
                        htmlFor="mobileFileInput" 
                        className="inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all cursor-pointer">
                        <Upload className="w-5 h-5 mr-2" />
                        📁 Dosya Seç
                      </label>
                      
                      <label 
                        htmlFor="mobileCameraInput" 
                        className="inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-medium hover:shadow-lg transition-all cursor-pointer">
                        <Camera className="w-5 h-5 mr-2" />
                        📷 Kamera
                      </label>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-800 mb-2">📱 Mobil Kullanım:</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• "Dosya Seç" → Galeri'den fotoğraf seçin</li>
                        <li>• "Kamera" → Direkt fotoğraf çekin</li>
                        <li>• Chrome'da kamera izni verin</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* URL Upload */}
              {uploadMethod === 'url' && (
                <div className="space-y-4">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <button
                    onClick={handleUrlUpload}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all">
                    URL'den Yükle
                  </button>
                </div>
              )}

              {/* Preview */}
              {imageFile && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Yüklenen Fotoğraf:</h3>
                  <img 
                    src={imageFile?.base64 || imageFile} 
                    alt="Yüklenen" 
                    className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                  />
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg">
                  {error}
                </div>
              )}

              {/* Next Button */}
              {imageFile && (
                <button
                  onClick={nextStep}
                  className="mt-6 w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2">
                  Devam Et
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          )}

          {/* Step 2: Style Selection */}
          {currentStep === 2 && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold mb-8">Stil Seçimleri</h2>

              {/* Clothing Style */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Kıyafet Stili
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {clothingStyles.map((style) => (
                    <div
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all
                        ${selectedStyle === style.id
                          ? 'border-purple-600 bg-purple-50 scale-105'
                          : 'border-gray-200 hover:border-purple-300'}`}>
                      <div className="text-3xl mb-2 text-center">{style.icon}</div>
                      <p className="font-medium text-center">{style.label}</p>
                      <p className="text-xs text-gray-500 text-center mt-1">{style.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-purple-600" />
                  Kıyafet Rengi
                </h3>
                <div className="flex flex-wrap gap-4">
                  {colorOptions.map((color) => (
                    <div
                      key={color.id}
                      onClick={() => setSelectedColor(color.id)}
                      className={`w-24 h-24 rounded-full cursor-pointer transition-all flex items-center justify-center
                        ${selectedColor === color.id 
                          ? 'scale-110 ring-4 ring-purple-600' 
                          : 'hover:scale-105'}
                        ${color.border ? 'border-2 border-gray-300' : ''}`}
                      style={{ backgroundColor: color.hex }}>
                      {selectedColor === color.id && (
                        <Check className="w-8 h-8" 
                          style={{ color: color.id === 'white' ? '#000' : '#fff' }} />
                      )}
                    </div>
                  ))}
                </div>
                {selectedColor && (
                  <p className="mt-3 text-sm text-gray-600">
                    Seçilen: {colorOptions.find(c => c.id === selectedColor)?.label}
                  </p>
                )}
              </div>

              {/* Environment Selection */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  Ortam Seçimi
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                  {environments.map((env) => (
                    <div
                      key={env.id}
                      onClick={() => setSelectedEnvironment(env.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all text-center
                        ${selectedEnvironment === env.id
                          ? 'border-purple-600 bg-purple-50 scale-105'
                          : 'border-gray-200 hover:border-purple-300'}`}>
                      <div className="text-3xl mb-2">{env.icon}</div>
                      <p className="text-sm font-medium">{env.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg mb-4">
                  {error}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={prevStep}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                  <ArrowLeft className="w-5 h-5" />
                  Geri
                </button>
                <button
                  onClick={nextStep}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2">
                  Devam Et
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === 3 && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold mb-8">Seçimlerinizi Onaylayın</h2>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Preview Image */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Yüklenen Fotoğraf:</h3>
                  <img 
                    src={imageFile?.base64 || imageFile} 
                    alt="Preview" 
                    className="w-full rounded-lg shadow-lg"
                  />
                </div>

                {/* Selections Summary */}
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-3">Seçilen Özellikler:</h4>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                        <span className="font-medium">Kıyafet Stili:</span>
                        <span className="bg-purple-100 px-3 py-1 rounded-full text-sm">
                          {clothingStyles.find(s => s.id === selectedStyle)?.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Palette className="w-5 h-5 text-purple-600" />
                        <span className="font-medium">Renk:</span>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-6 h-6 rounded-full border-2"
                            style={{ backgroundColor: colorOptions.find(c => c.id === selectedColor)?.hex }}
                          />
                          <span className="text-sm">
                            {colorOptions.find(c => c.id === selectedColor)?.label}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-purple-600" />
                        <span className="font-medium">Ortam:</span>
                        <span className="bg-purple-100 px-3 py-1 rounded-full text-sm">
                          {environments.find(e => e.id === selectedEnvironment)?.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                      ℹ️ Fotoğrafınız AI ile işlenecek ve yeni görünümünüz oluşturulacak. 
                      Bu işlem yaklaşık 30-60 saniye sürebilir.
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-4 mt-8">
                <button
                  onClick={prevStep}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                  <ArrowLeft className="w-5 h-5" />
                  Düzenle
                </button>
                <button
                  onClick={nextStep}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2">
                  ✨ Fotoğrafı Oluştur
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Processing */}
          {currentStep === 4 && (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className="absolute inset-0 border-8 border-purple-200 rounded-full"></div>
                  <div className="absolute inset-0 border-8 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                
                <h2 className="text-2xl font-bold mb-4">Fotoğrafınız İşleniyor</h2>
                <p className="text-gray-600 mb-8">
                  AI modelimiz fotoğrafınızı dönüştürüyor...
                </p>

                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 h-full transition-all duration-500"
                    style={{ width: '75%' }}>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 mt-4">
                  Bu işlem 30-60 saniye sürebilir. Lütfen bekleyin...
                </p>
              </div>
            </div>
          )}

          {/* Step 5: Result */}
          {currentStep === 5 && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold mb-2 text-center">
                ✨ Yeni Fotoğrafınız Hazır!
              </h2>
              <p className="text-gray-600 text-center mb-8">
                AI ile dönüştürülmüş fotoğrafınızı indirebilirsiniz
              </p>

              {/* Before/After Comparison */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-center">Orijinal</h3>
                  <img 
                    src={imageFile?.base64 || imageFile} 
                    alt="Original" 
                    className="w-full rounded-lg shadow-lg"
                  />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-center">AI ile Oluşturulan</h3>
                  <img 
                    src={processedImage} 
                    alt="Processed" 
                    className="w-full rounded-lg shadow-lg"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={downloadImage}
                  className="flex-1 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all flex items-center justify-center gap-2">
                  <Download className="w-5 h-5" />
                  İndir
                </button>
                <button
                  onClick={reset}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all">
                  🔄 Yeni Fotoğraf
                </button>
              </div>
            </div>
          )}
          
          {/* Mobile Debug Log - Only on Mobile */}
          {debugLog.length > 0 && (
            <div className="md:hidden mt-6 bg-gray-900 text-green-400 rounded-lg p-4 max-h-64 overflow-y-auto font-mono text-xs">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-white">📱 Debug Log</h3>
                <button 
                  onClick={() => setDebugLog([])}
                  className="text-red-400 hover:text-red-300">
                  Temizle
                </button>
              </div>
              {debugLog.map((log, index) => (
                <div key={index} className="mb-1 whitespace-pre-wrap break-words">
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainApp;
