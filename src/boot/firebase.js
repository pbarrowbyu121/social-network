import { boot } from "quasar/wrappers";
import firebase from "firebase/compat/app";

const firebaseConfig = {
  apiKey: "AIzaSyAh4GMkmZZfteNpzMqoI8s67c6KvydYqLI",
  authDomain: "social-network-904b9.firebaseapp.com",
  projectId: "social-network-904b9",
  storageBucket: "social-network-904b9.appspot.com",
  messagingSenderId: "1076190812462",
  appId: "1:1076190812462:web:35da9b1f725275d6d082bf",
  measurementId: "G-B5JK36RQYB",
};
firebase.initializeApp(firebaseConfig);

export default firebase;

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
// export default boot(async (/* { app, router, ... } */) => {
//   // something to do
// })
