import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDpmauj08MCV5vrzLZG0llgPNktnDTaAKQ",
  authDomain: "cybershieldx-2402.firebaseapp.com",
  projectId: "cybershieldx-2402",
  storageBucket: "cybershieldx-2402.firebasestorage.app",
  messagingSenderId: "929488896236",
  appId: "1:929488896236:web:0e109446496fe1fba665c9",
  measurementId: "G-04ZXPFRPL0",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export default app;