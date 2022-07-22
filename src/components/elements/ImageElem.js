import React, { useEffect, useRef } from 'react';
import { Image, Transformer } from 'react-konva';
import useImage from 'use-image';

const ImageElem = ({
  imageProps,
  isSelected,
  onSelect,
  onChange,
  imageUrl,
}) => {
  const [image] = useImage(imageUrl);
  const imageRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected) {
      trRef.current.setNode(imageRef.current);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Image
        {...imageProps}
        ref={imageRef}
        onClick={onSelect}
        onTap={onSelect}
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
      {isSelected && (
        <Transformer
          ref={trRef}
          anchorFill="#444"
          anchorStroke="#444"
          anchorSize={18}
          borderDash={[3, 3]}
          borderStroke="grey"
          anchorCornerRadius={50}
          enabledAnchors={[
            'top-left',
            'top-right',
            'bottom-left',
            'bottom-right',
          ]}
        />
      )}
    </>
  );
};

export default ImageElem;
