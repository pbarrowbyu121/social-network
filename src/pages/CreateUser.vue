<template>
  <div>Create User</div>
  <q-form @submit="submitUser" class="q-gutter-md">
    <q-input outlined v-model="firstName" label="First Name" dense />
    <q-input outlined v-model="lastName" label="Last Name" dense />
    <q-input outlined v-model="email" label="Email" dense />
    <q-input outlined v-model="username" label="Username" dense />
    <q-input v-model="bio" type="textarea" label="Bio" />
    <!-- <q-btn push color="primary" label="Push" @click="submitUser" /> -->
    <q-btn label="Submit" type="submit" color="primary" />
  </q-form>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { fetchUsers } from "src/helpers.js";
export default {
  name: "Create User",
  data() {
    return {
      firstName: null,
      lastName: null,
      email: null,
      username: null,
      bio: null,
      randomUser: null,
    };
  },
  methods: {
    ...mapActions("userstore", ["updateFriendsAction"]),
    resetForm() {
      this.firstName = null;
      this.lastName = null;
      this.email = null;
      this.username = null;
      this.randomUser = null;
      this.bio = null;
    },
    checkForm() {
      if (!this.firstName) {
        return false;
      }
      if (!this.lastName) {
        return false;
      }
      if (!this.email) {
        return false;
      }
      if (!this.username) {
        return false;
      }
      if (!this.bio) {
        return false;
      }
      return true;
    },
    submitUser() {
      if (this.checkForm()) {
        this.getRandomUser()
          .then((res) => {
            const newUserObj = {
              firstName: this.firstName,
              lastName: this.lastName,
              email: this.email,
              username: this.username,
              bio: this.bio,
              img: this.randomUser.picture.thumbnail,
            };
            return newUserObj;
          })
          .then((res) =>
            this.postUser(res).then((res) => console.log("res", res))
          )
          .then((res) => {
            this.resetForm();
            return fetchUsers();
          })
          .then((res) => this.updateFriendsAction(res));
      }
    },
    postUser(newUserObj) {
      const postUserPromise = fetch("http://localhost:3000/user-profiles", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(newUserObj),
      });
      return postUserPromise;
    },
    getRandomUser() {
      const randomUserPromise = fetch("https://randomuser.me/api/")
        .then((res) => res.json())
        .then((res) => {
          this.randomUser = res.results[0];
        });
      return randomUserPromise;
    },
  },
  computed: {
    ...mapGetters("userstore", [
      "getStateUser",
      "getStateLoggedIn",
      "getFriends",
    ]),
    user() {
      return this.getStateUser;
    },
  },
};
</script>
