// src/api/auth.api.js
import axiosInstance from './axios.config';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut 
} from 'firebase/auth';

// Configuración de Firebase (deberás reemplazar con tus credenciales)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const authApi = {
  async login(email, password) {
    try {
      // Autenticar con Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseToken = await userCredential.user.getIdToken();
      
      // Obtener datos del usuario del backend
      const { data } = await axiosInstance.get(`/users/${userCredential.user.uid}`, {
        headers: { Authorization: `Bearer ${firebaseToken}` }
      });
      
      // Guardar token
      localStorage.setItem('token', firebaseToken);
      
      return {
        user: data,
        token: firebaseToken
      };
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },

  async register(userData) {
    try {
      // Crear usuario en Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );
      
      const firebaseToken = await userCredential.user.getIdToken();
      
      // Crear usuario en nuestro backend
      const { data } = await axiosInstance.post('/users', {
        ...userData,
        uid: userCredential.user.uid
      }, {
        headers: { Authorization: `Bearer ${firebaseToken}` }
      });
      
      // Guardar token
      localStorage.setItem('token', firebaseToken);
      
      return {
        user: data,
        token: firebaseToken
      };
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  },

  async logout() {
    try {
      await signOut(auth);
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Error en logout:', error);
      throw error;
    }
  }
};