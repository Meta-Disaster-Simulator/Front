import React, { useCallback, useEffect, useState, useRef } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import styled from 'styled-components';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { useUser } from '../../UserContext'; // 사용자 ID
import axios from 'axios'

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
  margin: 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Game = () => {
    const { unityScore, userId, unityNickName, setunityScore } = useUser();
    const [infostr, setinfo] = useState(""); // playerDTO
    const [newstr, setnew] = useState(""); // newDTO
    const [connected, setConnected] = useState(false);
    const stompClient = useRef(null);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");


    const {
    unityProvider,
    requestFullscreen,
    addEventListener,
    removeEventListener,
    sendMessage, // unity 함수를 호출하기 위한 sendMessage 추가
    UNSAFE__detachAndUnloadImmediate: detachAndUnloadImmediate,
  } = useUnityContext({
    onLoaded: () => setLoading(false), // 유니티가 로드되면 로딩 상태를 false로 설정
    loaderUrl: '/build/meta1.loader.js',
    dataUrl: '/build/meta1.data',
    frameworkUrl: '/build/meta1.framework.js',
    codeUrl: '/build/meta1.wasm',
    });

    const api = axios.create({
      baseURL: 'http://54.180.145.34:8080', // https로 바꿔야함
      withCredentials: true
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
        console.log("서버->리액트(실행위치):  ", receivedInfo);
        // 리액트에서 유니티로 보내는 함수
        // (오브젝트의 이름 , 함수 , 매개인자)
        if(receivedInfo.nickname !== unityNickName){
          sendMessage('GameMode', 'playerfromReact', info.body);
        }
      });
      stompClient.current.subscribe('/topic/new', newpersn => {  
        // newpersn == 서버로부터 받은 내용
        const receivedNew = JSON.parse(newpersn.body);
        console.log("서버->리액트(실행위치)new:  ", receivedNew);
        if(receivedNew.nickname !== unityNickName){
          sendMessage('GameMode', 'initfromReact', newpersn.body);
        }
      });
      stompClient.current.subscribe('/topic/chat', chat => {
        console.log("서버->리액트(실행위치)chat:  "+chat.body);
        console.log("서버->리액트(실행위치)chat:  "+chat.body.command);
        const receivedNew = JSON.parse(chat.body).command;
        sendMessage('GameMode', 'ChatfromReact', receivedNew);
      });

      // 구독 설정 후 메시지 전송
      const initJSON = {
        nickname: unityNickName,
        score: unityScore,
        islogin: true,
      };
      stompClient.current.send("/topic/new", {}, JSON.stringify(initJSON)); // JSON 객체를 문자열로 변환하여 전송
    }, error => {
      console.error("Connection error: ", error);
    });
  };


  const disconnect = async () => {
    if (stompClient.current && connected) { 
      const initJSON = {
        nickname: unityNickName,
        score: unityScore,
        islogin: false,
      };
      
      stompClient.current.send("/topic/new", {}, JSON.stringify(initJSON));
      stompClient.current.send("/app/disconnect", {}, userId);
      stompClient.current.disconnect();
      setConnected(false);
      console.log("Disconnected");
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
          var dto = {
            'command' : unityNickName+" entered the lobby."
          }

          console.log("리액트(실행위치)->서버new : "+eventData);
          stompClient.current.send("/topic/chat", {},JSON.stringify(dto)); // JSON 객체를 문자열로 변환하여 전송
          stompClient.current.send("/topic/new", {},eventData); // JSON 객체를 문자열로 변환하여 전송
        }  
      }, [ connected]);

      const sendchat = useCallback((eventData) => {
        if (stompClient.current && connected) {
          console.log("리액트(실행위치)->서버new : "+eventData);    
          stompClient.current.send("/app/chat", {}, eventData); // JSON 객체를 문자열로 변환하여 전송
        }  
      }, [connected]);

      // 유니티에서 리액트로 데이터가 전이 될때 실행되는 로직
      const UnityInfoEvent = useCallback((eventData) => {
        console.log("유니티->리액트(실행위치) : "+eventData);    
        setinfo(eventData);
        console.log("데이터 저장(리액트)"+infostr);
        sendInfo(eventData); // 유니티 데이터를 서버로 
      }, [sendInfo]);
      const UnityChatEvent = useCallback((eventData) => {
        console.log("유니티->리액트(실행위치) : "+eventData);   
        sendchat(eventData); // 유니티 데이터를 서버로 
      }, [sendchat]);
      const UnityNewEvent = useCallback(async (eventData) => {
        const userinfo = JSON.parse(eventData);
        setunityScore(userinfo.score);
        let body = {
          "nickname" : unityNickName,
          "score": unityScore
        };
    
        try {
          const res = await api.post("/score", body)
          console.log(res);
          console.log(res.data);
          if(res.status === 200) {
            console.log("서버에 점수 갱신 성공");
            setMsg("");
          }
        } catch(error) {
          if (error.response && error.response.status === 403) {
            alert("[403] 연결 끊기 에러");
          } else {
            console.error("연결끊기 에러", error);
            setMsg("[??] 연결끊기 에러");
          }
        }

        console.log("유니티->리액트(실행위치) : "+eventData);
        setnew(eventData);
        sendNew(eventData); // 유니티 데이터를 서버로 
      }, [sendNew]);
      const UnityFirstSetting = useCallback(() => {
        console.log("유니티->리액트(실행위치) : 최초 세팅 ");
        
        const userData = {
          nickname: unityNickName,
          score: unityScore
        };
        const jsonUserData = JSON.stringify(userData);
        console.log(jsonUserData);
        sendMessage('GameMode', 'StatfromReact', jsonUserData);
      }, );
    // 전체화면 버튼 처리
    function handleClickEnterFullscreen() {
      requestFullscreen(true);
    }

    function handleBeforeUnload() {
      console.log('웹소켓 연결 끊기 : '+ unityScore);
      disconnect();
    }
    useEffect(() => {
      console.log(`Loading 상태: ${loading}`);
      // requestFullscreen(true); // 전체화면 버튼
      // 윈도우 종료 시
      console.log('user : score : ' + unityScore);
      window.addEventListener('beforeunload', handleBeforeUnload);
      // Adding event listeners
      addEventListener("newplay", UnityNewEvent);
      addEventListener("info", UnityInfoEvent);
      addEventListener("BuildComplete", UnityFirstSetting);
      addEventListener("chat", UnityChatEvent);
      const userData = {
        nickname: unityNickName,
        score: unityScore
      };
      const jsonUserData = JSON.stringify(userData);
      console.log(jsonUserData);
      sendMessage('GameMode', 'StatfromReact', jsonUserData);
      connect();
        // Cleanup function
        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
          removeEventListener("info", UnityInfoEvent);
          removeEventListener("newplay", UnityNewEvent);
          removeEventListener("BuildComplete", UnityFirstSetting);
          removeEventListener("chat", UnityChatEvent);
          if (unityProvider && detachAndUnloadImmediate && typeof detachAndUnloadImmediate === "function") {
              detachAndUnloadImmediate().catch((reason) => {
                  console.error(reason);
              });
          }
      };
  }, [loading, requestFullscreen, unityProvider, detachAndUnloadImmediate, addEventListener, removeEventListener, UnityInfoEvent, UnityNewEvent, UnityChatEvent]);

  return (
    <div className="wrapping">
      {loading ? (
                <div>로딩 중... <p>{loading.toString()}</p></div>
            ) : (
                <Wrapper>
                    <Unity
                        style={{
                            width: '90%',
                            height: '100%',
                            justifySelf: "center",
                            alignSelf: "center",
                            margin: '0',
                        }}
                        unityProvider={unityProvider}
                    />
                    <FullscreenButton onClick={handleClickEnterFullscreen}>
                        전체화면 전환
                    </FullscreenButton>
                </Wrapper>
            )}
    </div>
  );
};

export default Game;
