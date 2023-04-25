// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKWp745DwWghcWfcMFd-vEdYYfYhxFTUU",
  authDomain: "ts-class-scheduler.firebaseapp.com",
  projectId: "ts-class-scheduler",
  storageBucket: "ts-class-scheduler.appspot.com",
  messagingSenderId: "988230633321",
  appId: "1:988230633321:web:691180ab188e7b671fdff8",
  measurementId: "G-BF2KW4W244"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);