import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
  apiKey: "AIzaSyAEoEahkgITuKb0uRETKYSdun_CcjSs44Q",
  authDomain: "shopdb-441a4.firebaseapp.com",
  databaseURL: "https://shopdb-441a4.firebaseio.com",
  projectId: "shopdb-441a4",
  storageBucket: "shopdb-441a4.appspot.com",
  messagingSenderId: "316643794195",
  appId: "1:316643794195:web:8e0f8a099bacfea4960ee6",
  measurementId: "G-E8L5E8CQJM"
};

firebase.initializeApp(config);

export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  const userRef = firestore.doc(`users/${userAuth.uid}`);

  const snapShot = await userRef.get();

  if (!snapShot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();
    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData
      });
    } catch (error) {
      console.log('error creating user', error.message);
    }
  }

  return userRef;
};

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;
