// const express = require("express");
// const app = express();
// const port = 3000;
// const admin = require("firebase-admin");
// let UUID = require("uuid-v4");

// firestore stuff
// const serviceAccount = require("./serviceAccountKey.json");

import { getDatabase, ref, onValue, child, get } from "firebase/database";

import {
	getFirestore,
	collection,
	addDoc,
	getDocs,
	query,
	where,
} from "firebase/firestore/lite";
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
export async function fetchMessages(groupId) {
	const messagesArr = [];
	const messagesCol = query(
		collection(db, "messages"),
		where("groupId", "==", groupId)
	);
	// const messagesCol = collection(db, "messages");
	const messagesSnapshot = await getDocs(messagesCol);
	messagesSnapshot.forEach((doc) => {
		messagesArr.push(doc.data());
	});
	return messagesArr.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
}

export function fetchGroupsByUsers() {
	const getGroupsPromise = fetch("http://localhost:3000/group").then((res) =>
		res.json()
	);
	return getGroupsPromise;
}

// FIND GROUP CHAT ID FOR A GIVEN ARRAY OF USER IDS
export async function filterGroup(userArray) {
	const groups = [];
	const groupRef = query(
		collection(db, "groups"),
		where("count", "==", userArray.length)
	);
	const groupSnapshot = await getDocs(groupRef);
	// QUESTION: How can I filter snapshot down to docs where "count" field is less than length of userArray
	groupSnapshot.forEach((doc) => {
		const members = doc.data().members;
		let pushToggle = true;
		userArray.forEach((id) => {
			if (!members[id]) {
				pushToggle = false;
			}
		});
		if (pushToggle) {
			groups.push(doc.id);
		}
	});
	return groups[0];
}

// CREATE NEW CHAT GROUP
export async function createGroup(userArray) {
	let members = {};
	userArray.forEach((memberId) => {
		members[memberId] = true;
	});
	const docRef = await addDoc(collection(db, "groups"), {
		count: userArray.length,
		members,
	});
	return new Promise((resolve) => resolve(docRef.id));
}

export function getMe() {
	// console.log("getting Me");
}
