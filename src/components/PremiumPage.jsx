import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Crown, Check, X, Sparkles, Zap, Image as ImageIcon, Clock } from 'lucide-react';
import axios from 'axios';

const PremiumPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleUpgrade = async (plan) => {
    try {
      setLoading(true);
      setError('');
      
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const token = localStorage.getItem('authToken');
      
      await axios.post(`${API_URL}/api/subscription/upgrade`, 
        { plan },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert('🎉 Premium\'a yükseltildiniz! Şimdi sınırsız fotoğraf işleyebilirsiniz!');
      navigate('/app');
    } catch (error) {
      console.error('Upgrade error:', error);
      setError('Yükseltme başarısız oldu. Lütfen tekrar deneyin.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full mb-6">
            <Crown className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
              Premium
            </span>{' '}
            <span className="text-gray-800">Olun</span>
          </h1>
          <p className="text-xl text-gray-600">
            Sınırsız fotoğraf işleme ve tüm özelliklere erişim
          </p>
        </div>

        {/* Feature Comparison */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Free</h3>
              <div className="text-4xl font-bold text-gray-600 mb-1">₺0</div>
              <p className="text-gray-500">Aylık</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">5 fotoğraf/ay</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">Temel özellikler</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">Sınırsız işleme</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">Öncelikli işleme</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">Yüksek kalite</span>
              </li>
            </ul>
            
            <div className="text-center text-sm text-gray-500">
              Mevcut planınız
            </div>
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-2xl p-8 border-4 border-yellow-400 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg border-2 border-purple-500 animate-pulse">
                ⭐ EN POPÜLER
              </span>
            </div>
            
            <div className="text-center mb-6 mt-4">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2">
                Premium
              </h3>
              <div className="text-5xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-1">
                ₺240
              </div>
              <p className="text-gray-600">Aylık</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-800 font-medium">25 fotoğraf/ay işleme</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-800 font-medium">Tüm özellikler</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-800 font-medium">Öncelikli işleme</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-800 font-medium">4K yüksek kalite</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-800 font-medium">Filigran yok</span>
              </li>
            </ul>
            
            <button
              onClick={() => handleUpgrade('monthly')}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-50 border-2 border-purple-500 animate-pulse"
            >
              {loading ? 'İşleniyor...' : '⭐ Premium\'a Geç'}
            </button>
          </div>
        </div>

        {/* Yearly Plan */}
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Yıllık Plan</h3>
              <p className="text-gray-600">2 ay bedava! Yıllık ₺999 ödeyerek %16 tasarruf edin</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-purple-600 mb-1">₺999</div>
              <p className="text-sm text-gray-500">Yıllık (₺83/ay)</p>
            </div>
          </div>
          
          <button
            onClick={() => handleUpgrade('yearly')}
            disabled={loading}
            className="w-full mt-6 py-4 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-50 border-2 border-purple-500 shadow-lg"
          >
            {loading ? 'İşleniyor...' : '⭐ Yıllık Premium\'a Geç'}
          </button>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg text-center max-w-2xl mx-auto">
            {error}
          </div>
        )}

        {/* Back Link */}
        <div className="text-center mt-8">
          <Link to="/app" className="text-purple-600 hover:text-purple-700 font-medium">
            ← Uygulamaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PremiumPage;
