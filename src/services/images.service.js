import { addDoc, collection, serverTimestamp, onSnapshot, where, query, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

// getting real time data
export const subscribeToImages = (albumID, callBack, error) => {
  const q = query(
    collection(db, "images"),
    where("albumID", "==", albumID)
  );

  return onSnapshot(q, callBack, error);
};


// adding one doc per one request
export const addImage = async (albumID, title, imageUrl) => {
    await addDoc(collection(db, 'images'), {
        title,
        url: imageUrl,
        albumID: albumID,
        created_At: serverTimestamp()
    });
};

// deleting doc
export const deleteImage = async (id) => {
    await deleteDoc(doc(db, 'images', id));
}

// udpating doc
export const updateImage = async (id, data) => {
    // getting docRef from hotels
    const docRef = doc(db, 'images', id);
    await updateDoc(docRef, {
        ...data,
        updated_At: serverTimestamp(),
    });
}

// fucntion to search images
// export const searchImages = (albumID, title, callBack, error) => {
//   const q = query(
//     collection(db, "images"),
//     where("albumID", "==", albumID),
//     where("title", "==", title)
//   );

//   return onSnapshot(q, callBack, error);
// };
