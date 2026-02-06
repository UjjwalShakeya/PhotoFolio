// importing required modules

import { collection, addDoc, onSnapshot } from "firebase/firestore"
import { db } from "../firebase.js";

export const subscribeToAlbums = (callback, error) => {
    return onSnapshot(collection(db, "albums"), callback, error);
}

export const createAlbum = async (name) => {
    await addDoc(collection(db, 'albums'), {
        name: name,
        created_At: new Date(),
    })
}