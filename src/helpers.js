// const express = require("express");
// const app = express();
// const port = 3000;
// const admin = require("firebase-admin");
// let UUID = require("uuid-v4");

// firestore stuff
// const serviceAccount = require("./serviceAccountKey.json");

import { getDatabase, ref, onValue, child, get } from "firebase/database";
import { DateTime, Interval } from "luxon";

import {
	doc,
	updateDoc,
	getFirestore,
	collection,
	addDoc,
	getDocs,
	getDoc,
	query,
	where,
	onSnapshot,
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

// GET SPECIFIC USER BY ID
export async function fetchUser(id) {
	const users = [];
	const userRef = query(
		collection(db, "user-profiles"),
		where("createdBy", "==", id)
	);
	const userSnapshot = await getDocs(userRef);
	userSnapshot.forEach((doc) => {
		users.push(doc.data());
	});
	return users[0];
}

// GET ALL MESSAGES FOR A GROUP
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

// QUESTION: IS THIS NEEDED STILL?
export function fetchGroupsByUsers() {
	const getGroupsPromise = fetch("http://localhost:3000/group").then((res) =>
		res.json()
	);
	return getGroupsPromise;
}

// GETS ALL GROUPS FOR A GIVEN USER
export async function getUsersGroups(userId) {
	const groups = [];
	const groupRef = query(
		collection(db, "groups"),
		where("members." + userId, "==", true)
	);
	const groupSnapshot = await getDocs(groupRef);

	groupSnapshot.forEach((doc) => {
		groups.push({ groupId: doc.id, ...doc.data() });
	});
	groups.sort((a, b) => (a.mostRecentMessage > b.mostRecentMessage ? -1 : 1));
	return groups;
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

// UPLOAD RANKINGS TO DB
export async function uploadRankings(rankingsObj) {
	const docRef = await addDoc(collection(db, "friend-rankings"), rankingsObj);
}

// GET RANKINGS
export async function getRankings() {
	const rankingsArr = [];
	const rankingsCol = collection(db, "friend-rankings");
	const snapshot = await getDocs(rankingsCol);
	snapshot.forEach((doc) => {
		rankingsArr.push(doc.data());
	});
	return rankingsArr;
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

// UPDATE MOST RECENT MESSAGE FOR GROUP
// QUESTION: Can this be changed to a generic updating function?
export async function updateMostRecentMessage(groupID, timestamp) {
	const groupRef = doc(db, "groups", groupID);

	// Set the "capital" field of the city 'DC'
	await updateDoc(groupRef, {
		mostRecentMessage: timestamp,
	});
}

// GET USER PROFILE DOC ID
export async function getUser(userId) {
	const q = query(
		collection(db, "user-profiles"),
		where("createdBy", "==", userId)
	);
	const docIDs = [];
	const querySnapshot = await getDocs(q);
	querySnapshot.forEach((doc) => {
		docIDs.push(doc.id);
	});
	return docIDs;
}

// UPDATE A USER PROFILE
export async function updateUser(userId, updatedObj) {
	// get the doc ID for the user-profile
	const docIDs = await getUser(userId);

	const userRef = doc(db, "user-profiles", docIDs[0]);

	await updateDoc(userRef, {
		bio: updatedObj.bio,
		from: updatedObj.from,
	});

	const updatedUserRef = await getDoc(userRef);
	return updatedUserRef.data();
}

// FORMAT DATE RELATIVE TO TODAY
export function displayMessageDate(input) {
	const inputDate = DateTime.fromISO(input);
	const currentTime = DateTime.fromISO(DateTime.now().toString());
	const interval = Interval.fromDateTimes(inputDate, currentTime).length(
		"days"
	);
	const relativeDate = currentTime
		.minus({ days: interval })
		.toRelativeCalendar();
	// if today: time
	if (relativeDate === "today") {
		return inputDate.toLocaleString(DateTime.TIME_SIMPLE);
		// if yesterday: "yesterday"
	} else if (relativeDate === "yesterday") {
		return "Yesterday";
		// if less than 7 days ago: weekday name
	} else if (interval < 7) {
		return inputDate.weekdayLong;
		// if greater than 7 days ago: date
	} else {
		return inputDate.toLocaleString();
	}
}

export function getMe() {
	// console.log("getting Me");
}

// compute totals and counts for rankings
export function averageRankings(rankingsArr) {
	const data = rankingsArr.map((ranking) => ranking.rankings);
	const totals = data.reduce(
		(prev, curr) => (
			Object.entries(curr).forEach(
				([friendId, value]) => (prev[friendId] = (prev[friendId] || 0) + value)
			),
			prev
		),
		{}
	);
	const counts = data.reduce(
		(prev, curr) => (
			Object.entries(curr).forEach(
				([friendId, value]) => (prev[friendId] = (prev[friendId] || 0) + 1)
			),
			prev
		),
		{}
	);
	return { totals, counts };
}
