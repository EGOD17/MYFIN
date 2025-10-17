
// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "studio-426382753-1796a",
  "appId": "1:419650396509:web:3780baa020bb54071ec8b4",
  "apiKey": "AIzaSyBW67rKFhOH3daTs2YU2hfCdWEI2ZgqiMQ",
  "authDomain": "studio-426382753-1796a.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "419650396509"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { app };
