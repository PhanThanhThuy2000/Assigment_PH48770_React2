// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyABzlLm4f3g3XXO16woY_xSXEir0y6qYfE",
    authDomain: "assigment-ph48770-cro102.firebaseapp.com",
    projectId: "assigment-ph48770-cro102",
    storageBucket: "assigment-ph48770-cro102.firebasestorage.app",
    messagingSenderId: "960922541179",
    appId: "1:960922541179:web:2ab784ee591bea053b56de",
    measurementId: "G-QF7PMFFCRH"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);
// Export db để sử dụng ở các file khác
const db = getFirestore(firebaseApp);
export { db };