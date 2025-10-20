import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, Crown, Image, Palette, MapPin, CheckCircle, Star } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AI Photo Transform
            </h1>
          </div>
          <div className="flex gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-purple-600 font-medium hover:text-purple-700 transition-all"
            >
              Giriş Yap
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
            >
              Kayıt Ol
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Kıyafet stilinizi değiştirin, renkleri özelleştirin ve farklı ortamlarda kendinizi görün. 
          Hepsi yapay zeka ile, saniyeler içinde!
        </p>
        
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            to="/app"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all border-2 border-purple-500"
          >
            <Sparkles className="w-6 h-6" />
            Ücretsiz Dene
            <ArrowRight className="w-5 h-5" />
          </Link>
          
          <Link
            to="/premium"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg hover:shadow-xl transition-all border-2 border-purple-200"
          >
            <Crown className="w-6 h-6 text-yellow-500" />
            Premium'a Geç
          </Link>
        </div>
        
        <p className="text-sm text-gray-500 mt-4">
          💳 Üyelik için kredi kartı gerekmez · ✨ 5 ücretsiz işlem
        </p>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Neler Yapabilirsiniz?
        </h3>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Palette className="w-8 h-8 text-purple-600" />
            </div>
            <h4 className="text-xl font-bold mb-3 text-gray-800">Kıyafet Stili Değiştirin</h4>
            <p className="text-gray-600">
              Takım elbise, casual, spor veya parti kıyafetleri ile fotoğraflarınızı yeniden oluşturun.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Image className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="text-xl font-bold mb-3 text-gray-800">Renk Özelleştirme</h4>
            <p className="text-gray-600">
              Siyah, lacivert, beyaz, mavi ve daha fazlası! İstediğiniz rengi seçin.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
              <MapPin className="w-8 h-8 text-indigo-600" />
            </div>
            <h4 className="text-xl font-bold mb-3 text-gray-800">Farklı Ortamlar</h4>
            <p className="text-gray-600">
              Ofis, deniz kenarı, kafe, parti, şehir veya stüdyo ortamlarında kendinizi görün.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Nasıl Çalışır?
        </h3>
        
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              1
            </div>
            <h4 className="font-bold mb-2 text-gray-800">Fotoğraf Yükleyin</h4>
            <p className="text-sm text-gray-600">Bilgisayarınızdan veya sürükleyerek ekleyin</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              2
            </div>
            <h4 className="font-bold mb-2 text-gray-800">Stil Seçin</h4>
            <p className="text-sm text-gray-600">Kıyafet stili, renk ve ortam belirleyin</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              3
            </div>
            <h4 className="font-bold mb-2 text-gray-800">AI İşlesin</h4>
            <p className="text-sm text-gray-600">Yapay zeka fotoğrafınızı dönüştürsün</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              4
            </div>
            <h4 className="font-bold mb-2 text-gray-800">İndirin</h4>
            <p className="text-sm text-gray-600">Yeni fotoğrafınızı kaydedin ve paylaşın</p>
          </div>
        </div>
      </section>

      {/* Pricing Comparison */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Planlar ve Özellikler
        </h3>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h4 className="text-2xl font-bold mb-2 text-gray-800">Ücretsiz</h4>
            <div className="text-4xl font-bold text-purple-600 mb-4">₺0</div>
            <p className="text-gray-600 mb-6">Başlamak için ideal</p>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>5 fotoğraf/ay</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Tüm stil seçenekleri</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>8 farklı ortam</span>
              </li>
            </ul>
            
            <Link
              to="/register"
              className="block w-full py-3 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition-all text-center"
            >
              Ücretsiz Başla
            </Link>
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 shadow-xl border-4 border-purple-400 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                ⭐ POPÜLER
              </span>
            </div>
            
            <h4 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mt-4">
              Premium
            </h4>
            <div className="text-4xl font-bold text-purple-600 mb-4">₺240</div>
            <p className="text-gray-600 mb-6">Sınırsız yaratıcılık</p>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium">25 fotoğraf/ay işleme</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium">Tüm özellikler</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium">Öncelikli işleme</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium">4K yüksek kalite</span>
              </li>
            </ul>
            
            <Link
              to="/premium"
              className="block w-full py-3 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 text-white rounded-lg font-bold hover:shadow-xl transition-all text-center"
            >
              Premium'a Geç
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 rounded-3xl p-12 text-white shadow-2xl">
          <h3 className="text-4xl font-bold mb-4">Hazır mısınız?</h3>
          <p className="text-xl mb-8 text-purple-100">
            Fotoğraflarınızı yapay zeka ile dönüştürmeye başlayın!
          </p>
          <Link
            to="/app"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all"
          >
            <Sparkles className="w-6 h-6" />
            Şimdi Deneyin - Ücretsiz!
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
          <p className="mb-2">© 2025 AI Photo Transform. Tüm hakları saklıdır.</p>
          <p className="text-sm">Yapay zeka destekli fotoğraf dönüşüm platformu</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

