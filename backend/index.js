const express = require("express");
var cors = require("cors");
const app = express();
const port = 3000;
const admin = require("firebase-admin");
// let UUID = require("uuid-v4");

// firestore stuff
const serviceAccount = require("./serviceAccountKey.json");

app.use(express.json());

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
});

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// get messages
// app.get(`/messages`, (req, res) => {
// 	res.set("Access-Control-Allow-Origin", "*");
// 	let messages = [];
// 	db.collection("messages")
// 		.get()
// 		.then((snapshot) => {
// 			snapshot.forEach((doc) => {
// 				messages.push(doc.data());
// 			});
// 			res.send(messages.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1)));
// 		});
// });

// post messages
app.post("/postMessage", (req, res) => {
	res.set("Access-Control-Allow-Origin", "*");
	db.collection("messages")
		.doc()
		.set({
			groupId: req.body.groupId,
			createdBy: req.body.createdBy,
			message: req.body.message,
			createdAt: req.body.createdAt,
			avatar: req.body.avatar,
		})
		.then(() => {
			res.send("message posted");
		});
});

// get users
// app.get("/user-profiles", (req, res) => {
// 	res.set("Access-Control-Allow-Origin", "*");
// 	let users = [];
// 	db.collection("user-profiles")
// 		.get()
// 		.then((snapshot) => {
// 			snapshot.forEach((doc) => {
// 				users.push(doc.data());
// 			});
// 			res.send(users);
// 		});
// });

// create user
app.post("/user-profiles", (req, res) => {
	res.set("Access-Control-Allow-Origin", "*");
	db.collection("user-profiles")
		.doc()
		.set({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			username: req.body.username,
			email: req.body.email,
			bio: req.body.bio,
			avatar: req.body.avatar,
			createdBy: req.body.createdBy,
		})
		.then(() => {
			res.send("user added");
		});
});

// check for group with given user array
// app.get("/group/id?=wx9tAKmW5VR7k5G0GYi4", (req, res) => {});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
