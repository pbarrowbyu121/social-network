<template>
	<div class="profile-container full-width">
		<div class="full-width relative-position">
			<q-img :src="friend.avatar" :ratio="1" class="profile-pic" />
			<div class="absolute-bottom text-white text-h5 q-mb-lg q-ml-md">
				{{ friend.firstName }} {{ friend.lastName }} {{ isMe ? "(you)" : "" }}
			</div>
			<div class="user-actions absolute-bottom q-ml-md">
				<q-btn
					push
					color="primary"
					round
					icon="chat_bubble_outline"
					@click="startGroupChat"
					v-if="!isMe"
				/>
			</div>
		</div>
		<q-card square flat bordered class="q-mt-lg">
			<q-card-section>
				<div class="row">
					<div class="text-h6 col">About Me:</div>
					<div
						class="col-1 row items-center"
						v-if="isMe"
						@click="editMode = !editMode"
					>
						<i class="fas fa-pen fa-lg text-blue-8" />
					</div>
				</div>
			</q-card-section>

			<!-- about me -->
			<q-card-section class="q-pt-none" v-if="editMode">
				<div class="row q-pt-sm">
					<div class="col-2">Bio:</div>
					<q-input
						class="col"
						filled
						v-model="userBio"
						:placeholder="userBio"
						dense
					/>
				</div>
				<div class="row q-pt-sm">
					<div class="col-2">From:</div>
					<q-input
						filled
						v-model="from"
						:placeholder="from"
						dense
						class="col"
					/>
				</div>
				<div class="row q-mt-sm">
					<div class="col"></div>
					<q-btn
						class="col-3"
						dense
						color="primary"
						label="Save"
						@click="saveEdit"
					/>
					<q-btn
						dense
						class="col-3 q-ml-sm"
						color="gray"
						label="Cancel"
						text-color="primary"
						@click="editMode = false"
					/>
				</div>
			</q-card-section>
			<q-card-section class="q-pt-none" v-else>
				<q-card-section class="q-pt-sm">
					<div class="row">
						<div class="col-2">Bio:</div>
						<div class="col">{{ userBio }}</div>
					</div>
				</q-card-section>
				<q-card-section class="q-pt-sm">
					<div class="row">
						<div class="col-2">From:</div>
						<div class="col">{{ from }}</div>
					</div>
				</q-card-section>
			</q-card-section>
		</q-card>
	</div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { Loading, QSpinnerGears } from "quasar";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { filterGroup, createGroup, updateUser } from "../helpers";

const db = firebase.firestore();

export default {
	name: "User Page",
	props: ["id"],
	privateChat: [],
	data() {
		return {
			editMode: false,
			userBio: "",
			from: "",
			friend: {},
		};
	},
	methods: {
		// QUESTION: I'm using a similar function in MessageGroups. Could this be DRY?
		// editMode() {
		// 	console.log("editMode");
		// },
		...mapActions("userstore", [
			"updateFriendsAction",
			"saveUserAction",
			"updateFriendsActionV2",
		]),
		startGroupChat() {
			const friendsArr = [this.$route.params.id, this.me.uid];
			filterGroup(friendsArr)
				.then((resp) => {
					if (resp) {
						return resp;
					} else {
						return createGroup(selectedFriendsArr);
					}
				})
				.then((response) => this.$router.push({ path: `/chat/${response}` }));
		},
		saveEdit() {
			Loading.show();
			updateUser(this.id, { bio: this.userBio, from: this.from })
				.then((response) => {
					this.bio = response.bio;
					this.from = response.from;
					this.updateFriendsActionV2();
				})
				.then(() => {
					Loading.hide();
					this.editMode = false;
				});
		},
	},
	computed: {
		...mapGetters("userstore", [
			"getStateUser",
			"getStateLoggedIn",
			"getFriends",
		]),
		me() {
			return this.getStateUser;
		},
		isMe() {
			return this.getStateUser.uid === this.$route.params.id;
		},
	},
	mounted() {
		const friend = this.$store.state.userstore.friends.find(
			(userObj) => userObj.createdBy === this.$route.params.id
		);
		this.friend = friend;
		this.userBio = friend.bio;
		this.from = friend.from;
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
	max-width: 320px

.profile-pic
	border-radius: 25px

.user-actions
	margin-bottom: -20px

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
