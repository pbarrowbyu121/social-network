<template>
	<div class="q-pa-md" style="max-width: 350px">
		<q-list bordered>
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
		</q-list>
	</div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
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
			const user = this.$store.state.userstore.user;
			return user;
		},
		friends() {
			return this.$store.state.userstore.friends;
		},
	},
};
</script>
