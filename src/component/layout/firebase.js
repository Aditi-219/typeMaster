  // Import the functions you need from the SDKs you need
  import { initializeApp } from "firebase/app";
  import { getAnalytics } from "firebase/analytics";
  import { getAuth, GoogleAuthProvider, signInWithPopup,createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries
  
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAMNThigCXeRZ1woH5GoF92sNxV-v4KF9Q",
    authDomain: "typemaster-3289.firebaseapp.com",
    projectId: "typemaster-3289",
    storageBucket: "typemaster-3289.firebasestorage.app",
    messagingSenderId: "721199286584",
    appId: "1:721199286584:web:26de1557289c1e28dd19cd",
    measurementId: "G-KGSK4P8B3K"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  // const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const analytics = getAnalytics(app);
  
  export { getAuth, provider, signInWithPopup,createUserWithEmailAndPassword, signInWithEmailAndPassword };
  