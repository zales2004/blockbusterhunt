// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBgZiRsgmh4F7i3bbx4zXEyAWCsjhFojEw",
  authDomain: "blockbusterhunt.firebaseapp.com",
  projectId: "blockbusterhunt",
  storageBucket: "blockbusterhunt.firebasestorage.app",
  messagingSenderId: "144275147223",
  appId: "1:144275147223:web:d8b0cbe2323f713cfba392",
  measurementId: "G-R7NTHBRB5P"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
