export function someAction(/* context */) {}

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import { fetchUsers } from "../../helpers";

export function saveUserAction({ commit }, payload) {
	commit("SAVE_USER_MUTATION", payload);
}

export function loggedInAction({ commit }, payload) {
	commit("LOGGED_IN_MUTATION", payload);
}

export function updateFriendsActionV2({ commit }) {
	return fetchUsers().then((res) => commit("UPDATE_FRIENDS", res));
}

export function updateGameProfileAction({ commit }, payload) {
	commit("SET_GAME_PROFILE", payload);
}
