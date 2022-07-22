import React from 'react';
import styled from 'styled-components';

const Loader1 = ({ isLoading }) => {
  return (
    <Wrap visible={isLoading}>
      <div className="loader">
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
    </Wrap>
  );
};

const Wrap = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999;
  justify-content: center;
  align-items: center;
  visibility: ${(props) => (props.visible ? 'visible' : 'hidden')};
  opacity: ${(props) => (props.visible ? '1' : '0')};
  background-color: rgba(255, 255, 255, 0.5);

  .loader .line:nth-last-child(1) {
    animation: loadingC 0.6s 0.1s linear infinite;
  }
  .loader .line:nth-last-child(2) {
    animation: loadingC 0.6s 0.2s linear infinite;
  }
  .loader .line:nth-last-child(3) {
    animation: loadingC 0.6s 0.3s linear infinite;
  }
  .line {
    display: inline-block;
    width: 15px;
    height: 15px;
    border-radius: 15px;
    background-color: #030047;
    margin-right: 5px;
  }

  @keyframes loadingC {
    0% {
      transform: translate(0, 0);
    }
    50% {
      transform: translate(0, 15px);
    }
    100% {
      transform: translate(0, 0);
    }
  }
`;

export default Loader1;
