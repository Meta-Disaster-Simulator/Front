import React from "react";
import { useCallback, useEffect } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";


const Game = () => {
    const {
    unityProvider,
    // sendMessage, // unity 함수를 호출하기 위한 sendMessage 추가
    UNSAFE__detachAndUnloadImmediate: detachAndUnloadImmediate,
    } = useUnityContext({
    loaderUrl: '/build/meta_build.loader.js',
    dataUrl: '/build/meta_build.data',
    frameworkUrl: '/build/meta_build.framework.js',
    codeUrl: '/build/meta_build.wasm',
    });


  return (
    <div className="wrapping">
      <p>20200528 박효준 : 메타버스 기초프로그래밍 발표 <br/> 한글 깨짐으로 인해 빌드된 게임은 유니티에서 실행하겠습니다.  12월 12일 발표 이후 보완하겠습니다.</p>
      <Unity
        style={{
          width: "1300px",
          height: "900px",
          justifySelf: "center",
          alignSelf: "center",
        }}
        unityProvider={unityProvider}
      />
    </div>
  );
};

export default Game;
