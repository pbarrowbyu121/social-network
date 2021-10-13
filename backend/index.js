const express = require("express");
const app = express();
const port = 3000;
const admin = require("firebase-admin");

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

app.get("/messages", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  let messages = [];
  db.collection("messages")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        console.log(doc.id, "=>", doc.data());
        messages.push(doc.data());
      });
      res.send(messages);
    });
});

app.post("/postMessage", (req, res) => {
  console.log("posting Message");
  res.set("Access-Control-Allow-Origin", "*");
  db.collection("messages")
    .doc()
    .set({
      uid: req.body.uid,
      message: req.body.message,
      createdAt: req.body.createdAt,
    })
    .then(() => {
      res.send("message posted");
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
