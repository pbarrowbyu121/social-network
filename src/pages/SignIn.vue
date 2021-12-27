<template>
	<q-btn
		v-if="!getStateLoggedIn"
		color="primary"
		label="Sign In"
		@click="modal = true"
	/>
	<q-btn v-else color="primary" label="Sign Out" @click="signOut" />
	<q-btn color="primary" label="Status" @click="showStatus" />
	<q-dialog v-model="modal">
		<!-- Sign In Method Modal -->
		<q-card style="width: 300px">
			<q-card-section>
				<q-btn
					v-if="!getStateLoggedIn"
					color="primary"
					label="w/ Google"
					@click="googleSignIn"
				/>
				<q-btn
					v-if="!getStateLoggedIn"
					color="primary"
					label="Create Account"
					@click="openNewAccountModal"
				/>
			</q-card-section>

			<q-card-actions align="right" class="bg-white text-teal">
				<q-btn flat label="Cancel" v-close-popup />
			</q-card-actions>
		</q-card>
	</q-dialog>
	<!-- Create Account Modal -->
	<q-dialog v-model="createAccountModal">
		<q-card style="width: 300px">
			<q-card-section>
				<q-input filled v-model="email" label="Email" />
				<q-input filled v-model="password" label="Password" />
			</q-card-section>

			<q-card-actions align="right" class="bg-white text-teal">
				<q-btn
					v-if="!getStateLoggedIn"
					color="primary"
					label="Create Account"
					@click="createAccount"
				/>
				<q-btn flat label="Cancel" v-close-popup />
			</q-card-actions>
		</q-card>
	</q-dialog>
</template>

<script>
import firebase from "firebase/compat/app";
// import * as firebase from "firebase/compat/app";
// import firebase from "firebase/compat/app";
import "firebase/compat/auth";
// import "firebase/compat/firestore";
// import Logout from "../components/Logout";
import { mapActions, mapGetters } from "vuex";
import { fetchUsers } from "../helpers";
import {
	getAuth,
	createUserWithEmailAndPassword,
	updateProfile,
} from "firebase/auth";

export default {
	name: "SignIn",
	data() {
		return {
			modal: false,
			createAccountModal: false,
			email: "",
			password: "",
		};
	},
	methods: {
		...mapActions("userstore", [
			"saveUserAction",
			"loggedInAction",
			"updateFriendsAction",
		]),
		googleSignIn() {
			const provider = new firebase.auth.GoogleAuthProvider();

			firebase
				.auth()
				.signInWithPopup(provider)
				// .onAuthStateChanged((user) => console.log("user here", user))
				.then((result) => {
					this.$q.notify({ message: "Sign In Success" });
					// this.$router.push("/");
					this.saveUserAction(result.user);
					this.loggedInAction(true);
					// this.loggedIn = true;
				})
				.then(() => {
					return this.getStateUser;
				})
				// fetch other users on sign in
				.then((res) => {
					return fetchUsers();
				})
				.then((res) => {
					this.updateFriendsAction(res);
					this.modal = false;
				})
				.catch((err) => {
					alert("Oops " + err.message);
				});
		},
		openNewAccountModal() {
			this.modal = false;
			this.createAccountModal = true;
		},
		createAccount() {
			const auth = getAuth();
			// console.log("auth", auth);
			createUserWithEmailAndPassword(auth, this.email, this.password)
				.then((userCredential) => {
					// Signed in
					const user = userCredential.user;
					// console.log("user", user);
					this.saveUserAction(user);
					this.loggedInAction(true);
					return user;
					// ...
				})
				.catch((error) => {
					const errorCode = error.code;
					const errorMessage = error.message;
					// ..
				});
			this.createAccountModal = false;
		},

		signOut() {
			firebase
				.auth()
				.signOut()
				.then(() => {
					this.saveUserAction(null);
					this.loggedInAction(false);
					this.loggedIn = false;
				})
				.then(() => console.log("logged IN", this.getStateLoggedIn));
			// this.$router
			//   .push("/")
			//   .then(() => {
			//     this.$q.notify({ message: "Sign Out Success" });
			//   })
			//   .catch((error) => console.log("error", error));
		},
		showStatus() {
			console.log("status", this.getStateLoggedIn);
			console.log("user", this.user);
		},
	},
	components: {
		// Logout,
	},
	created() {
		// console.log("created", this.getStateLoggedIn);
		// console.log("created user", this.getStateUser);
		// console.log("logged in", this.loggedIn);
	},
	computed: {
		...mapGetters("userstore", ["getStateUser", "getStateLoggedIn"]),
		user() {
			return this.getStateUser;
		},
	},
};
</script>
