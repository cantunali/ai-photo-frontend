import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { verifyToken } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Email ile kayıt olma
  const signup = async (email, password, displayName) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(result.user, { displayName });
      // displayName güncellendikten sonra user objesini yenile
      await result.user.reload();
    }
    
    // Backend'e token gönder
    try {
      const idToken = await result.user.getIdToken();
      console.log('Sending token to backend for signup...');
      const backendResponse = await verifyToken(idToken);
      console.log('Backend response:', backendResponse);
    } catch (error) {
      console.error('Backend verification failed:', error);
      // Hata olsa bile kullanıcı Firebase'de oluşturuldu, devam et
    }
    
    return result;
  };

  // Email ile giriş yapma
  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    
    // Backend'e token gönder
    try {
      const idToken = await result.user.getIdToken();
      console.log('Sending token to backend for login...');
      const backendResponse = await verifyToken(idToken);
      console.log('Backend response:', backendResponse);
    } catch (error) {
      console.error('Backend verification failed:', error);
      // Hata olsa bile giriş başarılı, devam et
    }
    
    return result;
  };

  // Google ile giriş yapma
  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    
    // Backend'e token gönder
    try {
      const idToken = await result.user.getIdToken();
      console.log('Sending token to backend for Google login...');
      const backendResponse = await verifyToken(idToken);
      console.log('Backend response:', backendResponse);
    } catch (error) {
      console.error('Backend verification failed:', error);
      // Hata olsa bile Google girişi başarılı, devam et
    }
    
    return result;
  };

  // Çıkış yapma
  const logout = () => {
    localStorage.removeItem('authToken');
    return signOut(auth);
  };

  // Kullanıcı durumunu dinleme
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      // Kullanıcı varsa ve oturum açıksa backend'e kaydet
      if (user) {
        try {
          const idToken = await user.getIdToken();
          console.log('User state changed, syncing with backend...');
          await verifyToken(idToken);
        } catch (error) {
          console.error('Auto-sync with backend failed:', error);
        }
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    loginWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
