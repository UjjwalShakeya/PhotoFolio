import { addDoc, collection, serverTimestamp, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";



export const subscribeToImages = async (callBack, error) => {
    return onSnapshot(collection(db, 'images'), callBack, error);
}

export const addImage = async (title, imageUrl) => {
    await addDoc(collection(db, 'images'), {
        title,
        url: imageUrl,
        created_At: serverTimestamp()
    });
}
