<template>
	<q-page class="q-pa-md">
		<div v-show="imageCaptured" class="canvas-frame q-pa-md">
			<canvas
				v-show="imageCaptured"
				ref="canvas"
				class="full-width"
				height="240"
			/>
		</div>
		<div class="text-center q-pa-md">
			<q-file
				v-if="!imageCaptured"
				accept="image/*"
				@input="captureImageFallback"
				outlined
				label="Choose an image"
			>
				<template v-slot:prepend>
					<q-icon name="far fa-image" />
				</template>
			</q-file>
			<div class="row justify-center q-ma-md">
				<q-input
					v-if="imageCaptured"
					class="col col-sm-6"
					v-model="post.caption"
					label="Caption *"
					dense
				/>
			</div>
			<div class="row justify-center q-ma-md"></div>
			<div class="row justify-center q-mt-lg">
				<q-btn
					@click="addPost"
					unelevated
					rounded
					color="primary"
					label="Post Image"
					:disable="!post.caption || !post.photo"
				/>
			</div>
		</div>
	</q-page>
</template>

<script>
import { uid } from "quasar";
import { addPhotoToStorage } from "../storageHelpers";
import { addImagePost } from "../helpers";

export default {
	name: "Upload Photo",
	data() {
		return {
			post: {
				id: uid(),
				caption: "",
				photo: null,
				date: Date.now(),
			},
			imageCaptured: false,
			imageUpload: [],
			me: "",
		};
	},
	computed: {},
	methods: {
		async addPost() {
			this.$q.loading.show({
				delay: 400, // ms
			});

			// create new form data object
			let formData = new FormData();
			formData.append("id", this.post.id);
			formData.append("caption", this.post.caption);
			formData.append("date", this.post.date);
			formData.append("file", this.post.photo, this.post.id + ".png");

			const formDataWithImage = await addPhotoToStorage(formData);
			const postObj = {
				user: this.me,
				id: formDataWithImage.get("id"),
				caption: formDataWithImage.get("caption"),
				date: formDataWithImage.get("date"),
				imageURL: formDataWithImage.get("imageURL"),
			};
			await addImagePost(postObj);
			this.$q.loading.hide();
			this.$q.notify({ message: "Post added!" });
			// QUESTION: Where to go after successful upload?
		},
		captureImageFallback(file) {
			this.post.photo = file.target.files[0];
			let canvas = this.$refs.canvas;
			let context = canvas.getContext("2d");
			var reader = new FileReader();
			// console.log("reader", reader);
			reader.onload = (event) => {
				var img = new Image();
				img.onload = () => {
					canvas.width = img.width;
					canvas.height = img.height;
					context.drawImage(img, 0, 0);
					this.imageCaptured = true;
				};
				img.src = event.target.result;
			};
			reader.readAsDataURL(file.target.files[0]);
		},
	},
	mounted() {
		// this.initCamera();
	},
	created() {
		this.me = this.$store.state.userstore.user.uid;
	},
	beforeUnmount() {},
};
</script>

<style lang="sass">
.canvas-frame
  border: 2px solid $grey-10
  border-radius: 10px
</style>
