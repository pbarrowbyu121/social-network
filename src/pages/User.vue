<template>
	<div class="profile-container full-width">
		<div class="full-width relative-position">
			<q-img :src="avatar" :ratio="1" class="profile-pic" />
			<div
				class="absolute-top row q-mt-md q-mr-md"
				v-if="isMe"
				@click="openChangeProfilePic"
			>
				<div class="absolute-right">
					<i class="fas fa-pen fa-lg text-grey-1" />
				</div>
			</div>
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
				<q-btn
					push
					color="primary"
					round
					icon="fas fa-plus"
					@click="openUploadPhoto"
					v-else
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
		<!-- Photos -->
		<div>Photos</div>
		<div class="row w100" v-if="postsArr.length > 0">
			<div class="col-3 q-pa-xs" v-for="item in postsArr" :key="item.id">
				<q-img :src="item.imageURL" :ratio="1" />
			</div>
		</div>
		<!-- Upload Photo Dialog -->
		<q-dialog
			v-model="uploadPhoto"
			transition-show="slide-up"
			transition-hide="slide-down"
			position="bottom"
		>
			<q-card>
				<UploadPhotoDialog />
			</q-card>
		</q-dialog>
		<!-- Edit Profile Pic Dialog -->
		<q-dialog
			v-model="editProfilePic"
			transition-show="slide-right"
			transition-hide="slide-left"
			position="left"
		>
			<q-card style="width: 450px; max-width: 95vw">
				<div class="row w100 q-py-sm text-body1">
					<div
						class="col-2 q-pl-md close-profile-pic"
						@click="editProfilePic = false"
					>
						<i class="fas fa-times fa-lg" />
					</div>
					<div class="col text-center q-my-auto">Select new profile pic</div>
					<!-- <div class="col-2 q-pr-md q-my-auto text-center text-bold">Add</div> -->

					<q-btn
						class="col-2 q-mr-sm q-my-auto text-center text-bold"
						flat
						color="primary"
						label="Add"
						@click="changeProfilePic"
					/>
				</div>
				<div class="row w100" v-if="postsArr.length > 0">
					<div
						class="col-4 q-pa-xs"
						v-for="item in postsArr"
						:key="item.id"
						@click="() => selectNewPic(item.imageURL)"
					>
						<q-img
							:class="[item.imageURL === newProfilePic ? 'selected-photo' : '']"
							:src="item.imageURL"
							:ratio="1"
							width="110px"
						/>
					</div>
				</div>
			</q-card>
		</q-dialog>
	</div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { Loading, QSpinnerGears } from "quasar";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { filterGroup, createGroup, updateUser, getPosts } from "../helpers";
import UploadPhotoDialog from "../components/UploadPhotoDialog";

const db = firebase.firestore();

export default {
	name: "User Page",
	props: ["id"],
	privateChat: [],
	components: {
		UploadPhotoDialog,
	},
	data() {
		return {
			editMode: false,
			userBio: "",
			from: "",
			friend: {},
			postsArr: [],
			uploadPhoto: false,
			editProfilePic: false,
			newProfilePic: "",
			avatar: "",
		};
	},
	methods: {
		// QUESTION: I'm using a similar function in MessageGroups. Could this be DRY?
		// editMode() {
		// 	console.log("editMode");
		// },
		...mapActions("userstore", ["saveUserAction", "updateFriendsActionV2"]),
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
		openUploadPhoto() {
			this.uploadPhoto = true;
		},
		openChangeProfilePic() {
			this.editProfilePic = true;
			console.log("changeProfilePic");
		},
		selectNewPic(newURL) {
			this.newProfilePic = newURL;
		},
		changeProfilePic() {
			this.editProfilePic = false;
			Loading.show();
			const userId = this.$route.params.id;
			updateUser(userId, { avatar: this.newProfilePic })
				.then((response) => {
					this.avatar = response.avatar;
					this.updateFriendsActionV2();
				})
				.then(() => {
					Loading.hide();
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
		const userId = this.$route.params.id;
		const friend = this.$store.state.userstore.friends.find(
			(userObj) => userObj.createdBy === userId
		);
		this.friend = friend;
		this.userBio = friend.bio;
		this.from = friend.from;
		this.avatar = friend.avatar;
		// get posts from firebase
		getPosts(userId).then((result) => {
			this.postsArr = result;
			return result;
		});
	},
};
</script>

<style lang="sass">
.close-profile-pic
	text-align: center
	display: flex
	margin: auto

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

.selected-photo
	border-style: solid
	border-width: 4px
	border-color: blue
</style>
