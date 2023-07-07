// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDid3OeY-Y-4hTAY3x5UuQ00i67xLXMtQI",
    authDomain: "discord-clone-d54a4.firebaseapp.com",
    projectId: "discord-clone-d54a4",
    storageBucket: "discord-clone-d54a4.appspot.com",
    messagingSenderId: "682314738569",
    appId: "1:682314738569:web:510cd55bdb186cf437cf58",
    measurementId: "G-MCERVZXECR"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;