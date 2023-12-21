import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'
import styled from 'styled-components';
import { useUser } from '../../UserContext';

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

// 제목을 위한 스타일드 컴포넌트
const Title = styled.h1`
  font-size: 2rem; /* 글자 크기 조정 */
  color: #333; /* 글자 색상 수정 */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; /* 글꼴 가족 설정 */
  text-align: center; /* 텍스트 중앙 정렬 */
  font-weight: bold; /* 글자 두께 */
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1); /* 텍스트에 그림자 효과 추가 */
  margin: 0 0 1.5rem 0; /* 제목 아래에만 마진을 줘서 폼과 간격을 둠 */
`;

// 소제목을 위한 스타일드 컴포넌트
const Subtitle = styled.h2`
  font-size: 1.25rem; /* 글자 크기 조정 */
  color: #555; /* 글자 색상 약간 어둡게 조정 */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; /* 글꼴 가족 설정 */
  text-align: center; /* 텍스트 중앙 정렬 */
  font-weight: normal; /* 글자 두께 */
  margin: 0 0 2rem 0; /* 소제목 아래에 마진을 더 줘서 폼과 간격을 둠 */
  letter-spacing: 0.5px; /* 글자 사이 간격 조정 */
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1); /* 텍스트에 그림자 효과 추가 */
`;


// 전체 페이지를 감싸는 컨테이너에 배경 이미지 추가
const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  background-image: url('image/back5.png'); /* 배경 이미지 경로 설정 */
  background-size: cover; /* 이미지가 전체 배경을 커버하도록 설정 */
  background-position: center; /* 이미지가 중앙에 오도록 설정 */
  background-repeat: no-repeat; /* 이미지가 반복되지 않도록 설정 */
`;

// 폼 컨테이너 스타일링 수정
const FormContainer = styled.div`
  width: 100%;
  max-width: 400px;
  background: #f0f0f0; /* 하얀 배경을 연한 회색으로 변경 */
  margin: 1rem auto; /* 상단 여백 추가 */
  padding: 2rem;
  background: #f0f0f0; /* 하얀 배경을 연한 회색으로 변경 */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background: #fff;
  position: relative; /* 타이틀을 포지셔닝하기 위해 relative 설정 */
`;

const LogoContainer = styled.div`
  background-image: url('image/안전모.png'); // 로고 이미지 경로 설정
  background-size: contain; // 이미지가 컨테이너 내에 맞도록 조정
  background-position: center center; // 이미지 위치를 중앙으로 설정
  background-repeat: no-repeat; // 이미지가 반복되지 않도록 설정
  width: 100px; // 로고 크기를 줄임
  height: 100px; // 로고 크기를 줄임
  margin: 20px auto; // 상단과 하단 여백을 줌, 로고를 수평 중앙 정렬
`;

// // 이미지를 위한 스타일드 컴포넌트
// const ImageContainer = styled.div`
//   background-image: url('image/metalogo.png'); // 이미지 경로 설정
//   background-size: contain; // 이미지가 컨테이너를 꽉 채우도록 설정
//   background-position: center center; // 이미지 위치를 중앙으로 설정
//   background-repeat: no-repeat; // 이미지가 반복되지 않도록 설정
//   width: 100%; // 또는 필요한 크기로 설정
//   height: 100px; // 필요한 높이로 설정
// `;

