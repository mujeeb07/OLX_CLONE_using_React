import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAPev8S6_VaJbuHR3Gz5JEKEGZYylxwcfs',
  authDomain: 'olx-clone-d0d17.firebaseapp.com',
  projectId: 'olx-clone-d0d17',
  storageBucket: 'olx-clone-d0d17.firebasestorage.app',
  messagingSenderId: '238504013575',
  appId: '1:238504013575:web:6e2f0744e9b8f404a69fa2',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);