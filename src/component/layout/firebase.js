  // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc, setDoc, updateDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup,createUserWithEmailAndPassword, signInWithEmailAndPassword,onAuthStateChanged  } from "firebase/auth";
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
const firebaseApp = initializeApp(firebaseConfig);
// const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const analytics = getAnalytics(firebaseApp);

const db = getFirestore(firebaseApp);

// Create a new lobby
const createLobby = async (lobbyId, player) => {
  const lobbyRef = doc(db, 'lobbies', lobbyId);
  await setDoc(lobbyRef, {
    playerA: { uid: player.uid, email: player.email, wpm: 0, typedText: '' },
    playerB: null,
    text: 'Shared text for both players...',
    countdown: 3,
    gameStarted: false,
    gameEnded: false,
  });
};

// Join a lobby
const joinLobby = async (lobbyId, player) => {
  const lobbyRef = doc(db, 'lobbies', lobbyId);
  const lobbyDoc = await getDoc(lobbyRef);

  if (lobbyDoc.exists() && !lobbyDoc.data().playerB) {
    await updateDoc(lobbyRef, {
      playerB: { uid: player.uid, email: player.email, wpm: 0, typedText: '' },
    });
  } else {
    console.log('Lobby is full or does not exist');
  }
};


export {firebaseApp,db,createLobby,joinLobby, getAuth, provider, signInWithPopup,createUserWithEmailAndPassword, signInWithEmailAndPassword,onAuthStateChanged  };

