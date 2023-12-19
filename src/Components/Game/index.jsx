import React, { useCallback, useEffect, useState, useRef } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import styled from 'styled-components';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { useUser } from '../../UserContext'; // 사용자 ID

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
    const { unityScore, userId, unityNickName } = useUser();
    const [infostr, setinfo] = useState(""); // playerDTO
    const [newstr, setnew] = useState(""); // newDTO
    const [connected, setConnected] = useState(false);
    const stompClient = useRef(null);

    const {
    unityProvider,
    requestFullscreen,
    addEventListener,
    removeEventListener,
    sendMessage, // unity 함수를 호출하기 위한 sendMessage 추가
    UNSAFE__detachAndUnloadImmediate: detachAndUnloadImmediate,
  } = useUnityContext({
    loaderUrl: '/build/meta.loader.js',
    dataUrl: '/build/meta.data',
    frameworkUrl: '/build/meta.framework.js',
    codeUrl: '/build/meta.wasm',
    });

    const connect = () => {
      const socket = new SockJS('http://54.180.145.34:8080/wsconnect'); // 웹소켓 연결 맺기
      stompClient.current = Stomp.over(socket);
      stompClient.current.connect({}, frame => {
        setConnected(true);
        // 서버로 구독 및 구독 포인트에서 오는 데이터 처리
        stompClient.current.subscribe('/topic/info', info => {
          // 구독 topic으로 부터 오는 메시지 처리하는 코드
          const receivedInfo = JSON.parse(info.body);
          console.log("서버->리액트(실행위치):  "+info.body);
          // 리액트에서 유니티로 보내는 함수
          // (오브젝트의 이름 , 함수 , 매개인자)
          if(receivedInfo.nickname !== unityNickName){
            sendMessage('GameMode', 'playerfromReact', info.body);
          }
        });
        stompClient.current.subscribe('/topic/new', newpersn => {  
          // newpersn == 서버로부터 받은 내용
          const receivedNew = JSON.parse(newpersn.body);
          console.log("서버->리액트(실행위치)new:  "+newpersn.body);
          if(receivedNew.nickname !== unityNickName){
            sendMessage('GameMode', 'initfromReact', newpersn.body);
          }
        });
      }, error => {
        console.error("Connection error: ", error);
      });
    };

    const disconnect = () => {
      if (stompClient.current && connected) {
        stompClient.current.disconnect();
        setConnected(false);
      }
    };
    
    //유저의 상태 정보를 websocket(서버)으로 보내는 함수 (리액트->서버)
    const sendInfo = useCallback((eventData) => {
      if (stompClient.current && connected) {
        var dto = {
          'nickname' : 'kangmingi',
          'score':1000,
          'pos_x':3.14,
          'pos_y':3.14,
          'pos_z':3.14,
          'rot_x':3.14,
          'rot_y':3.14,
          'rot_z':3.14,
          'is_jump':false,
          'is_walk':false,
          'is_run':false
      }
        console.log("리액트(실행위치)->서버 : "+eventData);    
        stompClient.current.send("/topic/info", {}, eventData); // JSON 객체를 문자열로 변환하여 전송
      }
    }, [ connected]);
      //유저의 상태 정보를 websocket으로 보내는 함수(리액트->서버)
      const sendNew = useCallback((eventData) => {
        if (stompClient.current && connected) {
          var dto = { // 예시
            'nickname' : 'kangmingi',
            'score':1000,
            'islogin':true
          }
          console.log("리액트(실행위치)->서버new : "+eventData);    
          stompClient.current.send("/topic/new", {},eventData); // JSON 객체를 문자열로 변환하여 전송
        }  
      }, [ connected]);

      // 유니티에서 리액트로 데이터가 전이 될때 실행되는 로직
      const UnityInfoEvent = useCallback((eventData) => {
        console.log("유니티->리액트(실행위치) : "+eventData);    
        setinfo(eventData);
        console.log("데이터 저장(리액트)"+infostr);
        sendInfo(eventData); // 유니티 데이터를 서버로 
      }, [sendInfo]);
      const UnityNewEvent = useCallback((eventData) => {
        console.log("유니티->리액트(실행위치) : "+eventData);   
        setnew(eventData);
        sendNew(eventData); // 유니티 데이터를 서버로 
      }, [sendNew]);
      
    // 전체화면 버튼 처리
    function handleClickEnterFullscreen() {
      requestFullscreen(true);
    }
  
    useEffect(() => {
      requestFullscreen(true); // 전체화면 버튼
      
      // Adding event listeners
      addEventListener("newplay", UnityNewEvent);
      addEventListener("info", UnityInfoEvent);
      const userData = {
        nickname: unityNickName,
        score: unityScore
      };
      const jsonUserData = JSON.stringify(userData);
      console.log(jsonUserData);
      sendMessage('GameMode', 'StatfromReact', jsonUserData);

        // Cleanup function
        return () => {
          removeEventListener("info", UnityInfoEvent);
          removeEventListener("newplay", UnityNewEvent);
          if (unityProvider && detachAndUnloadImmediate && typeof detachAndUnloadImmediate === "function") {
              detachAndUnloadImmediate().catch((reason) => {
                  console.error(reason);
              });
          }
      };
  }, [requestFullscreen, unityProvider, detachAndUnloadImmediate, addEventListener, removeEventListener, UnityInfoEvent, UnityNewEvent]);

  return (
    <div className="wrapping">
      <Wrapper>
            <FullscreenButton onClick={connected ? disconnect : connect}>
              {connected ? '연결 끊기' : '연결하기'}
            </FullscreenButton>
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
