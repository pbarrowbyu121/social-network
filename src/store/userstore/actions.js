export function someAction(/* context */) {}

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

export function saveUserAction({ commit }, payload) {
  console.log("saveUserAction called");
  commit("SAVE_USER_MUTATION", payload);
}

export function loggedInAction({ commit }, payload) {
  console.log("loggedInAction called", payload);
  commit("LOGGED_IN_MUTATION", payload);
}

export function updateFriendsAction({ commit }, payload) {
  commit("UPDATE_FRIENDS", payload);
}
