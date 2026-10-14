
import { getReactNativePersistence } from "@firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDlWQi4-08gf3Dh9_vJqgvzwwCyx4K_f_M",
  authDomain: "practica12-auth-129ec.firebaseapp.com",
  projectId: "practica12-auth-129ec",
  storageBucket: "practica12-auth-129ec.firebasestorage.app",
  messagingSenderId: "540775998400",
  appId: "1:540775998400:web:ad716da9b6218e9a439e25",
  measurementId: "G-9G6SP0TLL7",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export default app;