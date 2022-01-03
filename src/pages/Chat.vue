<template>
	<q-chat-message
		v-for="item in messages"
		:key="item.message"
		:name="getUser(item.createdBy).firstName"
		:text="[item.message]"
		:avatar="item.avatar"
		:sent="item.createdBy === user.uid"
		:bg-color="item.createdBy === user.uid ? 'primary' : 'grey'"
		:stamp="item.createdAt"
		class="q-px-sm"
	/>
	<q-input
		class="q-mx-md q-mt-md"
		rounded
		outlined
		v-model="newMessage"
		placeholder="Send"
		dense
	>
		<template v-slot:append>
			<q-btn round dense flat icon="send" @click="sendMessage" />
		</template>
	</q-input>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { fetchMessages, updateMostRecentMessage } from "../helpers";
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
			fetchMessages(this.$route.params.id).then((res) => (this.messages = res));
		},
		getUser(id) {
			return this.friends.find((friend) => friend.createdBy === id);
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
			const messageTime = new Date();
			const groupId = this.$route.params.id;
			const newMessageObj = {
				groupId: groupId,
				createdBy: this.user.uid,
				message: this.newMessage,
				createdAt: messageTime,
				avatar: this.gameProfile.avatar,
			};
			this.postMessage(newMessageObj)
				.then((res) => updateMostRecentMessage(groupId, messageTime))
				.then((res) => this.getMessages());
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
