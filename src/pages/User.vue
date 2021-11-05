<template>
  <div class="container">
    <div class="profile-pic">
      <q-img :src="friend.img" :ratio="1" width="300px" />
    </div>
    <div class="profile-container">
      <section>
        <h3 class="name">{{ friend.firstName }} {{ friend.lastName }}</h3>
        <div class="info">
          <div class="hometown">
            <div :style="{ minWidth: '80px' }">Hometown:</div>
            <div>{{ friend.hometown }}</div>
          </div>
          <div class="bio">
            <div :style="{ minWidth: '80px' }">Bio:</div>
            <div>{{ friend.bio }}</div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "User Page",
  props: ["id"],
  data() {
    return {};
  },
  computed: {
    ...mapGetters("userstore", [
      "getStateUser",
      "getStateLoggedIn",
      "getFriends",
    ]),
    user() {
      console.log("users?", this.getFriends);
      return this.getStateUser;
    },
    friend() {
      const friend = this.getFriends.find(
        (userObj) => userObj.uid === this.$route.params.id
      );
      console.log("friend", friend);
      return friend;
    },
  },
};
</script>

<style lang="sass">
.container
	border-style: solid
	border-width: 2px
	width: 75%
	margin: auto
	display: flex
	flex-direction: row

.profile-container
	width: 100%
	margin: 20px
	border: 1px solid
	padding: 10px
	box-shadow: 5px 10px #888888

.profile-pic
	margin: auto
	margin-left: 20px

.name
	text-align: center

.info
	padding-bottom: 10px
	padding-right: 20px
	padding-left: 20px
	padding-bottom: 20px

.bio
	display: flex
	flex-direction: row

.hometown
	display: flex
	flex-direction: row
	padding-bottom: 10px
</style>
