// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-zAUCh9uU7cbxmHzVgUbuLaaza007prc",
  authDomain: "skillup-lite-1444.firebaseapp.com",
  projectId: "skillup-lite-1444",
  storageBucket: "skillup-lite-1444.firebasestorage.app",
  messagingSenderId: "55835114520",
  appId: "1:55835114520:web:942925a98a32a98d55576d",
  measurementId: "G-G75ZYB8CTF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);