import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCQJgqL8SruczZ_Z862_n9IFNEZDJ77v0g",
  authDomain: "intclrt.firebaseapp.com",
  projectId: "intclrt",
  storageBucket: "intclrt.firebasestorage.app",
  messagingSenderId: "357476039164",
  appId: "1:357476039164:web:5571ddf63c53ea880c9a79",
  measurementId: "G-RP24DWV1BY"
};



const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

