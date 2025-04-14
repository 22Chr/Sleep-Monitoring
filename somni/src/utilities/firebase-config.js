import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyClS9DCzhhrPizl_0GnsZHwLcGqBwyxPGk",
    authDomain: "sleep-monitoring-743d0.firebaseapp.com",
    projectId: "sleep-monitoring-743d0",
    storageBucket: "sleep-monitoring-743d0.firebasestorage.app",
    messagingSenderId: "798541697884",
    appId: "1:798541697884:web:483fe96420d3fa88062799"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };
