import React from "react";
import { useCallback, useEffect } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";


const Game = () => {
    const {
    unityProvider,
    // sendMessage, // unity 함수를 호출하기 위한 sendMessage 추가
    UNSAFE__detachAndUnloadImmediate: detachAndUnloadImmediate,
    } = useUnityContext({
    loaderUrl: '/build/meta10.loader.js',
    dataUrl: '/build/meta10.data',
    frameworkUrl: '/build/meta10.framework.js',
    codeUrl: '/build/meta10.wasm',
    });


  return (
    <div className="wrapping">
      <Unity
        style={{
          width: '100%',
          height: '100%',
          justifySelf: "center",
          alignSelf: "center",
        }}
        unityProvider={unityProvider}
      />
    </div>
  );
};

export default Game;
