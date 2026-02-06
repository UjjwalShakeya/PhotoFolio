import { addDoc, collection, serverTimestamp, onSnapshot, where, query } from "firebase/firestore";
import { db } from "../firebase";



export const subscribeToImages = async (albumName, callBack, error) => {
    const q = query(collection(db, 'images'), where("albumName", "==", albumName))
    return onSnapshot(q, callBack, error);
}

export const addImage = async (albumName, title, imageUrl) => {
    await addDoc(collection(db, 'images'), {
        title,
        url: imageUrl,
        albumName,
        created_At: serverTimestamp()
    });
}
