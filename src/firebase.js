import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  // Bu değerleri Firebase Console'dan alın
  apiKey: "AIzaSyDy6PZHCmUWSAxMm1CK6G1hkVQ0CdkNcjo",
  authDomain: "ai-phototransform.firebaseapp.com",
  projectId: "ai-phototransform",
  storageBucket: "ai-phototransform.firebasestorage.app",
  messagingSenderId: "632701935575",
  appId: "1:632701935575:web:719929876bc5444939b592",
  measurementId: "G-WN9YY630ME"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;