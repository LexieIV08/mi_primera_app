// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvD_4ClFgHnmRcXhDNcTN65ucnRhK--B0",
  authDomain: "practica13-perfil-f9cdb.firebaseapp.com",
  projectId: "practica13-perfil-f9cdb",
  storageBucket: "practica13-perfil-f9cdb.firebasestorage.app",
  messagingSenderId: "719297631452",
  appId: "1:719297631452:web:0ff55dbd4aea755f835019"
};

// Initialize Firebase
const app = getApps().lenght ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;