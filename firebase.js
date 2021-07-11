import firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyBv5SOctlXP-ZxE9u0DK56Gm9NjaePuCys',
  authDomain: 'whatsapp-clone-2-46b12.firebaseapp.com',
  projectId: 'whatsapp-clone-2-46b12',
  storageBucket: 'whatsapp-clone-2-46b12.appspot.com',
  messagingSenderId: '870994799125',
  appId: '1:870994799125:web:db8e6c1bced34d50f2bc1c',
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();

const auth = app.auth();

const provider = firebase.auth.GoogleAuthProvider();

export { db, auth, provider };
