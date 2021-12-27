<template>
	<q-chat-message
		v-for="item in messages"
		:key="item.message"
		name="me"
		:text="[item.message]"
		:avatar="item.avatar"
		:sent="item.createdBy === user.uid"
		:bg-color="item.createdBy === user.uid ? 'primary' : 'grey'"
		stamp="7 minutes ago"
	/>
	<q-input rounded outlined v-model="newMessage" placeholder="Send" dense>
		<template v-slot:append>
			<q-btn round dense flat icon="send" @click="sendMessage" />
		</template>
	</q-input>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { fetchMessages } from "../helpers";
export default {
	name: "Chat",
	props: ["id"],
	data() {
		return {
			messages: [],
			newMessage: "",
		};
	},
	methods: {
		...mapActions("userstore", ["updateGameProfileAction"]),
		getMessages() {
			fetchMessages().then((res) => (this.messages = res));
		},
		postMessage(messageObj) {
			const sendMessagePromise = fetch("http://localhost:3000/postMessage", {
				method: "POST",
				headers: {
					"Content-type": "application/json",
				},
				body: JSON.stringify(messageObj),
			});
			return sendMessagePromise;
		},
		sendMessage() {
			const newMessageObj = {
				groupId: this.$route.params.id,
				createdBy: this.user.uid,
				message: this.newMessage,
				createdAt: new Date(),
				avatar: this.gameProfile.avatar,
			};
			this.postMessage(newMessageObj).then((res) => this.getMessages());
			this.newMessage = "";
		},
	},
	created() {
		const friends = this.$store.state.userstore.friends;
		this.updateGameProfileAction(
			friends.find(
				(friend) => friend.createdBy === this.$store.state.userstore.user.uid
			)
		);
		this.getMessages();
		// this.user;
	},
	computed: {
		...mapGetters("userstore", [
			"getStateUser",
			"getStateLoggedIn",
			"getFriends",
			"getGameProfile",
		]),
		user() {
			return this.getStateUser;
		},
		friends() {
			return this.getFriends;
		},
		gameProfile() {
			return this.getGameProfile;
		},
	},
};
</script>
