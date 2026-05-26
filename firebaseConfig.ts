import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCqpg9YIMlvQfTUDvuYpQi0Kpjc6QPZEc0",
  authDomain: "foodexpress-3f097.firebaseapp.com",
  projectId: "foodexpress-3f097",
  storageBucket: "foodexpress-3f097.firebasestorage.app",
  messagingSenderId: "1005546726574",
  appId: "1:1005546726574:web:2c13ffc101fea343be793f"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);