<template>
	<div class="q-pa-md" style="max-width: 350px">
		<FriendsRow
			v-for="friendsArr in friends"
			:key="friendsArr[0]['name']"
			:friends="friendsArr"
			@select-friend="selectFriend"
			:selectedFriends="selectedFriends"
		/>
	</div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import FriendsRow from "../components/FriendsRow.vue";
export default {
	name: "Friends Grid",
	props: {
		friends: {
			type: Array,
			required: true,
		},
		selectedFriends: {
			type: Array,
			required: true,
		},
	},
	data() {
		return {};
	},
	components: {
		FriendsRow,
	},
	methods: {
		selectFriend(friendId) {
			this.$emit("select-friend", friendId);
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
	},
};
</script>
