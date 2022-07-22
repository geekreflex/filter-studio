import React, { useRef } from 'react';
import { Image } from 'react-konva';
import useImage from 'use-image';

const ImageElem = ({ imageProps, onSelect, onChange, imageUrl }) => {
  const [image] = useImage(imageUrl);
  const imageRef = useRef();

  return (
    <>
      <Image
        {...imageProps}
        ref={imageRef}
        onClick={() => onSelect(imageRef)}
        onTap={() => onSelect(imageRef)}
        image={image}
        draggable
        name="image"
        onDragEnd={(e) => {
          onChange({
            ...imageProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const node = imageRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          onChange({
            ...imageProps,
            rotation: node.rotation(),
            x: node.x(),
            y: node.y(),
            width: node.width() * scaleX,
            height: node.height() * scaleY,
          });
        }}
      />
    </>
  );
};

export default ImageElem;
