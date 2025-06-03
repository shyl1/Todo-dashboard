// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBKI78CDYNZK8jCPNWeHuk3Sp7vT3AvzeI",
  authDomain: "tododasshboard.firebaseapp.com",
  projectId: "tododasshboard",
  storageBucket: "tododasshboard.firebasestorage.app",
  messagingSenderId: "482608706472",
  appId: "1:482608706472:web:5598b1d91c03d0726a239d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);