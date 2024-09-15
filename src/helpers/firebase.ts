import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database'; 
// TODO: Replace the following with your app's Firebase project configuration
// See: https://support.google.com/firebase/answer/7015592
const firebaseConfig = {
    apiKey: "AIzaSyBVfI0UVH9YDfrYbXG0taASdivSfwHPFJk",
    authDomain: "blog-5085c.firebaseapp.com",
    databaseURL: "https://blog-5085c-default-rtdb.firebaseio.com",
    projectId: "blog-5085c",
    storageBucket: "blog-5085c.appspot.com",
    messagingSenderId: "149791135546",
    appId: "1:149791135546:web:ab23639742f541f1106203",
    measurementId: "G-HK06M437S7"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getDatabase(app);

export default db;