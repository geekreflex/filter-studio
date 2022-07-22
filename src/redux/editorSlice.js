import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  elements: [],
  selectedElem: null,
  dragging: false,
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    addText(state, action) {
      const textStyle = action.payload;
      const textProps = {
        type: 'text',
        text: 'Click to edit',
        x: 80,
        y: 80,
        fontSize: 20,
        fontFamily: 'Ubuntu',
        fill: 'black',
        id: `text${state.elements.length + 1}`,
        ...textStyle,
      };

      const data = state.elements.concat([textProps]);
      state.elements = data;
    },
    addImage(state, action) {
      const data = state.elements.concat([action.payload]);
      state.elements = data;
    },
    setTextValue(state, action) {
      state.selectedElem.text = action.payload;
    },
    setTextColor(state, action) {
      state.selectedElem.fill = action.payload;
    },
    setFontSize(state, action) {
      state.selectedElem.fontSize = action.payload;
    },
    setSelectedElem(state, action) {
      state.selectedElem = action.payload;
    },
    setElements(state, action) {
      state.elements = action.payload;
    },
    saveToStorage(state) {
      window.localStorage.setItem(
        'editor-state',
        JSON.stringify(state.elements)
      );
    },
    moveToTop(state) {
      const items = state.elements.slice();
      const item = items.find((item) => item.id === state.selectedElem.id);
      const index = items.indexOf(item);

      items.splice(index, 1);
      items.splice(index + 1, 0, state.selectedElem);
      state.elements = items;
    },
    moveToBottom(state) {
      const items = state.elements.slice();
      const item = items.find((item) => item.id === state.selectedElem.id);
      const index = items.indexOf(item);

      items.splice(index, 1);
      items.splice(index - 1, 0, state.selectedElem);
      state.elements = items;
    },
    removeElem(state) {
      const items = state.elements.slice();
      const item = items.find((item) => item.id === state.selectedElem.id);
      const index = items.indexOf(item);
      items.splice(index, 1);
      state.elements = items;
      state.selectedElem = null;
    },
    removeAll(state) {
      state.elements = [];
      state.selectedElem = null;
    },
    setDragging(state, action) {
      state.dragging = action.payload;
    },
  },
});

export const {
  addText,
  addImage,
  setTextValue,
  setTextColor,
  setSelectedElem,
  setElements,
  setFontSize,
  saveToStorage,
  moveToTop,
  moveToBottom,
  removeElem,
  removeAll,
  setDragging,
} = editorSlice.actions;
export default editorSlice.reducer;
