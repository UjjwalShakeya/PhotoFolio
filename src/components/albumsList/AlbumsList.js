// importing required modules
import { useState, useEffect } from "react";
import styles from "./albumsList.module.css"
import { AlbumForm } from "../albumForm/AlbumForm.js"

// react toaster to give feedback
import { toast } from "react-toastify";

// importing service layer which makes the component easier to maintain,

import { createAlbum, subscribeToAlbums } from "../../services/albums.service.js";
import { ImagesList } from "../imagesList/ImagesList.js";


export const AlbumsList = () => {
  //These state are create just for your convience you can create modify or delete the state as per your requirement.

  // improved state names for easier read
  const [albums, setAlbums] = useState([]);

  // improved for better naming convension
  const [isFetchingAlbums, setIsFetchingAlbums] = useState(false);
  const [isCreatingAlbum, setIsCreatingAlbum] = useState(false);
  const [albumName, setAlbumName] = useState('');
  const [togglePage, setTogglePage] = useState(false);

  // side effects
  useEffect(() => {
    setIsFetchingAlbums(true);

    const unsubscribe = subscribeToAlbums(
      (snapshot) => {
        const albumsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAlbums(albumsData);
        setIsFetchingAlbums(false);
      },
      (error) => {
        console.error(error);
        setIsFetchingAlbums(false);
      }
    );

    return unsubscribe;
  }, [])


  // create function to handle adding of the album
  const addAlbum = async (name) => {
    try {
      await createAlbum(name);
      toast.success("Album added successfully");
    } catch (error) {
      toast.error("Could not create album");
      console.log(error);
    }
  }

  // handler to get name of album and hidding, showing albumlist or imagelist according to the condition
  const onBack = async () => {
    setTogglePage(prev => !prev)
  };

  const handleSelect = async (name) => {
    setAlbumName(name);
    onBack();
  };


  return (
    <>

      {/* album form will be visiible only when click of add album happens */}
      {isCreatingAlbum && <AlbumForm isFetchingAlbums={isFetchingAlbums} addAlbum={addAlbum} setIsCreatingAlbum={setIsCreatingAlbum} />}

      {/* outer wrapper  */}
      <div className="wrapper">

        {togglePage ? (<ImagesList albumName={albumName} onBack={onBack} />) : (
          <>

            {/* header of application*/}
            <div className={`${styles.top}`}>
              <h3>Your albums</h3>
              <button onClick={() => setIsCreatingAlbum(prev => !prev)} className={`${isCreatingAlbum ? styles.active : ""}`}>
                {isCreatingAlbum ? "Cancel" : 'Add Album'}
              </button>
            </div>

            {/* album list */}
            < div className={`${styles.albumsList}`}>

              {/* rendering albums here */}
              {albums.map((album) => (
                <div onClick={() => handleSelect(album.name)} key={album.id} className={`${styles.album}`}>
                  <img src="/assets/photos.png" alt="album" />
                  <span>{album.name}</span>
                </div>
              ))}
            </div>

          </>
        )}

      </div >

    </>
  )
};
