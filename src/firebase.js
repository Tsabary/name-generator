import firebase from 'firebase';

const config = {
  apiKey: "AIzaSyByxKIsyY6iPUMHTXUfZgJxmOrQSgO2Btg",
  authDomain: "fabntt.firebaseapp.com",
  databaseURL: "https://fabntt.firebaseio.com",
  projectId: "fabntt",
  storageBucket: "fabntt.appspot.com",
  messagingSenderId: "957228313775",
  appId: "1:957228313775:web:e1a08375cb2df3cac6785a",
  measurementId: "G-LE51CP3M28"
  };

firebase.initializeApp(config);
export default firebase;