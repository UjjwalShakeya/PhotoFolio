import styles from "./imageForm.module.css";
import { useEffect, useRef } from "react";

export const ImageForm = ({ updateIntent, albumName, loading, onAdd }) => {
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

    onAdd(title, imageUrl);
    handleClear();
  };
  // function to thandle clearing the form
  const handleClear = () => {
    imageTitleInput.current.value = "";
    imageUrlInput.current.value = "";
  };

  // function to prefill the value of the form input 
  const handleDefaultValues = () => {

  };

  return (
    <div className={styles.imageForm}>
      <span>
        {!updateIntent
          ? `Add image to ${albumName}`
          : `Update image ${updateIntent.title}`}
      </span>

      <form onSubmit={handleSubmit}>
        <input required placeholder="Title" ref={imageTitleInput} />
        {/* adding url for now so that it does not take any invalid url */}
        <input required placeholder="Image URL" ref={imageUrlInput} type="url"/>
        <div className={styles.actions}>
          <button type="button" onClick={handleClear} disabled={loading}>
            Clear
          </button>
          <button disabled={loading}>Add</button>
        </div>
      </form>
    </div>
  );
};
