import React, { useEffect, useRef, useState } from 'react';
import { Text } from 'react-konva';
import { useDispatch } from 'react-redux';
import { saveToStorage, setTextValue } from '../../redux/editorSlice';
import { addTextNode } from './textNode';

const TextElem = ({ textProps, onSelect, onChange, tr, onDragStart }) => {
  const textRef = useRef();
  const dispatch = useDispatch();
  const [updatedText, setUpdatedText] = useState('');

  useEffect(() => {
    if (updatedText) {
      dispatch(saveToStorage());
      dispatch(setTextValue(updatedText));
    }
  }, [updatedText]);

  const handleEditText = () => {
    const textNode = textRef.current;
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
        verticalAlign="middle"
        wrap="wrap"
        name="element"
        draggable
        dragDistance={50}
        onDblClick={handleEditText}
        onDblTap={handleEditText}
        onDragStart={onDragStart}
        onDragMove={() => onSelect(textRef)}
        onDragEnd={(e) => {
          onChange({
            ...textProps,
            x: e.target.x(),
            y: e.target.y(),
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
    </>
  );
};

export default TextElem;
