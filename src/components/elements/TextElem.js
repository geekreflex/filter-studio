import React, { useEffect, useRef, useState } from 'react';
import { Text, Transformer } from 'react-konva';
import { useDispatch } from 'react-redux';
import { saveToStorage, setTextValue } from '../../redux/editorSlice';
import { addTextNode } from './textNode';

const TextElem = ({ textProps, isSelected, onSelect, onChange }) => {
  const trRef = useRef();
  const textRef = useRef();
  const dispatch = useDispatch();
  const [updatedText, setUpdatedText] = useState('');

  // useEffect(() => {
  //   dispatch(saveToStorage());
  //   if (isSelected) {
  //     trRef.current.setNode(textRef.current);
  //     trRef.current.getLayer().batchDraw();
  //   }
  // }, [isSelected]);

  useEffect(() => {
    if (updatedText) {
      dispatch(saveToStorage());
      dispatch(setTextValue(updatedText));
    }
  }, [updatedText]);

  const handleEditText = () => {
    const textNode = textRef.current;
    const tr = trRef.current;
    const stage = textRef.current.getStage();
    const layer = textRef.current.getLayer();
    addTextNode(stage, layer, textNode, tr, setUpdatedText);
  };

  return (
    <>
      <Text
        ref={textRef}
        onClick={() => onSelect(textRef)}
        onTap={() => onSelect(textRef)}
        {...textProps}
        align="center"
        wrap="wrap"
        draggable
        onDblClick={handleEditText}
        onDblTap={handleEditText}
        onDragEnd={(e) => {
          onChange({
            ...textProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransform={(e) => {
          const node = textRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // we will reset it back
          node.scaleX(1);
          node.scaleY(1);
          node.setAttrs({
            width: Math.max(node.width() * scaleX, 100),
            height: Math.max(node.height() * scaleY),
            scaleX: 1,
            // scaleY: 1,
          });
        }}
        onTransformEnd={(e) => {
          const node = textRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...textProps,
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            width: node.width() * scaleX,
            height: node.height() * scaleY,
            fontSize: node.fontSize() * scaleX,
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 100) {
              return oldBox;
            }
            return newBox;
          }}
          anchorFill="#444"
          anchorStroke="#444"
          anchorSize={18}
          borderDash={[3, 3]}
          borderStroke="grey"
          anchorCornerRadius={50}
          padding={5}
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

export default TextElem;
