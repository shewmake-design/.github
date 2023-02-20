const { initializeApp } = require("firebase/app");
const { getDatabase } = require("firebase/database");

const firebaseConfig = {
	apiKey: "AIzaSyChwYTwfUNM_Vd0e39RPYg7pSHxmJl49RI",
	authDomain: "api-walterjs-dev.firebaseapp.com",
	databaseURL: "https://api-walterjs-dev-default-rtdb.firebaseio.com",
	projectId: "api-walterjs-dev",
	storageBucket: "api-walterjs-dev.appspot.com",
	messagingSenderId: "319467468098",
	appId: "1:319467468098:web:cee159d551ddde513684db",
	measurementId: "G-T2LW60YV8Z",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

module.exports = { firebaseConfig, app, database };
