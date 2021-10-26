<template>
  <q-btn
    v-if="!getStateLoggedIn"
    color="primary"
    label="Sign In"
    @click="googleSignIn"
  />
  <q-btn v-else color="primary" label="Sign Out" @click="signOut" />
  <q-btn color="primary" label="Status" @click="showStatus" />
</template>

<script>
import firebase from "firebase/compat/app";
// import * as firebase from "firebase/compat/app";
// import firebase from "firebase/compat/app";
import "firebase/compat/auth";
// import "firebase/compat/firestore";
// import Logout from "../components/Logout";
import { mapActions, mapGetters } from "vuex";
import { fetchUsers } from "../helpers";

export default {
  name: "SignIn",
  // data() {
  //   return {
  //     loggedIn: false,
  //   };
  // },
  methods: {
    ...mapActions("userstore", [
      "saveUserAction",
      "loggedInAction",
      "updateFriendsAction",
    ]),
    googleSignIn() {
      const provider = new firebase.auth.GoogleAuthProvider();

      firebase
        .auth()
        .signInWithPopup(provider)
        // .onAuthStateChanged((user) => console.log("user here", user))
        .then((result) => {
          this.$q.notify({ message: "Sign In Success" });
          // this.$router.push("/");
          this.saveUserAction(result.user);
          this.loggedInAction(true);
          this.loggedIn = true;
          console.log("user?", result.user);
        })
        .then(() => {
          // console.log("logged in from state", this.getStateLoggedIn);
          return this.getStateUser;
        })
        .then((res) => {
          // console.log("user res", res);
          return fetchUsers();
        })
        .then((res) => {
          this.updateFriendsAction(res);
          // console.log("res", res);
        })
        .catch((err) => {
          alert("Oops " + err.message);
        });
    },
    signOut() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.saveUserAction(null);
          this.loggedInAction(false);
          this.loggedIn = false;
        })
        .then(() => console.log("logged IN", this.getStateLoggedIn));
      // this.$router
      //   .push("/")
      //   .then(() => {
      //     this.$q.notify({ message: "Sign Out Success" });
      //   })
      //   .catch((error) => console.log("error", error));
    },
    showStatus() {
      console.log("status", this.getStateLoggedIn);
      console.log("user", this.getStateUser);
      console.log("logged in", this.loggedIn);
    },
  },
  components: {
    // Logout,
  },
  created() {
    console.log("created", this.getStateLoggedIn);
    console.log("created user", this.getStateUser);
    // console.log("logged in", this.loggedIn);
  },
  computed: {
    ...mapGetters("userstore", ["getStateUser", "getStateLoggedIn"]),
  },
};
</script>
