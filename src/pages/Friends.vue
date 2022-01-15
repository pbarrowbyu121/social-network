<template>
	<div style="max-width: 350px">
		<FriendsGrid
			:friends="friends"
			:selectedFriends="selectedFriends"
			@select-friend="selectFriend"
		/>
	</div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { filterGroup, createGroup } from "../helpers";
import FriendsGrid from "../components/FriendsGrid.vue";
export default {
	name: "Friends Page",
	data() {
		return {};
	},
	components: {
		FriendsGrid,
	},
	methods: {
		selectFriend(friendId) {
			this.$router.push({ path: `/user/${friendId}` });
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
		selectedFriends() {
			const friends = this.$store.state.userstore.friends.map(
				(friend) => friend.createdBy
			);
			return friends;
		},
	},
};
</script>
