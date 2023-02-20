// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
	apiKey: "AIzaSyChwYTwfUNM_Vd0e39RPYg7pSHxmJl49RI",
	authDomain: "api-walterjs-dev.firebaseapp.com",
	databaseURL: "https://api-walterjs-dev-default-rtdb.firebaseio.com",
	projectId: "api-walterjs-dev",
	storageBucket: "api-walterjs-dev.appspot.com",
	messagingSenderId: "319467468098",
	appId: "1:319467468098:web:cee159d551ddde513684db",
	measurementId: "G-T2LW60YV8Z",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
