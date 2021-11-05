<template>
  <div class="q-pa-md" style="max-width: 350px">
    <q-list bordered>
      <q-item
        v-for="friend in friends"
        clickable
        v-ripple
        :key="friend.username"
        :to="'/user/' + friend.uid"
      >
        <q-item-section avatar>
          <q-avatar>
            <img :src="friend.img" />
          </q-avatar>
        </q-item-section>
        <q-item-section>{{
          friend.firstName + " " + friend.lastName
        }}</q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { fetchUsers } from "../helpers.js";
export default {
  name: "Friends Page",
  data() {
    return {};
  },
  methods: {
    ...mapActions("userstore", ["updateFriendsAction"]),
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
    friends() {
      return this.getFriends;
    },
  },
};
</script>
