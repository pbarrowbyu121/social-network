<template>
	<q-card no-outline square :id="'post-' + post.id">
		<div class="q-pl-sm q-py-sm row">
			<q-avatar size="2rem">
				<q-img :src="user.avatar" :ratio="1" />
			</q-avatar>
			<div class="q-ml-sm q-my-auto text-weight-medium">
				{{ user.firstName + " " + user.lastName }}
			</div>
		</div>
		<q-img :src="post.imageURL" :ratio="1" />
		<q-card-section>{{ post.caption }}</q-card-section>
		<div class="q-ml-md q-pb-md text-caption text-grey-6">
			{{ postDateTime }}
		</div>
	</q-card>
</template>

<script>
import { DateTime, Interval } from "luxon";
export default {
	name: "Post",
	props: ["post", "user"],
	data() {
		return {};
	},
	created() {},
	computed: {
		postDateTime() {
			const dt = new DateTime.fromSeconds(this.post.date / 1000);
			return dt.toLocaleString(DateTime.DATE_MED);
		},
	},
};
</script>
