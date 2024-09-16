import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database'; 

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

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

export default db;