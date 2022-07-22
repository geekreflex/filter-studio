import React, { createRef } from 'react';
import { v1 as uuidv1 } from 'uuid';
import { addImage, saveToStorage } from '../../redux/editorSlice';
import { useDispatch } from 'react-redux';

const AddImage = ({ loading, setLoading }) => {
  const fileEl = createRef();
  const dispatch = useDispatch();

  const randomImgUrl = 'https://source.unsplash.com/random';

  const handleAddImage = () => {
    fileEl.current.click();
  };

  const handleImageUpload = (e) => {
    setLoading(true);
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        const id = uuidv1();

        let image = new Image();
        image.src = reader.result;
        image.onload = function () {
          setLoading(false);
          let height = this.height;
          let width = this.width;
          let maxWidth = 200;
          let maxHeight = 150;
          let aspectW = width / maxWidth;
          let aspectH = height / maxHeight;

          if (aspectW > 1 || aspectH > 1) {
            if (aspectW > aspectH) {
              const data = {
                type: 'image',
                content: reader.result,
                id,
                width: maxWidth,
                height: height / aspectW,
              };
              dispatch(addImage(data));
            } else {
              const data = {
                type: 'image',
                content: reader.result,
                id,
                width: width / aspectH,
                height: maxHeight,
              };
              dispatch(addImage(data));
            }
          }
        };
      },
      false
    );
    if (file) {
      reader.readAsDataURL(file);
    }
    dispatch(saveToStorage());
  };

  const handleRandomImg = async () => {
    setLoading(true);
    try {
      let response = await fetch(randomImgUrl);
      let blob = await response.blob();
      let reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = function (e) {
        const id = uuidv1();

        let image = new Image();
        image.src = randomImgUrl;
        image.onload = function () {
          setLoading(false);
          let height = this.height;
          let width = this.width;
          let maxWidth = 200;
          let maxHeight = 150;
          let aspectW = width / maxWidth;
          let aspectH = height / maxHeight;

          if (aspectW > 1 || aspectH > 1) {
            if (aspectW > aspectH) {
              const data = {
                type: 'image',
                content: e.target.result,
                id,
                width: maxWidth,
                height: height / aspectW,
              };
              dispatch(addImage(data));
            } else {
              const data = {
                type: 'image',
                content: e.target.result,
                id,
                width: width / aspectH,
                height: maxHeight,
              };
              dispatch(addImage(data));
            }
          }
        };
      };
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div>
      {loading && 'Uploading...'}
      <button onClick={handleAddImage}>Add Image</button>
      <button onClick={handleRandomImg}>Random Image</button>
      <input
        style={{ display: 'none' }}
        type="file"
        ref={fileEl}
        onChange={handleImageUpload}
      />
    </div>
  );
};

export default AddImage;
