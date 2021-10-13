<template>
  <q-chat-message
    v-for="item in messages"
    :key="item.message"
    name="me"
    :text="[item.message]"
    sent
    stamp="7 minutes ago"
  />
  <q-chat-message
    v-for="item in messages"
    :key="item.message"
    name="me"
    :text="[item.message]"
    stamp="7 minutes ago"
  />
  <q-input rounded outlined v-model="newMessage" placeholder="Send" dense>
    <template v-slot:append>
      <q-btn round dense flat icon="send" @click="sendMessage" />
    </template>
  </q-input>
</template>

<script>
export default {
  name: "Chat",
  data() {
    return {
      messages: [],
      newMessage: "",
    };
  },
  methods: {
    getMessages() {
      // console.log("getMessages");
      fetch("http://localhost:3000/messages")
        .then((res) => {
          return res.json();
        })
        .then((res) => (this.messages = res))
        .then((res) => console.log("res", res))
        .catch((err) => console.log(err));
    },
    postMessage(messageObj) {
      const sendMessagePromise = fetch("http://localhost:3000/postMessage", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(messageObj),
      });
      console.log("promise", sendMessagePromise);
      return sendMessagePromise;
    },
    sendMessage() {
      console.log("sendMessage", this.newMessage);
      const newMessageObj = {
        uid: "peter1",
        message: this.newMessage,
        createdAt: new Date(),
      };
      this.postMessage(newMessageObj).then((res) => this.getMessages());
    },
  },
  created() {
    this.getMessages();
  },
};
</script>
