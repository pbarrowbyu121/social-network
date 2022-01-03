<template>
	<div>
		<div class="text-h5 q-ml-md">Messages</div>
		<q-separator />
		<q-list v-if="groupChats.length > 0">
			<GroupTile
				v-for="group in groupChats"
				:key="group.groupId"
				:group="group"
			/>
		</q-list>
	</div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { getUsersGroups, testNumber } from "../helpers";
import GroupTile from "../components/GroupTile";
export default {
	name: "MessageGroups",
	components: {
		GroupTile,
	},
	data() {
		return {
			groupChats: [],
		};
	},
	computed: {
		...mapGetters("userstore", ["getStateUser", "getStateLoggedIn"]),
		user() {
			return this.getStateUser;
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
