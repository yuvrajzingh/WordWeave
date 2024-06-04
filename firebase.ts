import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

//your web app's firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDnnbk6kqOshWJNZp8GeclBki3UmXltKzs",
    authDomain: "wordweave-187b3.firebaseapp.com",
    projectId: "wordweave-187b3",
    storageBucket: "wordweave-187b3.appspot.com",
    messagingSenderId: "768771339646",
    appId: "1:768771339646:web:9c916efc2a69f66f90af2f"
  };

  const app = getApps().length ? getApp() : initializeApp(firebaseConfig); //checking if the app is already initialized (prevents us from having duplicates)
  const auth = getAuth(app);
  const db = getFirestore(app);
  const functions = getFunctions(app);

  export { db, auth, functions }; 