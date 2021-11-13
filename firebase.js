import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyCN2RPPd485Lg9o0KoNlU1bsBFuA_DDrpQ',
	authDomain: 'signal-clone-f329a.firebaseapp.com',
	projectId: 'signal-clone-f329a',
	storageBucket: 'signal-clone-f329a.appspot.com',
	messagingSenderId: '1086877174782',
	appId: '1:1086877174782:web:9b10385c336feffdcbceaf',
};

//inicializar la app
const firebaseApp = firebase.initializeApp(firebaseConfig);
//armo la db
const db = firebaseApp.firestore();
//armo la auth
const auth = firebase.auth();

export { db, auth };
