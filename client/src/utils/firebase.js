
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging,  } from "firebase/messaging";


// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCq3ADfEsYqKUMk6jYdeCgfclFyO2R4OZQ",
  authDomain: "fir-c4bc8.firebaseapp.com",
  projectId: "fir-c4bc8",
  storageBucket: "fir-c4bc8.appspot.com",
  messagingSenderId: "598202756966",
  appId: "1:598202756966:web:e0bdc8d9649930101c62a7",
  measurementId: "G-3RPYVVJ4RS"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig)
const messaging = getMessaging(app);
export default messaging;

const firebaseKey = "BGFAoo9l-puEwsp7uD5tKW64tJFSTOd44FOa2X_FQ8RihYfy9krW4V9oHvFitszGwSxHiLAp3O6jbBD0nr_EjLg"
export {
  firebaseKey
}