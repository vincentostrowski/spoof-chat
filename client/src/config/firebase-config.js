import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD-W1S00sc1u4kTg-hes82sLR4wnV70DhE",
  authDomain: "splitchat-fdadc.firebaseapp.com",
  projectId: "splitchat-fdadc",
  storageBucket: "splitchat-fdadc.appspot.com",
  messagingSenderId: "204938951056",
  appId: "1:204938951056:web:07777670546270fd665b15",
  measurementId: "G-M8FL9WYD7Q",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
export const storage = getStorage(app);
export default app;
