import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase/setup';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // fetch user details from firestore
  async function getUserInfo(uid) {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      return userDoc.exists() ? userDoc.data() : null;
    } catch (error) {
      console.error('error fetching user info:', error);
      toast.error('failed to load user info');
      return null;
    }
  }

  // register user and save to firestore
  async function register(email, password, username) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: username });
      const userData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        username,
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'users', userCredential.user.uid), userData);
      setUser({ ...userCredential.user, ...userData });
      return userCredential;
    } catch (error) {
      console.error('error registering user:', error);
      throw error;
    }
  }

  // login user and fetch firestore details
  async function login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userInfo = await getUserInfo(userCredential.user.uid);
      setUser({ ...userCredential.user, ...userInfo });
      return userCredential;
    } catch (error) {
      console.error('error logging in:', error);
      throw error;
    }
  }

  // logout user
  async function logout() {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('error logging out:', error);
      toast.error('failed to log out');
    }
  }

  // monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userInfo = await getUserInfo(currentUser.uid);
        setUser({ ...currentUser, ...userInfo });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const value = { user, register, login, logout, getUserInfo, loading };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}