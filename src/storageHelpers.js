import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function addPhotoToStorage(photoForm) {
	const storage = getStorage();
	const file = photoForm.get("file");
	const name = file.name;

	const imageRef = ref(storage, name);

	const blob = new Blob([file], { type: "image/png" });
	await uploadBytes(imageRef, blob);
	// get imageURL to reference this photo
	const imageURL = await getDownloadURL(imageRef);
	photoForm.append("imageURL", imageURL);
	return new Promise((resolve) => {
		resolve(photoForm);
	});
}
