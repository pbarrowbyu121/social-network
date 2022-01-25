<template>
	<q-page-container>
		<q-page>
			<div v-for="item in posts" :key="item.id" :id="item.id">
				<Post :post="item" :user="{ ...friend }" />
			</div>
			<q-page-sticky expand position="top">
				<q-toolbar
					class="bg-white relative-position justify-center row posts-toolbar"
				>
					<div class="absolute-left q-px-md row items-center justify-center">
						<router-link
							:to="userProfileLink"
							style="display: inline-block; text-decoration: none"
						>
							<i class="fas fa-angle-left fa-lg" />
						</router-link>
					</div>
					<div class="text-center q-my-auto">
						<div id="user-name" class="text-uppercase text-caption">
							{{ friend.firstName + " " + friend.lastName }}
						</div>
						<div class="text-weight-medium">Posts</div>
					</div>
				</q-toolbar>
			</q-page-sticky>
		</q-page>
	</q-page-container>
</template>

<script>
import { scroll } from "quasar";
import { getAllPosts, getPosts } from "../helpers";
import Post from "../components/Post";
export default {
	name: "User Posts",
	props: ["id"],
	components: {
		Post,
	},
	data() {
		return {
			posts: [],
			friend: [],
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
		scroll(scrollTarget) {
			var element = document.getElementById(scrollTarget);
			var headerOffset = 100;
			var elementPosition = element.getBoundingClientRect().top;
			var offsetPosition = elementPosition + window.pageYOffset - headerOffset;

			window.scrollTo({
				top: offsetPosition,
				behavior: "smooth",
			});
		},
	},
	mounted() {
		const userId = this.$route.params.id;
		const friend = this.$store.state.userstore.friends.find(
			(userObj) => userObj.createdBy === userId
		);
		this.friend = friend;
		// get posts from firebase
		getPosts(userId)
			.then((result) => {
				this.posts = result.sort((a, b) => (a.date > b.date ? -1 : 1));
				return;
			})
			.then(() => {
				const scrollTarget = window.location.hash.split("post-")[1];
				if (scrollTarget) this.scroll(scrollTarget);
			});
	},
	computed: {
		userProfileLink() {
			return "/user/" + this.$route.params.id;
		},
	},
};
</script>

<style lang="sass">
.posts-toolbar
	border-bottom-style: solid
	border-width: 1px
	border-color: lightgrey
</style>
