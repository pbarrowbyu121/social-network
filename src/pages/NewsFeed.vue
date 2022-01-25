<template>
	<q-page-container>
		<q-page>
			<div v-for="item in posts" :key="item.id" :id="item.id">
				<router-link
					:to="'/user-posts/' + item.user + '/#post-' + item.id"
					style="text-decoration: none"
					class="text-black"
				>
					<Post :post="item" :user="getPostUser(item.user)" />
				</router-link>
			</div>
			<q-page-sticky expand position="top">
				<q-toolbar
					class="bg-white relative-position justify-center row posts-toolbar"
				>
					<div
						class="absolute-left q-px-md row items-center justify-center"
					></div>
					<div class="text-center q-my-auto">
						<div id="user-name" class="text-uppercase text-caption">
							News Feed
						</div>
						<div class="text-weight-medium">Posts</div>
					</div>
				</q-toolbar>
			</q-page-sticky>
		</q-page>
	</q-page-container>
</template>

<script>
import { getAllPosts } from "../helpers";
import Post from "../components/Post";
export default {
	name: "News Feed",
	components: {
		Post,
	},
	data() {
		return {
			posts: [],
			friends: [],
		};
	},
	methods: {
		viewPosts() {
			console.log("viewPosts");
		},
		getPostUser(userId) {
			const postUser = this.friends.find(
				(friend) => friend.createdBy === userId
			);
			// QUESTION: I DON'T LIKE HAVING TO SPREAD THESE PROXY OBJECTS. HOW TO DO THIS BETTER?
			return postUser;
		},
	},
	mounted() {
		getAllPosts().then(
			(response) =>
				(this.posts = response.sort((a, b) => (a.date > b.date ? -1 : 1)))
		);
		const allFriends = this.$store.state.userstore.friends;
		this.friends = allFriends;
	},
};
</script>

<style lang="sass">
.posts-toolbar
	border-bottom-style: solid
	border-width: 1px
	border-color: lightgrey
</style>
