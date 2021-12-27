<template>
	<q-layout view="lHh Lpr lFf">
		<q-header elevated>
			<q-toolbar>
				<q-btn
					flat
					dense
					round
					icon="menu"
					aria-label="Menu"
					@click="toggleLeftDrawer"
				/>

				<q-toolbar-title> Quasar App </q-toolbar-title>

				<div>Quasar v{{ $q.version }}</div>
			</q-toolbar>
		</q-header>

		<q-drawer v-model="leftDrawerOpen" show-if-above bordered>
			<q-list v-if="loggedIn">
				<q-item-label header>Menu</q-item-label>

				<EssentialLink
					v-for="link in authenticatedList"
					:key="link.title"
					v-bind="link"
					:to="link.to"
				/>
			</q-list>
			<q-list v-else>
				<q-item-label header>Menu</q-item-label>

				<EssentialLink
					v-for="link in notLoggedInList"
					:key="link.title"
					v-bind="link"
					:to="link.to"
				/>
			</q-list>
		</q-drawer>

		<q-page-container>
			<router-view />
		</q-page-container>
	</q-layout>
</template>

<script>
import EssentialLink from "components/EssentialLink.vue";
import { mapActions, mapGetters } from "vuex";

import { defineComponent, ref } from "vue";

export default defineComponent({
	name: "MainLayout",

	components: {
		EssentialLink,
	},
	data() {
		return {
			authenticatedList: [
				{
					title: "Sign Out",
					icon: "fas fa-sign-out-alt",
					to: "/signin",
				},
				{
					title: "Profile",
					icon: "fas fa-user-circle",
					to: "/profile",
				},
				{
					title: "Friends",
					icon: "fas fa-users",
					to: "/friends",
				},
				{
					title: "Create User",
					icon: "fas fa-user-plus",
					to: "/adduser",
				},
			],
			notLoggedInList: [
				{
					title: "Sign In",
					icon: "fas fa-sign-in-alt",
					to: "/signin",
				},
			],
		};
	},

	setup() {
		const leftDrawerOpen = ref(false);

		return {
			// essentialLinks: authenticatedList,
			leftDrawerOpen,
			toggleLeftDrawer() {
				leftDrawerOpen.value = !leftDrawerOpen.value;
			},
		};
	},
	computed: {
		...mapGetters("userstore", ["getStateLoggedIn"]),
		loggedIn() {
			return this.$store.state.userstore.loggedIn;
		},
	},
});
</script>
