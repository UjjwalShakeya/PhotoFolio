import styles from "./imageList.module.css";
import { useState, useRef, useEffect } from "react";
import Spinner from "react-spinner-material";
import { ImageForm } from "../imageForm/ImageForm";
import { Carousel } from "../carousel/Carousel";

// importing toaster 
import { toast } from "react-toastify";

// importing firebase services
import { addImage, subscribeToImages, deleteImage, updateImage } from "../../services/images.service";

export const ImagesList = ({ selectedAlbum, onBack }) => {

  //These state and functions are create just for your convience you can create modify or delete the state as per your requirement.
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchIntent, setSearchIntent] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");


  // async function
  useEffect(() => {
    if (!selectedAlbum?.id) return;
    setLoading(true);
    const unsubscribe = subscribeToImages(selectedAlbum.id, (snapshot) => {
      const imageData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setImages(imageData);
      setLoading(false);
    }, (error) => {
      console.log(error);
      setLoading(false);
    })
    return () => {
      unsubscribe && unsubscribe();
    };
  }, [selectedAlbum?.id]);

  const [addImageIntent, setAddImageIntent] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [updateImageIntent, setUpdateImageIntent] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const [activeHoverImageIndex, setActiveHoverImageIndex] = useState(null);

  // function to handle toggle next image
  const handleNext = () => {
    setActiveImageIndex((prev) =>
      Math.min(prev + 1, images.length - 1)
    )
  };

  // function to handle toggle previous image
  const handlePrev = () => {
    setActiveImageIndex((prev) =>
      Math.max(prev - 1, 0))
  };

  // function to handle cancel  
  const handleCancel = () => {
    setActiveImageIndex(null);
  };

  // function to handle search functionality for image
  const handleSearchClick = () => {
    setSearchIntent((prev) => !prev)
  };

  // async functions
  const handleAdd = async (title, imageUrl) => {
    setImgLoading(true);
    try {
      await addImage(selectedAlbum.id, title, imageUrl);
      toast.success("image added successfully");
      setImgLoading(false);
    } catch (error) {
      setImgLoading(false);
      toast.error("Could not create image");
      console.log(error);
    }
  };

  // function to handle update image
  const handleUpdate = async ({ title, url }) => {
    setImgLoading(true);
    try {
      await updateImage(updateImageIntent.id, { title, url })
      toast.success("image updated successfully");
      setImgLoading(false);
    } catch (error) {
      toast.error("Could not update image");
      console.log(error);
      setImgLoading(false);
    }
  };

  useEffect(() => {
    if (!searchTerm) {
      setFilteredImages(images);
    } else {
      const lowerSearch = searchTerm.toLowerCase();
      const result = images.filter((img) =>
        img.title.toLowerCase().includes(lowerSearch)
      );
      setFilteredImages(result);
    }
  }, [images, searchTerm]);


  // function to handle delete image
  const handleDelete = async (e, id) => {
    e.stopPropagation();

    try {
      // ui can also be added instead of this screen blocking confirm dial box
      const shouldDelete = window.confirm('are you confirm that you want to delete this image ?')
      if (!shouldDelete) return;
      await deleteImage(id);
      toast.success("image deleted successfully");
    } catch (error) {
      toast.error("Could not delete image");
      console.log(error);
    }

  };

  if (!images.length && !searchTerm && !loading) {
    return (
      <>
        <div className={styles.top}>
          <span onClick={onBack}>
            <img src="/assets/back.png" alt="back" />
          </span>
          <h3>No images found in the {selectedAlbum.name}</h3>
          <button
            className={`${addImageIntent && styles.active}`}
            onClick={() => setAddImageIntent(prev => !prev)}
          >
            {!addImageIntent ? "Add image" : "Cancel"}
          </button>
        </div>
        {addImageIntent && (
          <ImageForm
            loading={imgLoading}
            onAdd={handleAdd}
            selectedAlbum={selectedAlbum}
            setAddImageIntent={setAddImageIntent}
          />
        )}
      </>
    );
  }
  return (
    <>
      {(addImageIntent || updateImageIntent) && (
        <ImageForm
          loading={imgLoading}
          onAdd={handleAdd}
          selectedAlbum={selectedAlbum}
          onUpdate={handleUpdate}
          updateIntent={updateImageIntent}
          setUpdateImageIntent={setUpdateImageIntent}
          setAddImageIntent={setAddImageIntent}

        />
      )}
      {(activeImageIndex || activeImageIndex === 0) && (
        <Carousel
          title={images[activeImageIndex].title}
          url={images[activeImageIndex].url}
          onNext={handleNext}
          onPrev={handlePrev}
          onCancel={handleCancel}
        />
      )}
      <div className={styles.top}>
        <span onClick={onBack}>
          <img src="/assets/back.png" alt="back" />
        </span>
        <h3>Images in {selectedAlbum.name}</h3>

        {/* search box */}
        <div className={styles.search}>
          {searchIntent && (
            <input
              placeholder="Search..."
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus={true}
            />
          )}
          <img
            onClick={handleSearchClick}
            src={!searchIntent ? "/assets/search.png" : "/assets/clear.png"}
            alt="clear"
          />
        </div>


        {/* update image */}
        {updateImageIntent && (
          <button
            className={styles.active}
            onClick={() => setUpdateImageIntent(false)}
          >
            Cancel
          </button>
        )}


        {!updateImageIntent && (
          <button
            className={`${addImageIntent && styles.active}`}
            onClick={() => setAddImageIntent(prev => !prev)}
          >
            {!addImageIntent ? "Add image" : "Cancel"}
          </button>
        )}

      </div>
      {loading && (
        <div className={styles.loader}>
          <Spinner color="#0077ff" />
        </div>
      )}
      {!loading && (
        /* rendering images here */
        <div className={styles.imageList}>
          {filteredImages.map((image, i) => (
            <div
              key={image.id}
              className={styles.image}
              onMouseOver={() => setActiveHoverImageIndex(i)}
              onMouseOut={() => setActiveHoverImageIndex(null)}
              onClick={() => setActiveImageIndex(i)}
            >
              <div
                className={`${styles.update} ${activeHoverImageIndex === i && styles.active
                  }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setUpdateImageIntent(image);
                }}
              >
                <img src="/assets/edit.png" alt="update" />
              </div>

              <div
                className={`${styles.delete} ${activeHoverImageIndex === i && styles.active
                  }`}
                onClick={(e) => handleDelete(e, image.id)}
              >
                <img src="/assets/trash-bin.png" alt="delete" />
              </div>
              <img
                src={image.url}
                alt={image.title}
                onError={({ currentTarget }) => {
                  currentTarget.src = "/assets/warning.png";
                }}
              />
              <span>{image.title.substring(0, 20)}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
