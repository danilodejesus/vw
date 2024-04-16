import firebase from "firebase/app";

import "firebase/auth";
import "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyD_ct4LhNmaUh86W0oligfENR_4E3l0Ci4",
  authDomain: "iceland-b5a7f.firebaseapp.com",
  projectId: "iceland-b5a7f",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const localPersistence = firebase.auth.Auth.Persistence.LOCAL;
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export const getUsers = (observer) => {
  try {
    return firestore
      .collection("users")
      .onSnapshot(observer);
  } catch (error) {
    console.error(error);
  }
};

export const insertUser = (email, observer) => {
  try {
    return firestore
      .collection('users')
      .doc(email)
      .update({isValidPay: observer})
  } catch (err) {
    console.error(err)
  }
}