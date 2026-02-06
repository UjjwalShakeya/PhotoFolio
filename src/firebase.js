// create and initialize your own firebase here
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtRTi8WEKPh7lZxrziEk_rWdxdpem5m-0",
  authDomain: "photofolio-2ef1d.firebaseapp.com",
  projectId: "photofolio-2ef1d",
  storageBucket: "photofolio-2ef1d.firebasestorage.app",
  messagingSenderId: "266997146756",
  appId: "1:266997146756:web:e045f4f745288d11304ed1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);


