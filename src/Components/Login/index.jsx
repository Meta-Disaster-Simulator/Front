import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // 추가
import styled from 'styled-components';
import axios from 'axios'
//import { Cookies } from "react-cookie";

// 스타일이 적용된 입력 필드 컴포넌트
const StyledInput = styled.input`
  display: block;
  width: 100%;
  padding: 10px;
  margin-bottom: 15px; // 각 요소 사이에 여유 공간을 추가
  box-sizing: border-box; // padding과 border가 width에 포함되도록 설정
  border: 1px solid #ccc;
  border-radius: 4px;
`;

// 스타일이 적용된 버튼 컴포넌트
const StyledButton = styled.button`
  opacity: ${props => props.disabled ? 0.5 : 1};  // 버튼 비활성화 시 투명도 적용
  cursor: ${props => props.disabled ? 'default' : 'pointer'};  // 버튼 비활성화 시 커서 변경
  display: block;
  width: 100%;
  padding: 10px;
  margin-bottom: 15px; // 버튼 아래에 여유 공간을 추가
  background-color: #5c6bc0; // 버튼 색상 설정
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #3f51b5;
  }
`;

const StyledLink = styled(Link)`
  display: block;
  text-align: center;
  margin-top: 10px;
  color: #5c6bc0;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

// 폼 컨테이너 스타일링
const FormContainer = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background: #fff;
`;


const Login = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
//  const cookies = new Cookies();

  const api = axios.create({
    baseURL: 'http://54.180.145.34:8080',
    withCredentials: true
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // 로딩 시작

    if (!id) {
      setLoading(false); // 로딩 종료
      return alert("ID를 입력하세요.");
    } else if (!password) {
      setLoading(false); // 로딩 종료
      return alert("Password를 입력하세요.");
    }

  let body = {
    "id" : id,
    "password": password
  };

  api.post("/login", body, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  .then((res) => {
    console.log(res); // 서버로부터의 응답 데이터 로그
    if(res.status === 200) {
      console.log("로그인 성공");
      // 서버로부터 토큰을 받아오는 경우
      const {accessToken, refreshToken} = res.data;
      // 쿠키에 액세스 토큰과 리프레시 토큰을 저장
      console.log(accessToken);
      console.log(refreshToken);
      document.cookie = `accessToken=${accessToken}; path=/; max-age=3600`; // 1시간 동안 유효
      document.cookie = `refreshToken=${refreshToken}; path=/; max-age=86400`; // 24시간 동안 유효

      // cookies.set('accessToken', accessToken, { path: '/', maxAge: 3600 }); // 1시간 동안 유효
      // cookies.set('refreshToken', refreshToken, { path: '/', maxAge: 86400 }); // 24시간 동안 유효
      setMsg("");
    }
  })
  .catch((error) => {
    setLoading(false); // 로딩 종료
    if (error.response && error.response.status === 403) {
      // 403 에러가 발생했을 때의 처리
      alert("[Error:403] 로그인 정보를 다시 입력하세요."); // 사용자에게 알림
    } else {
      // 다른 종류의 에러 처리
      console.error("로그인 에러", error);
      setMsg("로그인에 실패했습니다. 서버 에러가 발생했습니다.");
    }
  });

  setLoading(false); // 로딩 종료
  };

  useEffect(() => {
    if (msg) {
      setTimeout(() => {
        setMsg("");
      }, 1500);
    }
  }, [msg]);

  return (
    <FormContainer>
      <StyledInput
        type="text"
        id="username"
        placeholder="사용자 이름"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <StyledInput
        type="password"
        id="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <StyledButton onClick={handleSubmit} disabled={loading}>로그인</StyledButton>
      <StyledLink to="/register">회원가입</StyledLink>
    </FormContainer>
  );
};

export default Login;



