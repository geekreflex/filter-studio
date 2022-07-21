import { configureStore } from '@reduxjs/toolkit';
import editorReduce from './editorSlice';

export default configureStore({
  reducer: {
    editor: editorReduce,
  },
});
