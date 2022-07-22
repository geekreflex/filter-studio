import React, { createRef, useEffect } from 'react';
import { Layer, Stage, Transformer } from 'react-konva';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  saveToStorage,
  setElements,
  setSelectedElem,
} from '../../redux/editorSlice';
import TextElem from '../elements/TextElem';
import { ReactReduxContext, Provider } from 'react-redux';
import ImageElem from '../elements/ImageElem';

const Canvas = () => {
  const layerEl = createRef();
  const dispatch = useDispatch();
  const { elements, selectedElem } = useSelector((state) => state.editor);

  useEffect(() => {
    const storageData = localStorage.getItem('editor-state')
      ? JSON.parse(localStorage.getItem('editor-state'))
      : [];
    dispatch(setElements(storageData));
  }, []);

  useEffect(() => {
    updateTextProps();
  }, [selectedElem]);

  const updateTextProps = () => {
    if (selectedElem?.id) {
      const id = selectedElem.id;
      const items = elements.slice();
      const item = items.find((item) => item.id === id);
      const index = items.indexOf(item);
      items.splice(index, 1);
      items.splice(index, 0, selectedElem);
      dispatch(setElements(items));
    }
  };

  const checkDeselct = (e) => {
    // deselect when client clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      dispatch(setSelectedElem(null));
    }
  };

  const oldPos = React.useRef(null);
  const onMouseDown = (e) => {
    const isElement = e.target.findAncestor('.elements-container');
    const isTransformer = e.target.findAncestor('Transaformer');
  };

  return (
    <CanvasWrap>
      <ReactReduxContext.Consumer>
        {({ store }) => (
          <Stage
            width={276}
            height={598}
            onMouseDown={checkDeselct}
            onTap={checkDeselct}
            onTouchStart={checkDeselct}
          >
            <Provider store={store}>
              <Layer ref={layerEl}>
                {elements &&
                  elements.map((element, i) => {
                    if (element.type === 'text') {
                      return (
                        <TextElem
                          key={element.id}
                          textProps={element}
                          isSelected={element.id === selectedElem?.id}
                          onSelect={() => {
                            dispatch(setSelectedElem(element));
                          }}
                          onChange={(newAttrs) => {
                            const elems = elements.slice();
                            elems[i] = newAttrs;
                            dispatch(setElements(elems));
                            dispatch(saveToStorage());
                            dispatch(setSelectedElem(newAttrs));
                          }}
                        />
                      );
                    }

                    if (element.type === 'image') {
                      return (
                        <ImageElem
                          key={i}
                          imageProps={element}
                          imageUrl={element.content}
                          isSelected={element.id === selectedElem?.id}
                          onSelect={() => {
                            dispatch(setSelectedElem(element));
                          }}
                          onChange={(newAttrs) => {
                            const elems = elements.slice();
                            elems[i] = newAttrs;
                            dispatch(setElements(elems));
                            dispatch(saveToStorage());
                            dispatch(setSelectedElem(newAttrs));
                          }}
                        />
                      );
                    }

                    return '';
                  })}
              </Layer>
            </Provider>
          </Stage>
        )}
      </ReactReduxContext.Consumer>
    </CanvasWrap>
  );
};

const CanvasWrap = styled.div`
  width: 276px;
  box-shadow: 0 0 2px #666;
  padding: 15px;
  border-radius: 22px;
  overflow: hidden;
  border: 1px solid #ddd;
  background-color: #fff;

  canvas {
    background-color: #e5e5e5 !important;
    border-radius: 10px;
  }
`;

export default Canvas;
