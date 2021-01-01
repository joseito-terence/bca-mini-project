import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDyYaHKx6PlZ15-LpEzSy-nTkZboo7Cyo0",
  authDomain: "bca-mini-project.firebaseapp.com",
  databaseURL: "https://bca-mini-project.firebaseio.com",
  projectId: "bca-mini-project",
  storageBucket: "bca-mini-project.appspot.com",
  messagingSenderId: "555954627693",
  appId: "1:555954627693:web:eb414234d94d0dd83b0b64",
  measurementId: "G-XKJSW0TRCS",
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();


export { auth, provider };
export default db;
