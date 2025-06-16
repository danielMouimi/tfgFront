// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD1ElKBG6wRBaMqzfOZQCixlDAAxsn8His",
  authDomain: "tourflex-tfg.firebaseapp.com",
  projectId: "tourflex-tfg",
  storageBucket: "tourflex-tfg.firebasestorage.app",
  messagingSenderId: "680015486531",
  appId: "1:680015486531:web:30d5316098b890f9e87ef6",
  measurementId: "G-0KYHW2TYBP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();

export {auth};