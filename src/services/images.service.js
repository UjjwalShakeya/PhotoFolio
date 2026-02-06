import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";


export const addImage = async (title, imageUrl) => {
    await addDoc(collection(db, 'images'), {
        title,
        url: imageUrl,
        created_At: serverTimestamp()
    });
}