<template>
	<div class="row q-pt-md">
		<div
			v-for="friend in friends"
			:key="friend.id"
			class="col-4"
			@click="selectFriend(friend.createdBy)"
		>
			<div class="row justify-center">
				<span
					v-if="
						selectedFriends.includes(friend.createdBy) ||
						me.uid === friend.createdBy
					"
					class="selected"
				>
					<div class="row items-center full-height full-width justify-center">
						<q-avatar size="5rem">
							<q-img :src="friend.avatar" :ratio="1" />
						</q-avatar>
					</div>
				</span>
				<span v-else class="not-selected">
					<div class="row items-center full-height full-width justify-center">
						<q-avatar size="5rem" class="light-dimmed">
							<q-img :src="friend.avatar" :ratio="1" />
						</q-avatar>
					</div>
				</span>

				<q-item-label class="text-caption text-center q-mt-sm">{{
					friend.firstName +
					" " +
					friend.lastName +
					(me.uid === friend.createdBy ? " (you)" : "")
				}}</q-item-label>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "FriendsRow",
	data() {
		return {};
	},
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
	methods: {
		selectFriend(id) {
			this.$emit("select-friend", id);
		},
	},
	computed: {
		me() {
			const me = this.$store.state.userstore.user;
			return me;
		},
	},
};
</script>

<style lang="sass">
.selected
  height: 92px
  width: 92px
  background-color: $primary
  border-radius: 50%
  display: inline-block

.not-selected
  height: 92px
  width: 92px
  background-color: white
  border-radius: 50%
  display: inline-block
</style>
