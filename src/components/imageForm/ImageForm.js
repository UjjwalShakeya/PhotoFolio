import styles from "./imageForm.module.css";
import { useEffect, useRef } from "react";

export const ImageForm = ({ updateIntent, selectedAlbum, loading, onAdd, onUpdate, setUpdateImageIntent, setAddImageIntent }) => {

  //These state are create just for your convience you can create modify or delete the state as per your requirement.
  const imageTitleInput = useRef();
  const imageUrlInput = useRef();

  // function to handle image form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const title = imageTitleInput.current.value
    const imageUrl = imageUrlInput.current.value

    // if title not given or url not given return from here
    if (!title.trim() || !imageUrl.trim()) return;

    if (!updateIntent) {
      onAdd(title, imageUrl);
      setAddImageIntent(false)
    } else {
      onUpdate({ title, url: imageUrl });
      setUpdateImageIntent(null);
    }
    handleClear();
  };

  // function to thandle clearing the form
  const handleClear = () => {
    imageTitleInput.current.value = "";
    imageUrlInput.current.value = "";
  };

  // function to prefill the value of the form input 
  const handleDefaultValues = () => {
    imageTitleInput.current.value = updateIntent ? updateIntent.title : ""
    imageUrlInput.current.value = updateIntent ? updateIntent.url : ""
  };

  // when updateIntent would be true only then we will set default values
  useEffect(() => {
    handleDefaultValues();
  }, [updateIntent])

  return (
    <div className={styles.imageForm}>
      <span>
        {!updateIntent
          ? `Add image to ${selectedAlbum.name}`
          : `Update image ${updateIntent.title}`}
      </span>

      <form onSubmit={handleSubmit}>
        <input required placeholder="Title" ref={imageTitleInput} />
        {/* adding url for now so that it does not take any invalid url */}
        <input required placeholder="Image URL" ref={imageUrlInput} type="url" />
        <div className={styles.actions}>
          <button type="button" onClick={handleClear} disabled={loading}>
            Clear
          </button>
          <button disabled={loading}>{updateIntent ? "Update" : "Add"}</button>
        </div>
      </form>
    </div>
  );
};
