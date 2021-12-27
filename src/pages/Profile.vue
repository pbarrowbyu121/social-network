<template>
	<div>Profile Page</div>
	<q-avatar size="100px">
		<img :src="user.photoURL ?? null" />
	</q-avatar>
	<div>Name:</div>
	<div>{{ user.displayName ?? "" }}</div>
	<div>Email:</div>
	<div>{{ user.email }}</div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
	name: "Profile Page",
	data() {
		return {};
	},
	computed: {
		...mapGetters("userstore", ["getStateUser", "getStateLoggedIn"]),
		user() {
			return this.getStateUser;
		},
	},
};
</script>
