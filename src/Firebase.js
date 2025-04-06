// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCNi2pkZH7iOjW2geI5nX8E2x-pSFGUx-8",
  authDomain: "e-learning-e552d.firebaseapp.com",
  projectId: "e-learning-e552d",
  storageBucket: "e-learning-e552d.firebasestorage.app",
  messagingSenderId: "567227709574",
  appId: "1:567227709574:web:c06b1a92042669c7e1f907",
  measurementId: "G-LNXFPH8K6F"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);