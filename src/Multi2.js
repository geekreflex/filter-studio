import React from 'react';
import { render } from 'react-dom';
import { Stage, Layer, Rect, Group, Transformer, Konva } from 'react-konva';
const Rectangle = ({ shapeProps, getKey, isSelected, onSelect, onChange }) => {
  const shapeRef = React.useRef();
  // const trRef = React.useRef();

  // React.useEffect(() => {
  //   if (isSelected) {
  //     // if (shapeRef.current.length !== arrLength) {
  //     //   // add or remove refs
  //     //   shapeRef.current = Array(arrLength)
  //     //     .fill()
  //     //     .map((_, i) => shapeRef.current[i] || React.createRef());
  //     // }
  //     // console.log(shapeRef.current);
  //     // console.log(trRef.current);
  //     // console.log(isSelected);
  //     // we need to attach transformer manually
  //     // trRef.current.nodes([shapeRef.current]);
  //     // trRef.current.getLayer().batchDraw();
  //   }
  // }, []);

  return (
    <Group
    // onDblClick = {onSelect(shapeRef)}
    >
      <Rect
        onClick={() => onSelect(shapeRef)}
        onTap={() => onSelect(shapeRef)}
        // ref={shapeRef.current[getKey]}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          // transformer is changing scale of the node
          // and NOT its width or height
          // but in the store we have only width and height
          // to match the data better we will reset scale on transform end
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // we will reset it back
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            // set minimal value
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          });
        }}
      />
      {/* {isSelected && ( */}
      {/* <Transformer
          // ref={trRef.current[getKey]}
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        /> */}
      {/* )} */}
    </Group>
  );
};

const initialRectangles = [
  {
    x: 10,
    y: 10,
    width: 100,
    height: 100,
    fill: 'red',
    id: 'rect1',
  },
  {
    x: 150,
    y: 150,
    width: 100,
    height: 100,
    fill: 'green',
    id: 'rect2',
  },
];

const Multi2 = () => {
  const [rectangles, setRectangles] = React.useState(initialRectangles);
  const [selectedId, selectShape] = React.useState(null);
  const [nodesArray, setNodes] = React.useState([]);
  const [x1, setx1] = React.useState('');
  const [x2, setx2] = React.useState('');
  const [y1, sety1] = React.useState('');
  const [y2, sety2] = React.useState('');
  const trRef = React.useRef();
  const layerRef = React.useRef();
  const Konva = window.Konva;
  const temp = new Konva.Rect({
    fill: 'rgba(0,0,255,0.5)',
  });
  const [selectionRectangle, setSelectionRectangle] = React.useState(temp);

  React.useEffect(() => {
    setSelectionRectangle(selectionRectangle);
    layerRef.current.add(selectionRectangle);
    selectionRectangle.visible(false);
  }, [selectionRectangle]);

  const checkDeselect = (e) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
      trRef.current.nodes([]);
      setNodes([]);
      layerRef.current.remove(selectionRectangle);
    }
  };

  const onMouseDown = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
      trRef.current.nodes([]);
      setNodes([]);
    } else return;

    let stage = e.target.getStage();

    setx1(stage.getPointerPosition().x);
    sety1(stage.getPointerPosition().y);
    setx2(stage.getPointerPosition().x);
    sety2(stage.getPointerPosition().y);
    const layer = layerRef.current;
    // layer.add(selectionRectangle);

    selectionRectangle.visible(true);
    selectionRectangle.width(0);
    selectionRectangle.height(0);
    layer.draw();
  };

  const onMouseUp = (e) => {
    // no nothing if we didn't start selection
    if (!selectionRectangle.visible()) {
      return;
    }
    let stage = e.target.getStage();
    let layer = layerRef.current;
    // update visibility in timeout, so we can check it in click event
    setTimeout(() => {
      selectionRectangle.visible(false);
      layer.batchDraw();
    });

    var shapes = stage.find('Rect').toArray();
    var box = selectionRectangle.getClientRect();
    console.log('box', box);
    const Konva = window.Konva;

    var selected = shapes.filter((shape) =>
      Konva.Util.haveIntersection(box, shape.getClientRect())
    );
    // console.log(selected);
    trRef.current.nodes(selected);
    layer.batchDraw();
  };

  const onMouseMove = (e) => {
    // no nothing if we didn't start selection
    if (!selectionRectangle.visible()) {
      return;
    }
    let stage = e.target.getStage();
    let layer = layerRef.current;
    setx2(stage.getPointerPosition().x);
    sety2(stage.getPointerPosition().y);

    selectionRectangle.setAttrs({
      x: Math.min(x1, x2),
      y: Math.min(y1, y2),
      width: Math.abs(x2 - x1),
      height: Math.abs(y2 - y1),
    });
    layer.batchDraw();
  };

  const onClickTap = (e) => {
    // if we are selecting with rect, do nothing
    if (selectionRectangle.visible()) {
      return;
    }
    let stage = e.target.getStage();
    let layer = layerRef.current;
    let tr = trRef.current;
    // if click on empty area - remove all selections
    if (e.target === stage) {
      selectShape(null);
      setNodes([]);
      tr.nodes([]);
      layer.draw();
      return;
    }

    // do nothing if clicked NOT on our rectangles
    if (!e.target.hasName('.rect')) {
      return;
    }

    // do we pressed shift or ctrl?
    const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
    const isSelected = tr.nodes().indexOf(e.target) >= 0;

    console.log('select', isSelected);
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
    <Stage
      width={30000}
      height={30000}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onTouchStart={checkDeselect}
      onClick={onClickTap}
    >
      <Layer ref={layerRef}>
        {rectangles.map((rect, i) => {
          return (
            <Rectangle
              key={i}
              getKey={i}
              shapeProps={rect}
              isSelected={rect.id === selectedId}
              getLength={rectangles.length}
              onSelect={(e) => {
                if (e.current !== undefined) {
                  let temp = nodesArray;
                  if (!nodesArray.includes(e.current)) temp.push(e.current);
                  setNodes(temp);
                  trRef.current.nodes(nodesArray);
                  // trRef.current.nodes(nodesArray);
                  trRef.current.getLayer().batchDraw();
                }
                selectShape(rect.id);
              }}
              onChange={(newAttrs) => {
                const rects = rectangles.slice();
                rects[i] = newAttrs;
                setRectangles(rects);
                // console.log(rects)
              }}
            />
          );
        })}

        <Transformer
          // ref={trRef.current[getKey]}
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      </Layer>
    </Stage>
  );
};

export default Multi2;
