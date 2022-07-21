import React from 'react';
import styled from 'styled-components';
import Canvas from './Canvas';
import Controls from '../control/Controls';

const Editor = () => {
  return (
    <>
      <EditorWrap>
        <div className="canvas-wrap">
          <Canvas />
        </div>
        <div className="controls-wrap">
          <Controls />
        </div>
      </EditorWrap>
    </>
  );
};

const EditorWrap = styled.div`
  display: flex;
  margin: 0 auto;
  max-width: 800px;
  justify-content: space-between;
  padding: 0 30px;

  .canvas-wrap,
  .controls-wrap {
    width: 50%;
  }

  @media (max-width: 700px) {
    flex-direction: column;
    .canvas-wrap,
    .controls-wrap {
      width: 100%;
      margin: 0 auto;
    }
  }
`;

export default Editor;
