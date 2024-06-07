import { initializeApp } from 'firebase/app';
import { getFirestore, collection, setDoc, getDocs, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';



const firebaseConfig = {
  apiKey: "AIzaSyAkuLbGL8FoYrzhtLPg_zfTeU-bYs61gqA",
  authDomain: "restaurant-crud-3ddf6.firebaseapp.com",
  projectId: "restaurant-crud-3ddf6",
  storageBucket: "restaurant-crud-3ddf6.appspot.com",
  messagingSenderId: "256965338366",
  appId: "1:256965338366:web:e58f7581cab4b4b12631af"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, setDoc, getDocs, updateDoc, deleteDoc, doc, onSnapshot };