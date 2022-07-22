import React, { useRef } from 'react';
import { Image } from 'react-konva';
import useImage from 'use-image';

const ImageElem = ({
  imageProps,
  onSelect,
  onChange,
  imageUrl,
  onDragStart,
}) => {
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
        name="element"
        onDragStart={onDragStart}
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
          node.scaleX(1);
          node.scaleY(1);
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
