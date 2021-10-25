export function someMutation(/* state */) {}

export const SAVE_USER_MUTATION = (state, user) => {
  state.user = user;
};

export const LOGGED_IN_MUTATION = (state, status) => {
  state.loggedIn = status;
};
