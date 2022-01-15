import { route } from "quasar/wrappers";
import {
	createRouter,
	createMemoryHistory,
	createWebHistory,
	createWebHashHistory,
} from "vue-router";
import routes from "./routes";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	updateProfile,
	setPersistence,
	onAuthStateChanged,
} from "firebase/auth";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function ({ store /*, ssrContext  */ }) {
	const createHistory = process.env.SERVER
		? createMemoryHistory
		: process.env.VUE_ROUTER_MODE === "history"
		? createWebHistory
		: createWebHashHistory;

	const Router = createRouter({
		scrollBehavior: () => ({ left: 0, top: 0 }),
		routes,

		// Leave this as is and make changes in quasar.conf.js instead!
		// quasar.conf.js -> build -> vueRouterMode
		// quasar.conf.js -> build -> publicPath
		history: createHistory(
			process.env.MODE === "ssr" ? void 0 : process.env.VUE_ROUTER_BASE
		),
	});

	const protectedRoutes = [
		"/chat/:id",
		"/friends",
		"/adduser",
		"/messages",
		"/user/:id",
	];

	// Navigation route protection
	Router.beforeEach(async (to, from, next) => {
		// persist log in state
		const user = await new Promise((resolve, reject) => {
			firebase.auth().onAuthStateChanged((user) => {
				store.dispatch("userstore/saveUserAction", user);
				// do I need this, now that I'm using user? What if instead of checking for loggedIn I checked for user in state?
				store.dispatch("userstore/loggedInAction", true);
				resolve(user);
			});
		});

		const loggedIn = store.getters["userstore/getStateLoggedIn"];
		const isProtected = to.matched.some((route) =>
			protectedRoutes.includes(route.path)
		);
		if (!loggedIn && to.path !== "/signin" && isProtected) {
			next({ path: "/signin" });
		} else {
			next();
		}
	});

	return Router;
});
