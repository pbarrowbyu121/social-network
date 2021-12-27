<template>
	<div class="container">
		<div class="profile-pic">
			<q-img :src="friend.avatar" :ratio="1" width="300px" />
		</div>
		<div class="profile-container">
			<section>
				<h4 class="name">{{ friend.firstName }} {{ friend.lastName }}</h4>
				<div
					@click="getGroupId(['kolbXddAL5469Czy7KRi', 'zIqoDV7Jr6x8TBc16Wfh'])"
					class="actions clickable"
				>
					<i class="far fa-comment fa-4x"></i>
					<div>Chat</div>
				</div>
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
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const db = firebase.firestore();

export default {
	name: "User Page",
	props: ["id"],
	privateChat: ["kolbXddAL5469Czy7KRi", "zIqoDV7Jr6x8TBc16Wfh"],
	data() {
		return {};
	},
	methods: {
		filterGroup(userArray) {
			const vm = this;
			vm.groups = [];
			return new Promise((resolve, reject) => {
				let groupRef = db.collection("groups");

				userArray.forEach((userId) => {
					const field = "members." + userId;
					groupRef = groupRef.where(field, "==", true);
				});
				groupRef
					.get()
					.then(function (querySnapshot) {
						const allGroups = [];
						querySnapshot.forEach((doc) => {
							const data = doc.data();
							data.id = doc.id;
							Object.keys(data.members).length == 2
								? allGroups.push(data)
								: null;
						});
						if (allGroups.length > 0) {
							resolve(allGroups[0].id);
						} else {
							resolve(null);
						}
					})
					.catch(function (error) {
						reject(error);
					});
			});
		},
		getGroupId(userArray) {
			this.filterGroup(userArray).then((res) =>
				this.$router.push({ path: `/chat/${res}` })
			);
		},
	},
	computed: {
		...mapGetters("userstore", [
			"getStateUser",
			"getStateLoggedIn",
			"getFriends",
		]),
		// is this needed?
		user() {
			return this.getStateUser;
		},
		friend() {
			// const friend = this.getFriends.find(
			// 	(userObj) => userObj.uid === this.$route.params.id
			// );
			const friend = this.$store.state.userstore.friends.find(
				(userObj) => userObj.createdBy === this.$route.params.id
			);
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

.actions
	margin: auto
	width: 100%
	text-align: center

.bio
	display: flex
	flex-direction: row

.hometown
	display: flex
	flex-direction: row
	padding-bottom: 10px

.clickable
	cursor: pointer
</style>
