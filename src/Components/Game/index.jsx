import React from "react";
import { useCallback, useEffect } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import styled from 'styled-components';

const FullscreenButton = styled.button`
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }
`;

// 가운데 정렬
const Wrapper = styled.div`
  margin: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh; /* Full height of the viewport */
`;

const Game = () => {
    const {
    unityProvider,
    requestFullscreen,
    // sendMessage, // unity 함수를 호출하기 위한 sendMessage 추가
    } = useUnityContext({
    loaderUrl: '/build/meta.loader.js',
    dataUrl: '/build/meta.data',
    frameworkUrl: '/build/meta.framework.js',
    codeUrl: '/build/meta.wasm',
    });

    function handleClickEnterFullscreen() {
      requestFullscreen(true);
    }
  
    // Use useEffect to call requestFullscreen when the component mounts
    useEffect(() => {
      requestFullscreen(true);
  }, [requestFullscreen]); // Empty dependency array ensures this runs once on mount

  return (
    <div className="wrapping">
      <Wrapper>
            <FullscreenButton onClick={handleClickEnterFullscreen}>
                전체화면 전환
            </FullscreenButton>
            <Unity
                style={{
                    width: '100%',
                    height: '100%',
                    justifySelf: "center",
                    alignSelf: "center",
                }}
                unityProvider={unityProvider}
            />
        </Wrapper>
    </div>
  );
};

export default Game;
