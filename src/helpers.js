// const express = require("express");
// const app = express();
// const port = 3000;
// const admin = require("firebase-admin");
// let UUID = require("uuid-v4");

// firestore stuff
// const serviceAccount = require("./serviceAccountKey.json");

import { getDatabase, ref, onValue, child, get } from "firebase/database";

import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
import { app } from "../src/boot/firebase.js";

// app.use(express.json());

// const db = getDatabase(app);
// const db = ref(getDatabase());
const db = getFirestore(app);

// import updateFriendsAction from "./store/userstore/actions.js";

// GET ALL USERS
export async function fetchUsers() {
	const friendsArr = [];
	const userCol = collection(db, "user-profiles");
	const userSnapshot = await getDocs(userCol);
	userSnapshot.forEach((doc) => {
		friendsArr.push(doc.data());
	});
	return friendsArr;
}

// GET ALL MESSAGES
export async function fetchMessages() {
	const messagesArr = [];
	const messagesCol = collection(db, "messages");
	const messagesSnapshot = await getDocs(messagesCol);
	messagesSnapshot.forEach((doc) => {
		messagesArr.push(doc.data());
	});
	return messagesArr.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
}
// app.get(`/messages`, (req, res) => {
// 	res.set("Access-Control-Allow-Origin", "*");
// 	let messages = [];
// 	db.collection("messages")
// 		.get()
// 		.then((snapshot) => {
// 			snapshot.forEach((doc) => {
// 				console.log(doc.id, "=>", doc.data());
// 				messages.push(doc.data());
// 			});
// 			res.send(messages.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1)));
// 		});
// });

export function fetchGroupsByUsers() {
	const getGroupsPromise = fetch("http://localhost:3000/group").then((res) =>
		res.json()
	);
	return getGroupsPromise;
}

export function getMe() {
	// console.log("getting Me");
}
