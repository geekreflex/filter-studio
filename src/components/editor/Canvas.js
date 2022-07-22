import React, { useEffect, useRef } from 'react';
import { Layer, Rect, Stage, Transformer } from 'react-konva';
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
  const layerRef = useRef();
  const trRef = useRef();
  const [nodesArray, setNodes] = React.useState([]);
  const dispatch = useDispatch();
  const Konva = window.Konva;
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
    console.log(clickedOnEmpty);
    if (clickedOnEmpty) {
      dispatch(setSelectedElem(null));
    }
  };

  const selectionRectRef = React.useRef();
  const selection = React.useRef({
    visible: false,
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  });

  const updateSelectionRect = () => {
    const node = selectionRectRef.current;
    node.setAttrs({
      visible: selection.current.visible,
      x: Math.min(selection.current.x1, selection.current.x2),
      y: Math.min(selection.current.y1, selection.current.y2),
      width: Math.abs(selection.current.x1 - selection.current.x2),
      height: Math.abs(selection.current.y1 - selection.current.y2),
    });
    node.getLayer().batchDraw();
  };

  const oldPos = React.useRef(null);
  const onMouseDown = (e) => {
    const isElement = e.target.findAncestor('.elements-container');
    const isTransformer = e.target.findAncestor('Transaformer');
    if (isElement || isTransformer) {
      return;
    }

    const pos = e.target.getStage().getPointerPosition();
    selection.current.visible = true;
    selection.current.x1 = pos.x;
    selection.current.y1 = pos.y;
    selection.current.x2 = pos.x;
    selection.current.y2 = pos.y;
    updateSelectionRect();
  };

  const onMouseUp = () => {
    oldPos.current = null;
    if (!selection.current.visible) {
      return;
    }
    const selBox = selectionRectRef.current.getClientRect();

    const elements = [];
    layerRef.current.find('.rectangle').forEach((elementNode) => {
      const elBox = elementNode.getClientRect();
      if (Konva.Util.haveIntersection(selBox, elBox)) {
        elements.push(elementNode);
      }
    });
    trRef.current.nodes(elements);
    selection.current.visible = false;
    // disable click event
    Konva.listenClickTap = false;
    updateSelectionRect();
  };

  const onMouseMove = (e) => {
    if (!selection.current.visible) {
      return;
    }
    const pos = e.target.getStage().getPointerPosition();
    selection.current.x2 = pos.x;
    selection.current.y2 = pos.y;
    updateSelectionRect();
  };

  const onClickTap = (e) => {
    let stage = e.target.getStage();
    let layer = layerRef.current;
    let tr = trRef.current;
    // if click on empty area - remove all selections
    if (e.target === stage) {
      dispatch(setSelectedElem(null));
      setNodes([]);
      tr.nodes([]);
      layer.draw();
      return;
    }

    // do nothing if clicked NOT on our rectangles
    if (!e.target.hasName('.image')) {
      return;
    }

    // do we pressed shift or ctrl?
    const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
    const isSelected = tr.nodes().indexOf(e.target) >= 0;

    if (!metaPressed && !isSelected) {
      // if no key pressed and the node is not selected
      // select just one
      tr.nodes([e.target]);
    } else if (metaPressed && isSelected) {
      // if we pressed keys and node was selected
      // we need to remove it from selection:
      const nodes = tr.nodes().slice(); // use slice to have new copy of array
      // remove node from array
      nodes.splice(nodes.indexOf(e.target), 1);
      tr.nodes(nodes);
    } else if (metaPressed && !isSelected) {
      // add the node into selection
      const nodes = tr.nodes().concat([e.target]);
      tr.nodes(nodes);
    }
    layer.draw();
  };

  return (
    <CanvasWrap>
      <ReactReduxContext.Consumer>
        {({ store }) => (
          <Stage
            width={276}
            height={598}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            // onTap={onMouseDown}
            onTouchStart={checkDeselct}
            onClick={onClickTap}
          >
            <Provider store={store}>
              <Layer ref={layerRef}>
                {elements &&
                  elements.map((element, i) => {
                    if (element.type === 'text') {
                      return (
                        <TextElem
                          key={element.id}
                          getKey={element.id}
                          textProps={element}
                          isSelected={element.id === selectedElem?.id}
                          getLength={elements.length}
                          onSelect={(e) => {
                            if (e.current !== undefined) {
                              let temp = nodesArray;
                              if (!nodesArray.includes(e.current))
                                temp.push(e.current);
                              setNodes(temp);
                              trRef.current.nodes(nodesArray);
                              trRef.current.nodes(nodesArray);
                              trRef.current.getLayer().batchDraw();
                            }
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
                <Transformer
                  ref={trRef}
                  boundBoxFunc={(oldBox, newBox) => {
                    // limit resize
                    if (newBox.width < 5 || newBox.height < 5) {
                      return oldBox;
                    }
                    return newBox;
                  }}
                />
                <Rect fill="rgba(0,0,255,0.5)" ref={selectionRectRef} />
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
