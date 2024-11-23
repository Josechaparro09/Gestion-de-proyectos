import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { AuthContext } from './authContext';
import firebaseConfig from '../key.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          nombreCompleto: user.displayName || 'Usuario',
          photoURL: user.photoURL,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const signUp = async (email, password, nombreCompleto) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: nombreCompleto
      });
      return userCredential.user;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const updateUserProfile = async (data) => {
    try {
      await updateProfile(auth.currentUser, data);
      setUser(prev => ({
        ...prev,
        ...data
      }));
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};