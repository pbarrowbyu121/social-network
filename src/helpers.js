// import updateFriendsAction from "./store/userstore/actions.js";
export function fetchUsers() {
  console.log("getting Users");
  const getUsersPromise = fetch("http://localhost:3000/user-profiles").then(
    (res) => res.json()
  );
  // .then((res) => updateFriendsAction(res));
  return getUsersPromise;
}
