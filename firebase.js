import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
	apiKey: '',
	authDomain: 'signal-clone-f329a.firebaseapp.com',
	projectId: 'signal-clone-f329a',
	storageBucket: 'signal-clone-f329a.appspot.com',
	messagingSenderId: '',
	appId: '',
};

//inicializar la app
const firebaseApp = firebase.initializeApp(firebaseConfig);
//armo la db
const db = firebaseApp.firestore();
//armo la auth
const auth = firebase.auth();

export { db, auth };
