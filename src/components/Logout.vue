<template>
  <q-btn color="primary" label="Sign Out" @click="logout" />
</template>

<script>
import firebase from "firebase/compat/app";
// import * as firebase from "firebase/compat/app";
// import firebase from "firebase/compat/app";
import "firebase/compat/auth";
// import "firebase/compat/firestore";
export default {
  name: "Logout",
  methods: {
    logout() {
      firebase.auth().signOut();
      this.$router
        .push("/")
        .then(() => {
          this.$q.notify({ message: "Sign Out Success" });
        })
        .catch((error) => console.log("error", error));
    },
  },
};
</script>
