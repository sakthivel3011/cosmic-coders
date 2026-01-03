import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFkqnC0vYYzbkViZp-it1iEa-cQTVXX9E",
  authDomain: "gobletrip.firebaseapp.com",
  projectId: "gobletrip",
  storageBucket: "gobletrip.firebasestorage.app",
  messagingSenderId: "1035202396192",
  appId: "1:1035202396192:web:def68f3cf62a5c243d3c45",
  measurementId: "G-4VC2F07NTB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
