import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyDXtuwjjUbtIziFBZ10_CkMHosby4-TNz4",
    authDomain: "dental-clinic-app-d78cf.firebaseapp.com",
    projectId: "dental-clinic-app-d78cf",
    /* storageBucket: "dental-clinic-app-d78cf.firebasestorage.app", */
    storageBucket: "dental-clinic-app-d78cf.appspot.com",
    messagingSenderId: "859062108865",
    appId: "1:859062108865:web:97072799b13e6a77c60a40"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);