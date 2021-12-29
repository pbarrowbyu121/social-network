<template>
	<div class="q-pa-md" style="max-width: 350px">
		<!-- <q-list bordered>
			<q-item
				v-for="friend in friends"
				:key="friend.username"
				clickable
				v-ripple
				:to="'/user/' + friend.createdBy"
			>
				<q-item-section avatar>
					<q-avatar>
						<img :src="friend.avatar" />
					</q-avatar>
				</q-item-section>
				<q-item-section>{{
					friend.firstName +
					" " +
					friend.lastName +
					(user.uid === friend.createdBy ? " (you)" : "")
				}}</q-item-section>
			</q-item>
		</q-list> -->
		<FriendsRow
			v-for="friendsArr in friends"
			:key="friendsArr[0]['name']"
			:friends="friendsArr"
			@select-friend="selectFriend"
			:selectedFriends="selectedFriends"
		/>
		<div class="absolute-bottom q-mx-auto q-mb-md" style="width: 150px">
			<q-btn
				color="primary"
				icon="question_answer"
				size="md"
				label="Message"
				@click="startGroupChat"
			/>
		</div>
	</div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import FriendsRow from "../components/FriendsRow.vue";
import { filterGroup, createGroup } from "../helpers";
export default {
	name: "Friends Page",
	data() {
		return {
			// QUESTION: Is this the best way to start, with the user already in the selectedFriends array?
			selectedFriends: [this.$store.state.userstore.user.uid],
		};
	},
	components: {
		FriendsRow,
	},
	methods: {
		...mapActions("userstore", ["updateFriendsAction"]),
		selectFriend(friendId) {
			let selectedFriendsArr = [...this.selectedFriends];
			if (selectedFriendsArr.includes(friendId)) {
				selectedFriendsArr = selectedFriendsArr.filter((id) => id !== friendId);
			} else if (!selectedFriendsArr.includes(friendId)) {
				selectedFriendsArr.push(friendId);
			}
			this.selectedFriends = selectedFriendsArr;
		},
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
	},
	computed: {
		...mapGetters("userstore", [
			"getStateUser",
			"getStateLoggedIn",
			"getFriends",
		]),
		me() {
			const me = this.$store.state.userstore.user;
			return me;
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
};
</script>
