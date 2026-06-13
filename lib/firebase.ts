import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

// আপনার Firebase কনফিগারেশন (হার্ডকোডেড বা এনভায়রনমেন্ট থেকে)
const firebaseConfig = {
  apiKey: "AIzaSyBngKpIYX75muJe8oqPGtum5niioUJspDI",
  authDomain: "shakilshop-cac6e.firebaseapp.com",
  projectId: "shakilshop-cac6e",
  storageBucket: "shakilshop-cac6e.firebasestorage.app",
  messagingSenderId: "47716488512",
  appId: "1:47716488512:web:6967fe28b78a0d971b96a5",
  measurementId: "G-4F62GSSNDR"
};

// Firebase অ্যাপ শুরু করুন (সার্ভার এবং ক্লায়েন্ট উভয় জায়গায় নিরাপদ)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Analytics কে null দিয়ে শুরু করুন, পরে ক্লায়েন্টে সেট হবে
let analytics = null;

// শুধুমাত্র ক্লায়েন্ট সাইডে (ব্রাউজারে) Analytics শুরু করুন
if (typeof window !== "undefined") {
  // `isSupported()` চেক করে নিন ব্রাউজার analytics সাপোর্ট করে কিনা
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(err => console.warn("Analytics not supported", err));
}

export { app, analytics };