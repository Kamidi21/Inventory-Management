// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdIgBvVb9lw_m217FOs6RmFNXpSGRhkfk",
  authDomain: "inventory-management-658b9.firebaseapp.com",
  projectId: "inventory-management-658b9",
  storageBucket: "inventory-management-658b9.appspot.com",
  messagingSenderId: "76728727938",
  appId: "1:76728727938:web:9aedf778e81a0f5b1cf79b",
  measurementId: "G-ZPW3WFMSV6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);
export {firestore}