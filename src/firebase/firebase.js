import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

// Your web app's Firebase configuration
var config = {
  apiKey: "AIzaSyAYMMCSjHN3BYIVTlCqvXHQYAOpXfU_VJ0",
  authDomain: "cobu-9cd28.firebaseapp.com",
  databaseURL: "https://cobu-9cd28.firebaseio.com",
  projectId: "cobu-9cd28",
  storageBucket: "cobu-9cd28.appspot.com",
  messagingSenderId: "1067699086406",
  appId: "1:1067699086406:web:03553f023035bcf239d647",
  measurementId: "G-4V9HJ4DWXS"
};
// Initialize Firebase
firebase.initializeApp(config);

export default firebase;
