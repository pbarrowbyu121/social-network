<template>
	<div>
		<div class="row">
			<div class="col text-h5 q-ml-md">Messages</div>
			<div class="row items-center" @click="newMessageDialog = true">
				<i class="col-1 q-mx-md far fa-edit fa-lg text-blue-8"></i>
			</div>
		</div>
		<q-separator />
		<q-list v-if="groupChats.length > 0">
			<GroupTile
				v-for="group in groupChats"
				:key="group.groupId"
				:group="group"
			/>
		</q-list>
		<!-- New Message Dialog -->
		<q-dialog
			v-model="newMessageDialog"
			transition-show="slide-up"
			transition-hide="slide-down"
			position="bottom"
		>
			<q-card>
				<div class="q-ml-md q-mt-md text-h5">New Message:</div>
				<FriendsGrid
					:friends="friends"
					:selectedFriends="selectedFriends"
					@select-friend="selectFriend"
				/>
				<div class="q-mx-auto q-mb-md" style="width: 150px">
					<q-btn
						color="primary"
						icon="question_answer"
						size="md"
						label="Message"
						@click="startGroupChat"
					/>
				</div>
			</q-card>
		</q-dialog>
	</div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import {
	getUsersGroups,
	testNumber,
	filterGroup,
	createGroup,
} from "../helpers";
import GroupTile from "../components/GroupTile";
import FriendsGrid from "../components/FriendsGrid";
export default {
	name: "MessageGroups",
	components: {
		GroupTile,
		FriendsGrid,
	},
	data() {
		return {
			groupChats: [],
			newMessageDialog: false,
			// QUESTION: Is this the best way to start, with the user already in the selectedFriends array?
			selectedFriends: [this.$store.state.userstore.user.uid],
		};
	},
	methods: {
		// QUESTION: I'm using a similar function in User page. Could this be DRY?
		startGroupChat() {
			const selectedFriendsArr = [...this.selectedFriends];
			filterGroup(selectedFriendsArr)
				.then((resp) => {
					if (resp) {
						return resp;
					} else {
						return createGroup(selectedFriendsArr);
					}
				})
				.then((response) => this.$router.push({ path: `/chat/${response}` }));
		},
		selectFriend(friendId) {
			let selectedFriendsArr = [...this.selectedFriends];
			if (selectedFriendsArr.includes(friendId)) {
				selectedFriendsArr = selectedFriendsArr.filter((id) => id !== friendId);
			} else if (!selectedFriendsArr.includes(friendId)) {
				selectedFriendsArr.push(friendId);
			}
			this.selectedFriends = selectedFriendsArr;
		},
	},
	computed: {
		...mapGetters("userstore", ["getStateUser", "getStateLoggedIn"]),
		user() {
			return this.getStateUser;
		},
		friends() {
			const subdividedArr = [];
			const allFriends = this.$store.state.userstore.friends;
			// will want to sort on first name if no last name
			allFriends.sort((a, b) => (a.lastName > b.lastName ? 1 : -1));
			const friendsLength = allFriends.length;
			const size = 3;
			// split the array into arrays of 3
			const splitArr = allFriends.reduce((acc, curr, i) => {
				if (!(i % size)) {
					acc.push(allFriends.slice(i, i + size)); // ..push a chunk of the original array to the accumulator
				}
				return acc;
			}, []);
			return splitArr;
		},
	},
	created() {
		// get groups
		getUsersGroups(this.getStateUser.uid).then((result) => {
			this.groupChats = result;
			return result;
		});
	},
};
</script>
