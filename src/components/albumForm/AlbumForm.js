import styles from "./albumForm.module.css";
import { useRef } from "react";

export const AlbumForm = ({ isFetchingAlbums, addAlbum, setIsCreatingAlbum }) => {
  const albumNameInput = useRef();

  // function  to handle the clearing of the form
  const handleClear = () => {
    albumNameInput.current.value = "";
  };
  // function to handle the form submit
  const handleSubmit = async (e) => {
    e.preventDefault()

    const name = albumNameInput.current.value.trim();
    if (!name) return;

    try {
      await addAlbum(name);
      handleClear();
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className={styles.albumForm}>
      <span>Create an album</span>
      <form onSubmit={handleSubmit}>
        <input required placeholder="Album Name" ref={albumNameInput} />
        <button type="button" onClick={handleClear} disabled={isFetchingAlbums}>
          Clear
        </button>
        <button disabled={isFetchingAlbums}>Create</button>
      </form>
    </div>
  );
};
