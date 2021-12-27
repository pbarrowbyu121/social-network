export function someMutation(/* state */) {}

export const SAVE_USER_MUTATION = (state, user) => {
	state.user = user;
};

export const LOGGED_IN_MUTATION = (state, status) => {
	state.loggedIn = status;
};

export const UPDATE_FRIENDS = (state, friends) => {
	state.friends = friends;
};

export const SET_GAME_PROFILE = (state, gameProfile) => {
	state.gameProfile = gameProfile;
};
