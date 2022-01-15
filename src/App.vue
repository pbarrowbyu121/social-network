<template>
	<router-view />
</template>
<script>
import { defineComponent } from "vue";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

export default defineComponent({
	name: "App",
	methods: {},
});
</script>
