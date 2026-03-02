import React, { createContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../firebase/firebase.config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

// Fixed admin credentials 
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const googleLogin = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const adminLogin = (username, password) => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setUser({ email: username, isAdmin: true });
      localStorage.setItem('adminLoggedIn', 'true');
      return Promise.resolve();
    }
    return Promise.reject(new Error("Invalid admin credentials"));
  };

  const logout = () => {
    setLoading(true);
    setIsAdmin(false);
    localStorage.removeItem('adminLoggedIn');
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Check admin session on load
    if (localStorage.getItem('adminLoggedIn') === 'true') {
      setIsAdmin(true);
      setUser({ email: ADMIN_USERNAME, isAdmin: true });
    }

    return () => unsubscribe();
  }, []);

  const authInfo = { user, isAdmin, loading, createUser, login, googleLogin, adminLogin, logout };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;