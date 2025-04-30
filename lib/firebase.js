// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCE4BU0cfgQd82T_ENcZ3D6WfhxHuX7AHI",
  authDomain: "go-print-7bd24.firebaseapp.com",
  projectId: "go-print-7bd24",
  storageBucket: "go-print-7bd24.firebasestorage.app",
  messagingSenderId: "57499720931",
  appId: "1:57499720931:web:6074d738eeacea8dd279d6",
  measurementId: "G-34X5CL6W8R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
