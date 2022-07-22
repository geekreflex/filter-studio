import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  addText,
  moveToBottom,
  moveToTop,
  removeAll,
  removeElem,
  saveToStorage,
  setFontSize,
  setTextColor,
} from '../../redux/editorSlice';
import AddImage from './AddImage';

const Controls = ({ loading, setLoading }) => {
  const dispatch = useDispatch();
  const { selectedElem } = useSelector((state) => state.editor);

  const handleAddText = () => {
    dispatch(addText());
    dispatch(saveToStorage());
  };

  const handleTextColor = (color) => {
    dispatch(setTextColor(color));
    dispatch(saveToStorage());
  };

  const handleFontSize = (size) => {
    dispatch(setFontSize(size));
    dispatch(saveToStorage());
  };

  const handleMove = (type) => {
    if (type === 'top') {
      dispatch(moveToTop());
    }

    if (type === 'bottom') {
      dispatch(moveToBottom());
    }
    dispatch(saveToStorage());
  };

  const handleRemove = () => {
    dispatch(removeElem());
    dispatch(saveToStorage());
  };

  const handleRemoveAll = () => {
    dispatch(removeAll());
    dispatch(saveToStorage());
  };

  return (
    <ControlsWrap>
      <button onClick={handleAddText}>Add Text</button>
      <AddImage setLoading={setLoading} loading={loading} />

      {selectedElem && (
        <ElementControls>
          <div>
            <input
              type="color"
              value={selectedElem?.fill || 'rgb(0,0,0)'}
              onChange={(e) => handleTextColor(e.target.value)}
            />
          </div>
          <div>
            <input
              type="number"
              value={selectedElem?.fontSize || 20}
              onChange={(e) => handleFontSize(e.target.value)}
            />
          </div>
          <div>
            <button onClick={() => handleMove('top')}>Move to top</button>
            <button onClick={() => handleMove('bottom')}>Move to bottom</button>
          </div>
          <div>
            <button onClick={handleRemove}>Remove</button>
            <button onClick={handleRemoveAll}>RemoveAll</button>
          </div>
        </ElementControls>
      )}
    </ControlsWrap>
  );
};

const ControlsWrap = styled.div``;
const ElementControls = styled.div``;

export default Controls;
