<template>
  <q-btn color="primary" label="Sign In" @click="googleSignIn" />
</template>

<script>
import firebase from "firebase/compat/app";
// import * as firebase from "firebase/compat/app";
// import firebase from "firebase/compat/app";
import "firebase/compat/auth";
// import "firebase/compat/firestore";
export default {
  name: "SignIn",
  methods: {
    googleSignIn() {
      const provider = new firebase.auth.GoogleAuthProvider();

      firebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
          this.$q.notify({ message: "Sign In Success" });
          this.$router.push("/");
        })
        .catch((err) => {
          alert("Oops " + err.message);
        });
    },
  },
};
</script>
