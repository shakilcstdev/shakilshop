import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAnalytics,
  isSupported,
  type Analytics,
} from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBngKpIYX75muJe8oqPGtum5niioUJspDI",
  authDomain: "shakilshop-cac6e.firebaseapp.com",
  projectId: "shakilshop-cac6e",
  storageBucket: "shakilshop-cac6e.firebasestorage.app",
  messagingSenderId: "47716488512",
  appId: "1:47716488512:web:6967fe28b78a0d971b96a5",
  measurementId: "G-4F62GSSNDR",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let analytics: Analytics | null = null;

if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch((error: unknown) => {
      console.warn("Analytics not supported:", error);
    });
}

export { app, analytics };
