// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAlnh0CU26yoSq1nZtUxMCvyqcuFPthD2g",
  authDomain: "fameandsash.firebaseapp.com",
  projectId: "fameandsash",
  storageBucket: "fameandsash.firebasestorage.app",
  messagingSenderId: "152153287963",
  appId: "1:152153287963:web:5af76762fca963ef2af7be",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
