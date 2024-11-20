// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "music-e54e0.firebaseapp.com",
  databaseURL: "https://music-e54e0-default-rtdb.firebaseio.com/",
  projectId: "music-e54e0",
  storageBucket: "music-e54e0.appspot.com",
  messagingSenderId: "143601463097",
  appId: "1:143601463097:web:04ea3ee07c6c72502942e8",
  measurementId: "G-5T22K9Q22L",
};

const app = initializeApp(firebaseConfig, 'MUSICAPP');
const database = getDatabase(app);

export { database };
