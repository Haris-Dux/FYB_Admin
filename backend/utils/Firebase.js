

// firebaseFunctions.js
import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL, uploadBytesResumable, deleteObject } from "firebase/storage";
import firebaseConfig from "../config/FirebaseConfig.js";

initializeApp(firebaseConfig);

const storage = getStorage();

export const uploadImageToFirebase = async (file,folder) => {
    try {
        if(!file) throw new Error("File not Recieved");
        const storageRef = ref(storage, `${folder}/${file.originalname}`);
        const metadata = {
            contentType: file.mimetype,
        };
        const snapshot = await uploadBytesResumable(storageRef, file.buffer, metadata);
        const downloadURL = await getDownloadURL(snapshot.ref);
        const result = {
            name: file.originalname,
            type: file.mimetype,
            downloadURL: downloadURL
        };
        return result;
    } catch (error) {
        throw error;
    }
};

export const deleteImageFromFirebase = async (downloadURL) => {
    try {
        const imageRef = ref(storage, downloadURL);
        await deleteObject(imageRef);
      } catch (error) {
        throw error;
      }
  };
