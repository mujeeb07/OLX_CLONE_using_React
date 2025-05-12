import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase/setup';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function register(email, password, username) {
    return createUserWithEmailAndPassword(auth, email, password).then(
      (userCredential) => {
        // Update user profile with username
        updateProfile(userCredential.user, { displayName: username }).then(() => {
          setUser({ ...userCredential.user, displayName: username });
        });
        return userCredential;
      }
    );
  }

  async function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password).then(
      (userCredential) => {
        setUser(userCredential.user);
        return userCredential;
      }
    );
  }

  async function logout() {
    return signOut(auth).then(() => {
      setUser(null);
    });
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    user,
    register,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}