<template>
	<div class="profile-container q-mx-auto">
		<q-card>
			<div class="full-width relative-position" id="testID">
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
					<div v-else>
						<q-btn
							push
							color="primary"
							round
							icon="fas fa-plus"
							@click="openUploadPhoto"
						/>
						<q-btn
							class="q-ml-sm"
							push
							color="primary"
							round
							icon="fas fa-pen"
							@click="editMode = !editMode"
						/>
					</div>
				</div>
			</div>

			<q-card-section class="q-mt-lg text-body1" v-if="editMode">
				<div class="row q-pt-sm">
					<q-input
						class="col"
						filled
						v-model="userBio"
						:placeholder="userBio"
						dense
					/>
				</div>
				<div class="row q-pt-sm">
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
			<q-card-section v-else class="q-mt-lg text-body1">
				<div class="text-justify">{{ userBio }}</div>
				<div class="q-mt-lg q-mx-auto text-center">
					<i class="fas fa-map-marker-alt fa-lg q-pr-sm" />
					{{ from }}
				</div>
			</q-card-section>
			<!-- Photos -->

			<div class="row w100" v-if="postsArr.length > 0">
				<!-- This option opens a dialog with posts -->
				<!-- <div
					class="col-4 q-pa-xs"
					v-for="item in postsArr"
					:key="item.id"
					@click="openPosts(item.id)"
				>
					<q-img :src="item.imageURL" :ratio="1" />
				</div> -->
				<!-- This is to lead to another actual page, not just dialog -->
				<div class="col-4 q-pa-xs" v-for="item in postsArr" :key="item.id">
					<router-link
						:to="'/user-posts/' + friend.createdBy + '/#post-' + item.id"
					>
						<q-img :src="item.imageURL" :ratio="1" />
					</router-link>
				</div>
			</div>
		</q-card>
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
		<!-- Posts dialog -->
		<q-dialog
			v-model="viewPosts"
			transition-show="slide-left"
			transition-hide="slide-right"
			maximized
		>
			<div class="bg-white">
				<div class="w100 q-py-sm text-body1 relative-position posts-header1">
					<div
						class="q-pl-md absolute-left justify-center items-center row"
						@click="viewPosts = false"
					>
						<i class="fas fa-angle-left fa-lg" />
					</div>
					<div class="text-center q-my-auto">
						<div class="text-uppercase text-caption">
							{{ friend.firstName + " " + friend.lastName }}
						</div>
						<div class="text-weight-medium">Posts</div>
					</div>
				</div>
				<q-scroll-area class="row full-height">
					<div v-for="item in postsArr" :key="item.id">
						<Post :post="item" :user="{ ...friend }" />
					</div>
				</q-scroll-area>
			</div>
		</q-dialog>
	</div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { Loading, QSpinnerGears, scroll } from "quasar";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { filterGroup, createGroup, updateUser, getPosts } from "../helpers";
import UploadPhotoDialog from "../components/UploadPhotoDialog";
import Post from "../components/Post";

const { getVerticalScrollPosition } = scroll;

const db = firebase.firestore();

export default {
	name: "User Page",
	props: ["id"],
	privateChat: [],
	components: {
		UploadPhotoDialog,
		Post,
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
			viewPosts: false,
		};
	},
	methods: {
		// QUESTION: I'm using a similar function in MessageGroups. Could this be DRY?
		// editMode() {
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
		openPosts(itemID) {
			this.viewPosts = true;
			// trying to scroll to position of post
			const postID = "post-" + itemID;

			const element = document.getElementById(postID);

			// const position = getVerticalScrollPosition(element);
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
			this.postsArr = result.sort((a, b) => (a.date > b.date ? -1 : 1));
			return result;
		});
	},
};
</script>

<style lang="sass">
.close-posts
	text-align: center
	display: flex
	flex-direction: row

.container
	border-style: solid
	border-width: 2px
	width: 75%
	margin: auto
	display: flex
	flex-direction: row

.profile-container
	max-width: 390px

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

.photos-header
	border-radius: 25px

.posts-header1
	border-bottom-style: solid
	border-width: 1px
	border-color: lightgrey
</style>