const Login = () => {
  const { setunityScore } = useUser();
  const { setunityNickName } = useUser();
  const { setUserId } = useUser();
  const [id, setId] = useState(''); // 사용자 아이디 상태 추가
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate(); // useNavigate 훅 사용

  const api = axios.create({
    baseURL: 'http://54.180.145.34:8080', // https로 바꿔야함
    withCredentials: true
  });
  
// *****************로그인 성공 시 사용자 정보 받아오기******************* //
  const axiosStat = async () => {
    const response = await api.post("/stat", { id })
    console.log(response);
    console.log(response.data);
    const { nickname, score } = response.data;
    setunityNickName(nickname);
    setunityScore(score);
    console.log(nickname);

    navigate('/game');
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!id) {
      setLoading(false);
      return alert("아이디를 입력하세요.");
    } else if (!password) {
      setLoading(false);
      return alert("패스워드를 입력하세요.");
    }

  let body = {
    "id" : id,
    "password": password
  };

  try {
    const res = await api.post("/login", body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    console.log(res)
    if(res.status === 200) {
      console.log("로그인 성공");

      const {accessToken, refreshToken} = res.data;
      document.cookie = `accessToken=${accessToken}; path=/; max-age=3600`; // Secure; HttpOnly 제거
      document.cookie = `refreshToken=${refreshToken}; path=/; max-age=86400`;/// 24시간 동안 유효
      setUserId(id); // 로그인 성공 시 사용자 아이디 저장

      try {
        axiosStat()
      }
      catch(error)  {
        console.error("사용자 정보 요청 에러", error);
      };

      setMsg("");
    }
  } catch(error) {
    setLoading(false);
    if (error.response && error.response.status === 403) {
      alert("[Error:403] 로그인 정보를 다시 입력하세요.");
    } else if(error.response && error.response.status === 500){
      alert("해당 아이디가 현재 로그인 중입니다.");
    }
    else {
      // 다른 종류의 에러 처리
      console.error("로그인 에러", error);
      setMsg("로그인에 실패했습니다. 서버 에러가 발생했습니다.");
    }
  }

  setLoading(false);
  };

  useEffect(() => {
    if (msg) {
      setTimeout(() => {
        setMsg("");
      }, 1500);
    }
  }, [msg]);

  return (
  <PageContainer>
    <FormContainer>
      <LogoContainer />
      <Title>메타 재난 시뮬레이션</Title>
      {/*<Subtitle>소제목 넣으면 됨</Subtitle>*/}
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
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSubmit(e);
          }
        }}
      />
      <StyledButton onClick={handleSubmit} disabled={loading}>로그인</StyledButton>
      <StyledLink to="/register">회원가입</StyledLink>
    </FormContainer>
  </PageContainer>
  );
};

export default Login;
      // cookies.set('accessToken', accessToken, { path: '/', maxAge: 3600 }); // 1시간 동안 유효
      // cookies.set('refreshToken', refreshToken, { path: '/', maxAge: 86400 }); // 24시간 동안 유효


  // .then((res) => {
  //   console.log(res); // 서버로부터의 응답 데이터 로그
  //   if(res.status === 200) {
  //     console.log("로그인 성공");
  //     // 서버로부터 토큰을 받아오는 경우
  //     const {accessToken, refreshToken} = res.data;
  //     // 쿠키에 액세스 토큰과 리프레시 토큰을 저장
  //     document.cookie = `accessToken=${accessToken}; path=/; max-age=3600`; // Secure; HttpOnly 제거
  //     document.cookie = `refreshToken=${refreshToken}; path=/; max-age=86400`;/// 24시간 동안 유효
  //     setUserId(id); // 로그인 성공 시 사용자 아이디 저장

  //     // *****************로그인 성공 시 사용자 정보 받아오기******************* //
  //     // 토큰과 함께 id를 서버에 보내서 해당 id가 갖고있는 닉네임과 점수를 받아야 한다.
  //     // get 요청이고, url은 /stat
  //     // 요청 보낼 때 바디로 Key는 1개(id) 밖에 없는 JSON을 실어서 돌려준다.
  //     // 서버로부터 바디는 nickname과 score를 받아온다.
  //     api.post("/stat", { id })
  //       .then((response) => {
  //       console.log(response);
  //       console.log(response.data);
  //       const { nickname, score } = response.data;
  //       setunityNickName(nickname);
  //       setunityScore(score);
  //       console.log(nickname);
  //     })
  //     .catch((error) => {
  //       console.error("사용자 정보 요청 에러", error);
  //     });

  //     navigate('/game');
  //     setMsg("");
  //   }
  // })
  // .catch((error) => {
  //   setLoading(false); // 로딩 종료
  //   if (error.response && error.response.status === 403) {
  //     // 403 에러가 발생했을 때의 처리
  //     alert("[Error:403] 로그인 정보를 다시 입력하세요."); // 사용자에게 알림
  //   } else {
  //     // 다른 종류의 에러 처리
  //     console.error("로그인 에러", error);
  //     setMsg("로그인에 실패했습니다. 서버 에러가 발생했습니다.");
  //   }
  // });