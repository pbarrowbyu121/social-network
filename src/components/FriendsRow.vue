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
						<q-avatar>
							<img :src="friend.avatar" />
						</q-avatar>
					</div>
				</span>
				<span v-else class="not-selected">
					<div class="row items-center full-height full-width justify-center">
						<q-avatar class="light-dimmed">
							<img :src="friend.avatar" />
						</q-avatar>
					</div>
				</span>

				<q-item-label class="text-caption text-center">{{
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
			if (this.me.uid === id) {
				return;
			} else {
				this.$emit("select-friend", id);
			}
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
  height: 53px
  width: 53px
  background-color: $primary
  border-radius: 50%
  display: inline-block

.not-selected
  height: 53px
  width: 53px
  background-color: white
  border-radius: 50%
  display: inline-block
</style>
