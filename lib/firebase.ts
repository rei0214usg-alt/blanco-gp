import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBXz0CselkpdyQIFoytEegmIZC-qJJjSlc",
  authDomain: "blanco-gp.firebaseapp.com",
  projectId: "blanco-gp",
  storageBucket: "blanco-gp.firebasestorage.app",
  messagingSenderId: "625255155467",
  appId: "1:625255155467:web:667ea1107c96cbc6b1c40e",
};

const app =
  getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApps()[0];

export const db = getFirestore(app);
export const auth = getAuth(app);