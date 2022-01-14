<template>
	<q-item clickable :to="chatLink">
		<q-item-section>
			<div class="row q-pb-xs">
				<div class="col">
					<q-avatar
						v-for="avatar in avatars"
						:key="avatar"
						size="sm"
						class="q-mr-sm"
					>
						<img :src="avatar" />
					</q-avatar>
				</div>
				<div class="col-3">
					<q-item-label class="text-right" v-if="recentMessage" caption>{{
						getMessageDateDisplay(recentMessage.createdAt)
					}}</q-item-label>
				</div>
			</div>
			<!-- <q-item-label>Single line item</q-item-label> -->
			<div class="row">
				<q-item-label
					class="col"
					style="height: 28px"
					v-if="recentMessage"
					caption
					lines="2"
					>{{ recentMessage.message ?? " " }}</q-item-label
				>
				<q-item-label style="height: 28px" v-else caption lines="2">{{
					" "
				}}</q-item-label>
				<div class="col-1 text-right">
					<i class="fas fa-chevron-right" />
				</div>
			</div>
		</q-item-section>

		<!-- <q-item-section side top>
		<q-item-label caption>5 min ago</q-item-label>
		</q-item-section> -->
	</q-item>
	<q-separator />
</template>

<script>
import { fetchUser, fetchMessages, displayMessageDate } from "../helpers";
import { DateTime, Interval } from "luxon";
import { mapActions, mapGetters } from "vuex";
export default {
	name: "GroupTile",
	data() {
		return {
			mostRecentMessage: null,
			participantNames: [],
			recentMessage: null,
			avatars: [],
		};
	},
	props: {
		group: {
			type: Object,
			required: true,
		},
	},
	methods: {
		getMessageDateDisplay(input) {
			return displayMessageDate(input);
		},
	},
	created() {
		const members = Object.keys(this.group.members);
		Promise.all(
			members.filter((id) => id !== this.me.uid).map((id) => fetchUser(id))
		).then((values) => {
			this.participantNames = values.map((value) => value.firstName);
			this.avatars = values.map((value) => value.avatar);
		});
		fetchMessages(this.group.groupId).then((result) => {
			this.recentMessage = result.sort((a, b) =>
				a.createdAt < b.createdAt ? 1 : -1
			)[0];
		});
	},
	computed: {
		...mapGetters("userstore", ["getStateUser", "getStateLoggedIn"]),
		me() {
			return this.getStateUser;
		},
		chatLink() {
			return "/chat/" + this.group.groupId;
		},
	},
};
</script>
