export function someAction(/* context */) {}

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

export function saveUserAction({ commit }, payload) {
	commit("SAVE_USER_MUTATION", payload);
}

export function loggedInAction({ commit }, payload) {
	commit("LOGGED_IN_MUTATION", payload);
}

export function updateFriendsAction({ commit }, payload) {
	commit("UPDATE_FRIENDS", payload);
}

export function updateGameProfileAction({ commit }, payload) {
	commit("SET_GAME_PROFILE", payload);
}
