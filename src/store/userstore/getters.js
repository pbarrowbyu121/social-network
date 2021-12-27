export function someGetter(/* state */) {}
export function getStateUser(state) {
	return state.user;
}

export function getStateLoggedIn(state) {
	return state.loggedIn;
}

export function getFriends(state) {
	return state.friends;
}

export function getGameProfile(state) {
	return state.gameProfile;
}
