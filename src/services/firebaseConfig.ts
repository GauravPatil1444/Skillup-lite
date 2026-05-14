import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC-zAUCh9uU7cbxmHzVgUbuLaaza007prc",
  authDomain: "skillup-lite-1444.firebaseapp.com",
  projectId: "skillup-lite-1444",
  storageBucket: "skillup-lite-1444.firebasestorage.app",
  messagingSenderId: "55835114520",
  appId: "1:55835114520:web:942925a98a32a98d55576d",
  measurementId: "G-G75ZYB8CTF"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);